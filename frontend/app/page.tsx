// app/page.tsx
'use client';

import React, { useState } from 'react';
import { Terminal, Code2, Play, Layers, Sidebar, Loader2, Folder, FolderOpen, FileCode, FileText, ChevronDown, ChevronRight } from 'lucide-react';

// ==========================================
// 1. TYPES & DATA STRUCURES FOR IDE ENGINE
// ==========================================
interface LogLine {
  timestamp: string;
  source: 'SYSTEM' | 'CREWAI' | 'OUTPUT';
  text: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const workspaceTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'config',
        type: 'folder',
        children: [
          { name: 'agents.yaml', type: 'file' },
          { name: 'tasks.yaml', type: 'file' }
        ]
      },
      {
        name: 'tools',
        type: 'folder',
        children: [
          { name: '__init__.py', type: 'file' },
          { name: 'browser_tool.py', type: 'file' }
        ]
      },
      { name: 'crew.py', type: 'file' },
      { name: 'main.py', type: 'file' },
      { name: '__init__.py', type: 'file' }
    ]
  },
  { name: 'requirements.txt', type: 'file' },
  { name: 'README.md', type: 'file' }
];

// ==========================================
// 2. INTERNAL FILE EXPLORER RENDERER
// ==========================================
function DirectoryNode({ node, depth }: { node: FileNode; depth: number }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';

  return (
    <div className="font-mono text-xs select-none">
      <div 
        className="flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-800/60 rounded cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <>
            {isOpen ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />}
            {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-indigo-400" /> : <Folder className="w-3.5 h-3.5 text-indigo-400" />}
          </>
        ) : (
          <>
            <span className="w-3" />
            {node.name.endsWith('.md') ? (
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
            )}
          </>
        )}
        <span className={isFolder ? "font-semibold text-zinc-300" : "text-zinc-400"}>{node.name}</span>
      </div>

      {isFolder && isOpen && node.children && (
        <div className="mt-0.5">
          {node.children.map((child, idx) => (
            <DirectoryNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MASTER WORKSPACE MAIN PAGE COMPONENT
// ==========================================
export default function WorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>(
    `# Dexa Workspace Sandbox\n# Your multi-agent workforce output targets will render right here.\n\ndef initial_handshake():\n    print("System active and standing by...")`
  );
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: '12:00:00 AM', source: 'SYSTEM', text: 'Telemetry active. Python FastAPI interface linked on localhost:8000.' }
  ]);

  const handleAgentExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const dispatchTime = new Date().toLocaleTimeString();
    
    // Append routing feedback immediately into terminal panel array
    setLogs((prev) => [
      ...prev,
      { timestamp: dispatchTime, source: 'SYSTEM', text: `Dispatched multi-agent task: "${inputPrompt}"` },
      { timestamp: dispatchTime, source: 'CREWAI', text: 'Spawning agent hierarchy inside local server environment...' }
    ]);
    
    setIsLoading(true);
    const executionQuery = inputPrompt;
    setInputPrompt('');

    try {
      // POST the user's objective straight down to your Python FastAPI server
      const response = await fetch('http://127.0.0.1:8000/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: executionQuery }),
      });

      if (!response.ok) throw new Error('API Core rejected request package or timed out.');

      const data = await response.json();

      setLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), source: 'OUTPUT', text: 'Crew verification sequence complete! Final asset code mapped below.' }
      ]);
      
      // Inject the compiled script result directly into your code box container
      setGeneratedCode(data.output);

    } catch (error: any) {
      setLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), source: 'SYSTEM', text: `CRITICAL PIPELINE EXCEPTION: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      
      {/* Top Application Header Status Ribbon */}
      <header className="h-12 w-full bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 text-xs font-mono tracking-wider text-zinc-400 z-10">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-zinc-200 uppercase tracking-widest">DEXA WORKSPACE</span>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            LOCAL RUNTIME HOST
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-zinc-500 text-[11px]">ENDPOINT: http://127.0.0.1:8000</span>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1.5 hover:bg-zinc-800 rounded transition text-zinc-300"
          >
            <Sidebar className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Workspace Inner Body Split */}
      <div className="flex-1 flex w-full overflow-hidden">
        
        {/* Dynamic Project Module Sidebar Tree */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-zinc-900/40 border-r border-zinc-800 flex flex-col overflow-hidden`}>
          <div className="p-3 border-b border-zinc-800/60 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            <span>PROJECT EXPLORER</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
            {workspaceTree.map((node, idx) => (
              <DirectoryNode key={idx} node={node} depth={0} />
            ))}
          </div>
        </aside>

        {/* Central Workspace Window Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Main Visualizer Container Block */}
          <div className="flex-1 bg-zinc-950 p-4 flex flex-col relative">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded w-fit text-xs font-mono text-zinc-400 mb-3">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>agent_output.py</span>
            </div>
            <div className="flex-1 w-full border border-zinc-900 bg-zinc-900/10 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-y-auto whitespace-pre-wrap select-text">
              {generatedCode}
            </div>
          </div>

          {/* Console Output Logger & Shell Input Tray */}
          <section className="h-80 bg-zinc-900 border-t border-zinc-800 flex flex-col font-mono">
            <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs font-bold text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>AGENT STREAM TRACE REEL</span>
              </div>
              {isLoading && (
                <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-normal">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  CREW IS ACTIVE INTERNALLY...
                </div>
              )}
            </div>
            
            {/* Real-time Streaming Logs Output Context */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1 text-xs text-zinc-300 select-text">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-zinc-600">[{log.timestamp}]</span>
                  <span className={`font-bold tracking-tight ${
                    log.source === 'SYSTEM' ? 'text-amber-500' : log.source === 'CREWAI' ? 'text-indigo-400' : 'text-emerald-400'
                  }`}>[{log.source}]</span>
                  <span className="text-zinc-300 flex-1">{log.text}</span>
                </div>
              ))}
            </div>

            {/* User Shell Command Form Submitter */}
            <form onSubmit={handleAgentExecution} className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
              <input 
                type="text" 
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={isLoading}
                placeholder={isLoading ? "Agent cluster is running local subprocess execution grids..." : "Command the agent suite (e.g., 'Scrape the latest browser-use features')..."}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition disabled:opacity-40 font-mono"
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputPrompt.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition disabled:opacity-40"
              >
                <Play className="w-4 h-4 fill-white text-transparent" />
              </button>
            </form>
          </section>

        </main>
      </div>
    </div>
  );
}