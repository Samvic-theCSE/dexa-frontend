# src/crew.py
import asyncio
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.tools import tool
from langchain_ollama import ChatOllama
from browser_use import Agent as BrowserAgent
from src.tools.browser_tool import run_browser_automation

# Define our shared local compute model
local_llm = ChatOllama(
    model="qwen2.5-coder:7b",
    temperature=0,
    num_ctx=32000
)

# 1. Define the custom Browser Automation tool
@tool("Live Browser Automation Tool")
def run_browser_automation(research_query: str) -> str:
    """Useful when you need to browse the live web, click buttons, 
    read active pages, or research current online tech updates."""
    print(f"\n🌐 [TOOL] Spawning Browser-Use context for: '{research_query}'...")
    
    async def run():
        agent = BrowserAgent(task=research_query, llm=local_llm)
        result = await agent.run()
        return result.final_result()
        
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(run())


@CrewBase
class DevSphereCrew:
    """DevSphere Multi-Agent Execution Workforce Engine"""
    
    # Paths to your clean YAML configurations
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def research_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["research_agent"],
            tools=[run_browser_automation],
            llm=local_llm,
            verbose=True
          )

    @agent
    def coding_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["coding_agent"],
            llm=local_llm,
            verbose=True
        )

    @task
    def task_research(self) -> Task:
        return Task(config=self.tasks_config["task_research"])

    @task
    def task_compile(self) -> Task:
        return Task(config=self.tasks_config["task_compile"])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,  # Automatically gathered by @agent decorators
            tasks=self.tasks,    # Automatically gathered by @task decorators
            process=Process.hierarchical,
            manager_llm=local_llm,
            verbose=True
        )