'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Code2, Layers, Sidebar, Loader2, Sparkles, ArrowUpRight, FileText, Cpu, Wand2, MessageSquare, Terminal } from 'lucide-react';
import FileExplorer from '@/components/FileExplorer';

interface LogLine {
  timestamp: string;
  source: 'SYSTEM' | 'CREWAI' | 'OUTPUT';
  text: string;
}

const initialCode = `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/health')\ndef health_check():\n    return {'status': 'ok'}\n\n@app.post('/execute')\ndef execute_task(task: dict):\n    # AI-generated task execution stub\n    return {'task': task, 'result': 'pending'}\n`;

export default function WorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputPrompt, setInputPrompt] = useState('Refactor the execute endpoint to return a parsed command summary.');
  const [isLoading, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState(initialCode);
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: '17:00:00', source: 'SYSTEM', text: 'Workspace listener ready at http://127.0.0.1:8000' }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const lineNumbers = useMemo(() => {
    return editorContent.split('\n').map((_, index) => index + 1);
  }, [editorContent]);

  const handleAgentExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const dispatchTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { timestamp: dispatchTime, source: 'SYSTEM', text: `Prompt submitted: "${inputPrompt}"` },
      { timestamp: dispatchTime, source: 'CREWAI', text: 'Analyzing request and preparing code update...' }
    ]);

    setIsLoading(true);
    const executionQuery = inputPrompt;
    setInputPrompt('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: executionQuery }),
      });

      if (!response.ok) throw new Error('Local connection error or script build issue.');

      const data = await response.json();
      const nextCode = typeof data.output === 'string' ? data.output : editorContent;

      setEditorContent(nextCode);
      setLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), source: 'OUTPUT', text: 'AI update applied to code editor.' }
      ]);
    } catch (error: any) {
      setLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), source: 'SYSTEM', text: `FAULT: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-[#070709] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans select-none antialiased">
      <header className="h-14 w-full bg-white/95 dark:bg-[#08080d]/95 border-b border-zinc-200 dark:border-zinc-900/70 backdrop-blur-md flex items-center justify-between px-5 text-xs z-20">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-400 font-semibold">Dexa Studio</p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">Next.js editor workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0d0d12] px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#111118] transition"
          >
            <Sidebar className="w-4 h-4" />
          </button>
          <div className="rounded-2xl bg-zinc-100 dark:bg-white/5 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">connected</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white dark:bg-[#070709] border-r border-zinc-200 dark:border-zinc-900/70 overflow-hidden`}>
          <div className="flex flex-col h-full">
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-900/70">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Workspace</span>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">Browse files and switch context instantly.</p>
            </div>
            <div className="flex-1 overflow-y-auto py-3 px-1">
              <FileExplorer />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden p-5 bg-zinc-50 dark:bg-[#08080d]">
          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-5 h-full overflow-hidden">
            <section className="rounded-[2rem] border border-zinc-200 dark:border-zinc-900/70 bg-white dark:bg-[#09090d] overflow-hidden shadow-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-900/70">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">main.py</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">AI-powered code editor</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  <Cpu className="w-3.5 h-3.5" /> Live edit
                </div>
              </div>

              <div className="relative flex-1 p-5 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-16 bg-zinc-100/80 dark:bg-white/5 border-r border-zinc-200 dark:border-zinc-900/80 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-zinc-50/90 dark:from-[#09090d]/90 to-transparent pointer-events-none" />
                <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-zinc-200 dark:border-zinc-900/80 bg-[#0b0c10] dark:bg-[#050507] shadow-inner">
                  <div className="flex h-full">
                    <div className="w-16 pr-3 py-4 text-right text-[11px] leading-6 text-zinc-500 dark:text-zinc-600 select-none overflow-hidden">
                      {lineNumbers.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                    <textarea
                      value={editorContent}
                      onChange={(event) => setEditorContent(event.target.value)}
                      spellCheck={false}
                      className="flex-1 min-h-full resize-none border-none bg-transparent px-4 py-4 text-[13px] leading-6 text-zinc-100 outline-none font-[SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 dark:border-zinc-900/70 bg-white dark:bg-[#070709] flex flex-col overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-900/70">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                  <Wand2 className="w-4 h-4 text-emerald-500" />
                  <span>AI Assistant</span>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">Describe the code change and the editor will reflect the update.</p>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-900/70 bg-zinc-50 dark:bg-[#0d0d11] p-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Assistant briefing</p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Use the prompt to generate code updates, refactors, or new endpoint behavior. The editor supports live editing while your AI request is processed.</p>
                </div>

                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-900/70 bg-zinc-50 dark:bg-[#0d0d11] p-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
                    <MessageSquare className="w-4 h-4 text-sky-500" />
                    <span>Recent steps</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <li>• Discover and edit active code in the central editor.</li>
                    <li>• Send prompts to your local AI runtime.</li>
                    <li>• View status and feedback instantly below.</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleAgentExecution} className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-900/70 bg-white dark:bg-[#08080d]">
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2 block">AI prompt</label>
                <div className="flex gap-3">
                  <input
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    disabled={isLoading}
                    placeholder="E.g. extract task summary, add validation, or refactor to async."
                    className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-900/70 bg-zinc-100 dark:bg-[#0c0c11] px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/80 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputPrompt.trim()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 dark:bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                    <span>Apply</span>
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* <section className="mt-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-900/70 bg-white dark:bg-[#070709] p-5 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
                <Terminal className="w-4 h-4 text-violet-500" />
                <span>Activity stream</span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Live logs</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-3 text-xs text-zinc-500 dark:text-zinc-400 pr-2 scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="rounded-2xl border border-zinc-200 dark:border-zinc-900/70 bg-zinc-50 dark:bg-[#0c0c10] px-4 py-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                    <span>{log.source}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{log.text}</p>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </section> */}
        </main>
      </div>
    </div>
  );
}
