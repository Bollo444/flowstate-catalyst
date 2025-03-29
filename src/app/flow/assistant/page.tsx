"use client";

import React, { useState } from "react";
import Flowsistant from "../../../components/flow/Flowsistant";
import styles from "./page.module.css";

export default function FlowsistantPage() {
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);

  const handleTasksExtracted = (tasks: any[]) => {
    setExtractedTasks(tasks);
    // In a real implementation, we would also save these tasks to the database
    // or integrate them with the existing task management system
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>The Flowsistant</h1>
        <p>
          Use the power of Google's Gemini Flash 2.0 to analyze text, files, or
          emails and automatically extract tasks for your flow.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.assistantContainer}>
          <Flowsistant onTasksExtracted={handleTasksExtracted} />
        </div>

        {extractedTasks.length > 0 && (
          <div className={styles.extractedTasksContainer}>
            <h2>Tasks Ready for Flow</h2>
            <p>
              These tasks have been extracted and are ready to be added to your
              flow.
            </p>

            <div className={styles.taskList}>
              {extractedTasks.map((task, index) => (
                <div key={index} className={styles.taskCard}>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <div className={styles.taskMeta}>
                    {task.priority && (
                      <span
                        className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={styles.dueDate}>
                        Due: {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.addToFlowButton}
                onClick={() => {
                  // In a real implementation, this would integrate with the task management system
                  alert(`${extractedTasks.length} tasks added to your flow!`);
                  setExtractedTasks([]);
                }}
              >
                Add All to Flow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
