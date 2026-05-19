// components/FileExplorer.tsx
'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  language?: string;
}

const mockDirectoryData: FileNode[] = [
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

interface NodeProps {
  node: FileNode;
  depth: number;
}

function DirectoryNode({ node, depth }: NodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 1); // Auto-open root folder
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
            <span className="w-3" /> {/* Spacer to align with folder chevrons */}
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

export default function FileExplorer() {
  return (
    <div className="flex-1 overflow-y-auto py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {mockDirectoryData.map((node, idx) => (
        <DirectoryNode key={idx} node={node} depth={0} />
      ))}
    </div>
  );
}