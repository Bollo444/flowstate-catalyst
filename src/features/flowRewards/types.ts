export interface FlowReward {
  id: string;
  trigger: "streak" | "achievement" | "interaction";
  threshold: number;
  reward: {
    type: "badge" | "theme" | "animation" | "power-up";
    content: any;
  };
}

export interface FlowMilestone {
  days: number;
  reward: {
    type: "badge" | "theme" | "power-up" | "animation";
    name: string;
    icon: string;
    description: string;
  };
}
