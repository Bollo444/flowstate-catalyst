import { WhisperCategory } from "./types";

const whisperCategories: WhisperCategory[] = [
  {
    id: "motivation",
    name: "Motivation Waves",
    messages: [
      { text: "Riding the Flowtastic wave! 🌊", intensity: "energetic" },
      { text: "Flow and grow, that's your motto! ⚡", intensity: "moderate" },
      {
        text: "Maintaining that Flowtastic momentum! 🚀",
        intensity: "energetic",
      },
    ],
    triggers: [], // Add triggers if needed
    intensity: "energetic",
  },
  {
    id: "achievement",
    name: "Flow Milestones",
    messages: [
      {
        text: "30 minutes of pure flow! Flowtastic! ✨",
        intensity: "energetic",
      },
      {
        text: "You've maintained Flowtastic movement for 1 hour! 🎯",
        intensity: "energetic",
      },
    ],
    triggers: [], // Add triggers if needed
    intensity: "energetic",
  },
  {
    id: "focus",
    name: "Flow Check-ins",
    messages: [
      {
        text: "Still in the Flowtastic zone? Tap an emoji! 🎭",
        intensity: "gentle",
      },
      { text: "Quick flow check! How's the momentum? 🌊", intensity: "gentle" },
    ],
    triggers: [], // Add triggers if needed
    intensity: "gentle",
  },
];

export default whisperCategories;
