import asyncio
import os
from dotenv import load_dotenv
from chat_sdk import PlanningChatSDK

# Load environment variables from .env file
load_dotenv()

async def test_sql_agent():
    # Ensure environment variables are loaded
    if not os.getenv("OPENAI_API_KEY"):
        raise EnvironmentError("OPENAI_API_KEY not found in environment variables")
    
    sdk = PlanningChatSDK()
    
    # Test cases
    test_messages = [
        # Write operations
        #"Insert a new user named John Doe with email john@example.com into the users table",
        #"Update the status to 'completed' for task_id 123",
        #"Delete all records from the logs table where date is older than 30 days",
        "please add 10% to Comfortable Office Chair Asia Pacific Region for all months and save it to forecast version",
        
        # Read operations
        #"Show me all users from the users table",
        #"Get the count of active tasks",
        #"List all orders from yesterday"
    ]
    
    for message in test_messages:
        print("\n" + "="*50)
        print(f"Testing message: {message}")
        try:
            result = await sdk.process_message(message)
            print(f"Query Type: {result['query_type']}")
            print(f"Response: {result['response']}")
        except Exception as e:
            print(f"Error processing message: {str(e)}")

# Run the test
if __name__ == "__main__":
    asyncio.run(test_sql_agent())