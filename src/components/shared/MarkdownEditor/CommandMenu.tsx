// src/components/shared/MarkdownEditor/CommandMenu.tsx
import React from "react";
import styles from "./styles.module.css"; // Assuming styles are in the same directory

interface CommandMenuProps {
  position: { x: number; y: number };
  onSelect: (command: string) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ position, onSelect }) => {
  const commands = [
    { label: "Heading 1", value: "# " },
    { label: "Heading 2", value: "## " },
    { label: "Bullet List", value: "- " },
    { label: "Numbered List", value: "1. " },
    { label: "Task", value: "- [ ] " },
    { label: "Code Block", value: "```\n\n```" },
  ];

  return (
    <div
      className={styles.commandMenu}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {commands.map((command) => (
        <button
          key={command.value}
          onClick={() => onSelect(command.value)}
          className={styles.commandItem}
        >
          {command.label}
        </button>
      ))}
    </div>
  );
};

export default CommandMenu;
