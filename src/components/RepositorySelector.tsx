'use client';

// Repository selector component with radio buttons following cursor rules
import React from 'react';
import type { SupportedRepo } from '@/lib/github/types';

interface RepositorySelectorProps {
  selectedRepository: SupportedRepo | 'all';
  onRepositoryChange: (repository: SupportedRepo | 'all') => void;
  className?: string;
}

const AVAILABLE_REPOS: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
const REPO_OWNERS: Record<SupportedRepo, string> = {
  'TransformerEngine': 'NVIDIA',
  'Fuser': 'NVIDIA', 
  'lightning-thunder': 'Lightning-AI'
};
const REPO_DISPLAY_NAMES: Record<SupportedRepo, string> = {
  'TransformerEngine': 'TransformerEngine',
  'Fuser': 'NvFuser',
  'lightning-thunder': 'lightning-thunder'
};

export function RepositorySelector({ 
  selectedRepository, 
  onRepositoryChange, 
  className = '' 
}: RepositorySelectorProps) {
  const handleRepositoryChange = (repo: SupportedRepo | 'all') => {
    onRepositoryChange(repo);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Repository Filter</h3>
        <div className="text-sm text-gray-500">
          Single selection mode
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        {/* All Repositories Radio Button */}
        <div className="flex items-center">
          <input
            id="all-repos"
            name="repository"
            type="radio"
            checked={selectedRepository === 'all'}
            onChange={() => handleRepositoryChange('all')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="all-repos" className="ml-3 text-sm font-medium text-gray-900">
            All Repositories
          </label>
          <span className="ml-auto text-xs text-gray-500">
            1,431 issues
          </span>
        </div>

        {/* Individual Repository Radio Buttons */}
        <div className="space-y-2">
          {AVAILABLE_REPOS.map((repo) => (
            <div key={repo} className="flex items-center">
              <input
                id={`repo-${repo}`}
                name="repository"
                type="radio"
                checked={selectedRepository === repo}
                onChange={() => handleRepositoryChange(repo)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`repo-${repo}`} className="ml-3 text-sm text-gray-700">
                {REPO_OWNERS[repo]}/{REPO_DISPLAY_NAMES[repo]}
              </label>
              {/* Repository Stats */}
              <span className="ml-auto text-xs text-gray-500">
                {repo === 'TransformerEngine' ? '496 issues' : 
                 repo === 'Fuser' ? '935 issues' : 
                 '362 issues'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}