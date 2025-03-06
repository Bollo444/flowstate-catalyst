'use client';

import { useEffect, useMemo } from 'react';
import { useTeamSync } from '@/context/TeamSyncContext';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TeamSyncMetrics() {
  const { syncState } = useTeamSync();

  const flowData = useMemo(() => {
    if (!syncState) return [];
    
    return Array.from(syncState.participantStates.entries()).map(([userId, state]) => ({
      userId,
      name: state.user_name || userId,
      score: state.flow_state?.score || 0,
      timestamp: state.last_update
    }));
  }, [syncState]);

  if (!syncState || flowData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h3 className="text-lg font-semibold">Flow Metrics</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={flowData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Flow Score"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {flowData.map((data) => (
          <motion.div
            key={data.userId}
            className="p-3 rounded-lg bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm font-medium text-gray-700">{data.name}</div>
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(data.score)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}