# DevSphere Agentic Engine API (CrewAI + Local Ollama)

An asynchronous, modular multi-agent backend runtime environment powered by **CrewAI**, **FastAPI**, and **Ollama**. This system utilizes a hierarchical supervisor architecture to delegate tasks across specialized agents capable of executing autonomous browser-based actions via **browser-use** and compiling pristine Python scripts.

---

## 📂 Project Directory Layout

```text
devsphere-agents/
├── requirements.txt         # Global framework dependencies
├── README.md                # System Documentation Manifest
└── src/
    ├── __init__.py          # Python package context exposure marker
    ├── main.py              # FastAPI ASGI Server Initialization & Routing
    ├── crew.py              # CrewAI class-based base configuration manager
    ├── config/
    │   ├── agents.yaml      # Worker identity paradigms & backstories
    │   └── tasks.yaml       # Objective conditions, contexts & expectations
    └── tools/
        ├── __init__.py      # Global tool inventory controller
        └── browser_tool.py  # Standalone browser-use sandbox execution wrapper
        
🛠️ System Architecture
Plaintext
       [ Client Request ]
               │  (HTTP POST /api/run-agent)
               ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    FastAPI Router                       │
   │                    (src/main.py)                        │
   └─────────────────────────────────────────────────────────┘
               │  (Instantiates Class-Based Pipeline)
               ▼
   ┌─────────────────────────────────────────────────────────┐
   │             DevSphereCrew (Hierarchical Manager)         │
   │                    (src/crew.py)                        │
   └─────────────────────────────────────────────────────────┘
          │                                  │
          ▼ (Delegates Tasks)                ▼ (Delegates Tasks)
┌────────────────────────────────┐  ┌────────────────────────────────┐
│      Senior Web Researcher     │  │    Expert Software Engineer    │
├────────────────────────────────┤  ├────────────────────────────────┤
│ 📂 Config: agents.yaml         │  │ 📂 Config: agents.yaml         │
│ 🛠️ Tool: run_browser_automation │  │ 📝 Logic: Python Compiler       │
└────────────────────────────────┘  └────────────────────────────────┘
Workforce Architecture Specs
Compute Layer: Powered completely by local inference using qwen2.5-coder:7b (32k context window configured to safely handle raw HTML strings).

Relative Import Grid: The workspace utilizes a root package binding. All tools are registered in src/tools/__init__.py and exposed back to the core orchestration layout cleanly.

🚀 Quick Start Guide
1. Model Preparation
Ensure you have your local instance of Ollama running with the designated target model configuration:

Bash
ollama run qwen2.5-coder:7b
2. Environment Verification
Install required project package dependencies and configure your system's virtual Chromium instance:

Bash
pip install -r requirements.txt
playwright install
3. Launching the App Stream
To ensure relative path definitions lookups resolve correctly without breaking runtime threads, execute the ASGI application directly from the root devsphere-agents/ directory using Python's internal module flag:

Bash
python -m src.main
The server will bind and actively monitor incoming frame requests at: http://127.0.0.1:8000

📡 API Interface Endpoint Specifications
Execute Multi-Agent Action Mesh
Endpoint: /api/run-agent

Method: POST

Headers: Content-Type: application/json

Request JSON Input Sample:
JSON
{
  "prompt": "Look up the version number of the browser-use repo and create an initialized logger script."
}
Response JSON Payload Output (200 OK):
JSON
{
  "status": "SUCCESS",
  "output": "### Extraction Summary ... ```python\nimport logging\n...```"
}
🔒 Security Operations Boundary
Cross-Origin Resources (CORS): Explicitly hardcoded to authorize requests originating from port http://localhost:3000.

Runtime Isolation: The browser-tool.py environment spins up a native browser layout context. Do not authorize unverified administrative tasks or pass root file system deletion mutations to the automated browser context.


---

Save this version, hit `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to split open the VS Code Markdown preview pane, and you will see everything render flawlessly with crisp boundaries! 

Everything else in your file explorer view on the left side of your screenshot looks structu