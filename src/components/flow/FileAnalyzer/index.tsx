import React, { useState } from "react";
import { FileAnalyzer } from "../../../services/fileAnalysis/analyzer";
import { FileOrganizer } from "../../../services/fileAnalysis/organizer";
import styles from "./styles.module.css";
import { AnalysisResult } from "../../../services/fileAnalysis/types";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import { FileOrganizerComponent } from "../FileOrganizer";

export const FileAnalyzerComponent: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const analyzer = new FileAnalyzer();
  const organizer = new FileOrganizer();

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnalyzing(true);
    try {
      const files = Array.from(event.dataTransfer.files);
      const file = files[0]; // For now, handling one file
      setCurrentFile(file);

      const analysisResults = await analyzer.analyzeFile(file);
      setResults(analysisResults);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRename = async () => {
    if (!results || !currentFile) return;

    try {
      const newFileName = organizer.generateFileName(results);
      const renamedFile = await organizer.renameFile(currentFile, newFileName);
      setCurrentFile(renamedFile);

      // Update the results with the new filename
      setResults({
        ...results,
        originalName: renamedFile.name,
      });
    } catch (error) {
      console.error("Rename error:", error);
    }
  };

  const handleOrganizationComplete = () => {
    // Reset the component state
    setResults(null);
    setCurrentFile(null);
  };

  return (
    <div className={styles.analyzerContainer}>
      <div
        className={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        {analyzing ? (
          <div className={styles.analyzing}>
            <LoadingSpinner />
            <p>Analyzing your file...</p>
          </div>
        ) : (
          <div className={styles.instructions}>
            <h3>Drop files here</h3>
            <p>I'll help organize them and detect potential projects</p>
          </div>
        )}
      </div>

      {results && currentFile && (
        <div className={styles.results}>
          <h3>Analysis Results</h3>

          <div className={styles.suggestedName}>
            <h4>Suggested Name:</h4>
            <p>{results.suggestedName}</p>
          </div>

          {results.projectContext && (
            <div className={styles.projectContext}>
              <h4>Project Detection:</h4>
              <p>Related Project: {results.projectContext.relatedProject}</p>
              <div className={styles.suggestedTasks}>
                <h5>Suggested Tasks:</h5>
                <ul>
                  {results.projectContext.suggestedTasks?.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className={styles.tags}>
            <h4>Tags:</h4>
            <div className={styles.tagList}>
              {results.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleRename} className={styles.actionButton}>
              Apply Suggested Name
            </button>
          </div>
        </div>
      )}

      {results && (
        <FileOrganizerComponent
          suggestion={results}
          onApply={handleOrganizationComplete}
        />
      )}
    </div>
  );
};
