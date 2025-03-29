// src/components/shared/MarkdownEditor/index.tsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";
import CommandMenu from "./CommandMenu"; // Import CommandMenu

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Type / for commands...",
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [commandMenu, setCommandMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);

    // Check for command menu trigger
    if (newValue.endsWith("/")) {
      const rect = e.target.getBoundingClientRect();
      setCommandMenu({
        isOpen: true,
        position: {
          x: rect.left,
          y: rect.bottom,
        },
      });
    } else {
      setCommandMenu((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCommandSelect = (commandValue: string) => {
    setValue(value + commandValue);
    setCommandMenu({ ...commandMenu, isOpen: false });
    setIsEditing(true); // Keep editing mode after command select
  };

  return (
    <div className={styles.editor}>
      {isEditing ? (
        <textarea
          value={value}
          onChange={handleChange}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          className={styles.input}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditing(true)} className={styles.preview}>
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
      )}

      {commandMenu.isOpen && (
        <CommandMenu
          position={commandMenu.position}
          onSelect={handleCommandSelect}
        />
      )}
    </div>
  );
};
