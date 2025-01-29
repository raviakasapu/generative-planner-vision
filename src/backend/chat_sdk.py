from typing import Dict, TypedDict, Annotated, Sequence
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
    model="gpt-4-turbo-preview",
    temperature=0.7
)

# Define our planning tools
planning_tools = [
    Tool(
        name="update_spreadsheet",
        description="Update the planning spreadsheet with new information",
        func=lambda x: "Spreadsheet updated successfully"  # Replace with actual implementation
    ),
    Tool(
        name="get_business_logic",
        description="Retrieve business logic rules and constraints",
        func=lambda x: "Retrieved business logic rules"  # Replace with actual implementation
    )
]

# Define agent nodes
def agent(state: AgentState) -> AgentState:
    """Process messages and generate responses using the planning agent."""
    messages = state["messages"]
    
    # Prepare the system message
    system_message = """You are a planning assistant that helps with project management and scheduling.
    You can update spreadsheets and check business logic rules."""
    
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
    
    # Use tools based on the last message
    # This is a simplified implementation
    tool_response = "Tool execution result"
    
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
    
    async def process_message(self, message: str) -> str:
        """Process a user message and return the response."""
        initial_state = {
            "messages": [HumanMessage(content=message)],
            "next": "agent"
        }
        
        # Run the workflow
        result = self.config["app"].invoke(initial_state)
        
        # Extract the last AI message
        for message in reversed(result["messages"]):
            if isinstance(message, AIMessage):
                return message.content
        
        return "No response generated"

    async def get_tools(self) -> list:
        """Return available planning tools."""
        return self.config["tools"] 