// src/components/Dashboard/AgentsList.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AgentsListProps } from './types';

const AgentsList: React.FC<AgentsListProps> = ({ agents, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full  bg-white dark:bg-gray-950 rounded-lg ">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Agents actifs</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {agents.length > 0 ? (
          agents.slice(0, 5).map((agent) => (
            <li key={agent.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{agent.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium  truncate">{agent.name}</p>
                  <p className="text-sm text-gray-500  truncate">{agent.email}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </li> 
          ))
        ) : (
          <li className="px-4 py-3 text-center text-sm text-gray-500">Aucun agent trouvé</li>
        )}
      </ul>
      <div className="px-4 py-3 border-t border-gray-200">
        <a href="/users" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          Voir tous les agents <ChevronRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default AgentsList;