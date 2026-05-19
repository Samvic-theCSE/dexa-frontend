'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
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

function DirectoryNode({ node, depth }: { node: FileNode; depth: number }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';

  return (
    <div className="font-mono text-xs select-none">
      <div 
        className="flex items-center gap-1.5 py-1 px-2 mx-1 rounded-md cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <>
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> : <Folder className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
          </>
        ) : (
          <>
            <span className="w-3" />
            {node.name.endsWith('.md') ? (
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
          </>
        )}
        <span>{node.name}</span>
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
    <div className="flex-1 overflow-y-auto py-2 space-y-2 px-2">
      {mockDirectoryData.map((node, idx) => (
        <DirectoryNode key={idx} node={node} depth={0} />
      ))}
    </div>
  );
}
