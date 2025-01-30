from typing import Dict, TypedDict, Annotated, Sequence
import pandas as pd
from langgraph.graph import StateGraph
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseLLM
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define our state type
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    next: str
    query_type: str  # 'read' or 'write'

class AzureEndpointLLM:
    def __init__(self):
        self.endpoint = os.getenv('AZURE_ENDPOINT')
        self.api_key = os.getenv('AZURE_API_KEY')
        
    def invoke(self, messages):
        try:
            # Extract the actual message content from the last message
            user_message = messages[-1].content if isinstance(messages, list) else messages
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'input_text': user_message
            }
            
            response = requests.post(
                self.endpoint,
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()['sql_query']
            else:
                raise Exception(f"Azure endpoint returned status code: {response.status_code}")
                
        except Exception as e:
            print(f"Azure endpoint error: {str(e)}")
            raise e

# Initialize both LLMs
azure_llm = AzureEndpointLLM()
openai_fallback = ChatOpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    model=os.getenv('MODEL_NAME', 'gpt-4-turbo-preview'),
    temperature=0.1
)

def try_llm_with_fallback(messages, is_write_operation=True):
    """Try Azure endpoint first, fallback to OpenAI if it fails"""
    try:
        if is_write_operation:
            return azure_llm.invoke(messages)
        else:
            # For read operations, use a simpler response
            return "Data read operation processed successfully"
    except Exception as e:
        print(f"Falling back to OpenAI due to: {str(e)}")
        response = openai_fallback.invoke(messages)
        return response.content

def format_dataframe_result(df: pd.DataFrame) -> str:
    """Format DataFrame results into a readable string summary."""
    return f"Found {len(df)} records. Summary: {df.head(3).to_dict(orient='records')}"

# Define agent nodes
def decision_manager(state: AgentState) -> AgentState:
    """Determine if the request is a read or write operation."""
    messages = state["messages"]
    last_message = messages[-1].content.lower()
    
    # Simple heuristic for query type detection
    write_keywords = ['insert', 'update', 'delete', 'create', 'drop', 'alter', 'add', 'increase']
    is_write = any(keyword in last_message for keyword in write_keywords)
    
    return {
        "messages": messages,
        "next": "sql_agent" if is_write else "read_handler",
        "query_type": "write" if is_write else "read"
    }

def sql_agent(state: AgentState) -> AgentState:
    """Generate SQL queries for write operations. Think step by step and provide the answer"""
    messages = state["messages"]
    
    response = try_llm_with_fallback(messages, is_write_operation=True)
    new_messages = list(messages) + [AIMessage(content=response)]
    
    return {
        "messages": new_messages,
        "next": "end",
        "query_type": state["query_type"]
    }

def read_handler(state: AgentState) -> AgentState:
    """Handle read operations using the provided data."""
    messages = state["messages"]
    
    response = try_llm_with_fallback(messages, is_write_operation=False)
    new_messages = list(messages) + [AIMessage(content=response)]
    
    return {
        "messages": new_messages,
        "next": "end",
        "query_type": state["query_type"]
    }

# Create the graph
workflow = StateGraph(AgentState)

# Add nodes to the graph
workflow.add_node("decision_manager", decision_manager)
workflow.add_node("sql_agent", sql_agent)
workflow.add_node("read_handler", read_handler)

# Add end node
workflow.add_node("end", lambda x: x)

# Define edges with conditional routing
workflow.add_conditional_edges(
    "decision_manager",
    lambda x: x["next"],
    {
        "sql_agent": "sql_agent",
        "read_handler": "read_handler"
    }
)

# Add remaining edges
workflow.add_edge("sql_agent", "end")
workflow.add_edge("read_handler", "end")

# Set entry point
workflow.set_entry_point("decision_manager")

# Compile the graph
app = workflow.compile()

class PlanningChatSDK:
    def __init__(self):
        self.config = {
            "app": workflow.compile()
        }
    
    async def process_message(self, message: str) -> Dict:
        """Process a user message and return the response."""
        initial_state = {
            "messages": [HumanMessage(content=message)],
            "next": "decision_manager",
            "query_type": ""
        }
        
        result = self.config["app"].invoke(initial_state)
        
        # Extract the last AI message
        ai_response = None
        for message in reversed(result["messages"]):
            if isinstance(message, AIMessage):
                ai_response = message.content
                break
        
        return {
            "response": ai_response or "No response generated",
            "query_type": result["query_type"]
        }

    async def get_tools(self) -> list:
        """Return available planning tools."""
        return [] 