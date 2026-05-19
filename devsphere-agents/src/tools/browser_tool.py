# src/tools/browser_tool.py
import asyncio
from crewai.tools import tool
from langchain_ollama import ChatOllama
from browser_use import Agent as BrowserAgent

# Instantiate a dedicated model configuration layer for our tool execution context
tool_llm = ChatOllama(
    model="qwen2.5-coder:7b",
    temperature=0,
    num_ctx=32000
)

@tool("Live Browser Automation Tool")
def run_browser_automation(research_query: str) -> str:
    """Useful when you need to browse the live web, click buttons, 
    read active pages, or research current online tech updates."""
    
    print(f"\n🌐 [TOOL ACTIONS] Launching local Chromium window task: '{research_query}'...")
    
    async def run():
        agent = BrowserAgent(task=research_query, llm=tool_llm)
        result = await agent.run()
        return result.final_result()
        
    # Get or create the running event loop to safely bridge async/sync barriers
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    return loop.run_until_complete(run())