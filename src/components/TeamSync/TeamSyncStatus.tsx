'use client';

import { useEffect } from 'react';
import { useTeamSync } from '@/context/TeamSyncContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Pause, Play } from 'lucide-react';

export function TeamSyncStatus() {
  const { 
    syncState, 
    isInitialized,
    pauseSync,
    resumeSync
  } = useTeamSync();

  if (!isInitialized || !syncState) {
    return null;
  }

  const { status, averageFlowScore, participants } = syncState;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Team Sync Status
        </h3>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {participants.length} participants
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                status === 'active' ? 'bg-green-500' : 
                status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="capitalize">{status}</span>
            </div>
            {status === 'active' ? (
              <button
                onClick={() => pauseSync()}
                className="text-gray-600 hover:text-gray-800"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : status === 'paused' ? (
              <button
                onClick={() => resumeSync()}
                className="text-gray-600 hover:text-gray-800"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Flow Score</span>
              <span>{Math.round(averageFlowScore)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${averageFlowScore}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}