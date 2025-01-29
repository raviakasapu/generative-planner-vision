from typing import Dict, TypedDict, Annotated, Sequence
import pandas as pd
from langgraph.graph import Graph
from langgraph.prebuilt import ToolMessage
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from operator import itemgetter

# Define our state type
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    next: str

# Initialize our LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=1.0
)

def format_dataframe_result(df: pd.DataFrame) -> str:
    """Format DataFrame results into a readable string summary."""
    return f"Found {len(df)} records. Summary: {df.head(3).to_dict(orient='records')}"

# Define our planning tools
planning_tools = [
    Tool(
        name="return filtered dataframe",
        description="return filtered dataframe",
        func=lambda x: format_dataframe_result(pd.DataFrame({
            'task': ['Task 1', 'Task 2'],
            'status': ['In Progress', 'Completed']
        }))
    ),
    Tool(
        name="get_business_logic",
        description="Retrieve business logic rules and constraints",
        func=lambda x: format_dataframe_result(pd.DataFrame({
            'rule': ['Rule 1', 'Rule 2'],
            'description': ['Description 1', 'Description 2']
        }))
    )
]

# Define agent nodes
def agent(state: AgentState) -> AgentState:
    """Process messages and generate responses using the planning agent."""
    messages = state["messages"]
    
    # Prepare the system message
    system_message = """You are a text to sql model that helps users to filter slice and dice data returnn a dataframe"""
    
    # Generate response using the LLM
    response = llm.invoke(messages)
    
    # Add the response to messages
    new_messages = list(messages) + [AIMessage(content=response.content)]
    
    return {
        "messages": new_messages,
        "next": "tool_caller" if "use tool" in response.content.lower() else "end"
    }

def tool_caller(state: AgentState) -> AgentState:
    """Handle tool operations based on agent response."""
    messages = state["messages"]
    last_message = messages[-1]
    
    # Parse the tool name from the last message
    # This is a simplified implementation - you might want to add more robust parsing
    tool_name = "update_spreadsheet"  # Default tool
    if "business logic" in last_message.content.lower():
        tool_name = "get_business_logic"
    
    # Find and execute the requested tool
    tool = next((t for t in planning_tools if t.name == tool_name), None)
    if tool:
        tool_response = tool.func("")  # Pass appropriate parameters based on the message
    else:
        tool_response = "Tool not found"
    
    new_messages = list(messages) + [ToolMessage(content=tool_response)]
    
    return {
        "messages": new_messages,
        "next": "agent"
    }

# Create the graph
workflow = Graph()

# Add nodes to the graph
workflow.add_node("agent", agent)
workflow.add_node("tool_caller", tool_caller)

# Add edges
workflow.add_edge("agent", "tool_caller")
workflow.add_edge("tool_caller", "agent")

# Set entry point
workflow.set_entry_point("agent")

# Set exit point
workflow.set_finish_point("end")

# Compile the graph
app = workflow.compile()

class PlanningChatSDK:
    def __init__(self):
        self.config = {
            "app": app,
            "tools": planning_tools
        }
    
    async def process_message(self, message: str) -> Dict:
        """Process a user message and return the response with summary data."""
        initial_state = {
            "messages": [HumanMessage(content=message)],
            "next": "agent"
        }
        
        # Run the workflow
        result = self.config["app"].invoke(initial_state)
        
        # Extract the last AI message and tool message
        ai_response = None
        tool_data = None
        
        for message in reversed(result["messages"]):
            if isinstance(message, AIMessage) and not ai_response:
                ai_response = message.content
            elif isinstance(message, ToolMessage) and not tool_data:
                tool_data = message.content
            
            if ai_response and tool_data:
                break
        
        return {
            "response": ai_response or "No response generated",
            "data": tool_data
        }

    async def get_tools(self) -> list:
        """Return available planning tools."""
        return self.config["tools"] 