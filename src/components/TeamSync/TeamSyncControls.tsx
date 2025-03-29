"use client";

import { useState } from "react";
import { useTeamSync } from "@/context/TeamSyncContext";
import { motion } from "framer-motion";
import { Play, X, Users, AlertCircle } from "lucide-react";

interface TeamSyncControlsProps {
  availableParticipants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

export function TeamSyncControls({
  availableParticipants,
}: TeamSyncControlsProps) {
  const { startSync, endSync, syncState, error } = useTeamSync();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const handleStartSync = async () => {
    if (selectedParticipants.length < 2) {
      return;
    }
    await startSync(selectedParticipants);
  };

  const handleEndSync = async () => {
    if (!syncState) return;
    await endSync(syncState.averageFlowScore);
  };

  if (syncState?.status === "active" || syncState?.status === "paused") {
    return (
      <motion.button
        onClick={handleEndSync}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-4 h-4" />
        End Sync Session
      </motion.button>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4" />
          <span>Select Participants</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableParticipants.map((participant) => (
            <motion.button
              key={participant.id}
              onClick={() => {
                setSelectedParticipants((prev) =>
                  prev.includes(participant.id)
                    ? prev.filter((id) => id !== participant.id)
                    : [...prev, participant.id]
                );
              }}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                selectedParticipants.includes(participant.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              )}
              <span className="text-sm truncate">{participant.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        onClick={handleStartSync}
        disabled={selectedParticipants.length < 2}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
          selectedParticipants.length < 2
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        whileTap={selectedParticipants.length >= 2 ? { scale: 0.95 } : {}}
      >
        <Play className="w-4 h-4" />
        Start Sync Session
      </motion.button>
    </div>
  );
}
