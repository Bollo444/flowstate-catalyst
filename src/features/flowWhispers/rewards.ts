import { FlowReward } from "./types";

const flowRewards: FlowReward[] = [
  {
    id: "flow-master",
    trigger: "streak",
    threshold: 5,
    reward: {
      type: "badge",
      content: {
        name: "Flow Master",
        icon: "🌊",
        animation: "ripple",
      },
    },
  },
  {
    id: "momentum-keeper",
    trigger: "interaction",
    threshold: 10,
    reward: {
      type: "theme",
      content: {
        name: "Momentum Theme",
        colors: {
          primary: "#2E3192",
          secondary: "#1BFFFF",
        },
      },
    },
  },
];

export default flowRewards;
