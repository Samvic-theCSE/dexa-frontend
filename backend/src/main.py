from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.src.crew import DevSphereCrew

app = FastAPI(
    title="DevSphere Agentic Engine API",
    version="1.0",
    description="Asynchronous backend routing layer for multi-agent execution frames."
)

# Enable CORS cross-origin allowances so your Next.js frontend can connect smoothly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your target Next.js server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the strict request data structure coming from your frontend
class AgentRequest(BaseModel):
    prompt: str

# Define what your frontend expects to receive back
class AgentResponse(BaseModel):
    status: str
    output: str

@app.post("/api/run-agent", response_model=AgentResponse)
async def execute_agent_pipeline(payload: AgentRequest):
    print(f"\n⚡ Incoming request received! Prompt: {payload.prompt}")
    
    try:
        # 1. Instantiate your class-based Crew configuration
        dev_crew_instance = DevSphereCrew().crew()
        
        # 2. Kickoff execution asynchronously using background threads
        # CrewAI will automatically merge custom input tokens if your tasks use brackets {}
        result = dev_crew_instance.kickoff(inputs={"user_instruction": payload.prompt})
        
        # 3. Format and return your structured deliverable
        return AgentResponse(
            status="SUCCESS",
            output=str(result)
        )
        
    except Exception as e:
        print(f"❌ Critical pipeline failure occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent execution error: {str(e)}")

# Local runner execution block
if __name__ == "__main__":
    import uvicorn
    # Run the Uvicorn ASGI application server on port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)