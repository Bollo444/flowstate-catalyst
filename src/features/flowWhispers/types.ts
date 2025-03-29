export interface FlowWhisperSystem {
  categories: WhisperCategory[];
  streaks: FlowStreak;
  preferences: WhisperPreferences;
  animations: WhisperAnimation[];
  rewards: FlowReward[];
}

export interface WhisperCategory {
  id: string;
  name: string;
  triggers: string[];
  messages: FlowMessage[];
  intensity: "gentle" | "moderate" | "energetic";
}

export interface FlowMessage {
  text: string;
  intensity: "gentle" | "moderate" | "energetic";
}

export interface FlowStreak {
  level: number;
  score: number;
}

export interface WhisperPreferences {
  categoryEnabled: string[];
  intensityLevel: "gentle" | "moderate" | "energetic";
}

export interface WhisperAnimation {
  name: string;
  keyframes: any; // Define keyframes type if needed
}

export interface FlowReward {
  id: string;
  trigger: "streak" | "achievement" | "interaction";
  threshold: number;
  reward: {
    type: "badge" | "theme" | "animation" | "power-up";
    content: any;
  };
}

export interface WhisperProps {
  message: string;
  animation: keyof typeof import("./animations").whisperAnimations;
  interaction: "emoji" | "quick-reply" | "acknowledge";
}
