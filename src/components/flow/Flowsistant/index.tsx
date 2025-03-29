import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { FlowsistantService } from "../../../services/FlowsistantService";
import PrivacySettingsDialog from "./PrivacySettingsDialog";
import { StorageManager } from "../../../integrations/storage/StorageManager";
import {
  PrivacyManager,
  PrivacySettings,
} from "../../../security/privacy/PrivacyManager";
import { FileContent } from "../../../integrations/storage/providers/StorageProvider";

interface FlowsistantProps {
  onTasksExtracted?: (tasks: any[]) => void;
  className?: string;
}

const Flowsistant: React.FC<FlowsistantProps> = ({
  onTasksExtracted,
  className,
}) => {
  const [inputType, setInputType] = useState<
    "text" | "file" | "email" | "cloud"
  >("text");
  const [inputContent, setInputContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null); // State to hold results (removed rendering)
  const [error, setError] = useState<string | null>(null);
  const [showCloudStorage, setShowCloudStorage] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const flowsistantService = new FlowsistantService();

  // Get singleton instances
  const storageManager = StorageManager.getInstance();
  const privacyManager = PrivacyManager.getInstance();

  const handleInputTypeChange = (type: "text" | "file" | "email") => {
    setInputType(type);
    setInputContent("");
    setAnalysisResult(null);
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileContent(file);
      setInputContent(text);
    } catch (err) {
      setError(
        `Error reading file: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    if (!inputContent.trim()) {
      setError("Please enter some content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      const analysisRequest: any = {
        content: inputContent,
        contentType: inputType,
      };

      if (inputType === "cloud" && selectedProvider) {
        analysisRequest.sourceProvider = selectedProvider;
        analysisRequest.sourceId = "file-id"; // Placeholder
      }

      const result = await flowsistantService.analyzeContent(analysisRequest);

      setAnalysisResult(result); // Store results in state

      // Still call onTasksExtracted if tasks are present, even if not rendering them now
      if (result.tasks && onTasksExtracted) {
        onTasksExtracted(result.tasks);
      }
    } catch (err) {
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // handleAddToTasks might need adjustment later if analysisResult structure changes
  const handleAddToTasks = () => {
    if (analysisResult?.tasks && onTasksExtracted) {
      onTasksExtracted(analysisResult.tasks);
      // Optionally clear analysis result after adding
      // setAnalysisResult(null);
    }
  };

  const handleCloudStorageToggle = () => {
    setShowCloudStorage(!showCloudStorage);
    if (!showCloudStorage) {
      setInputType("cloud");
    } else {
      setInputType("text"); // Revert to text if closing cloud view
    }
  };

  const handlePrivacySettingsToggle = () => {
    setShowPrivacySettings(!showPrivacySettings);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleFileSelected = (fileContent: FileContent) => {
    const fileId = fileContent.metadata?.id || "unknown-file";

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInputContent(event.target.result as string);
        // Consider storing fileId in state if needed for analysis request
        setShowCloudStorage(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file from cloud storage");
    };
    reader.readAsText(fileContent.content);
  };

  const handleUpdatePrivacySettings = (settings: PrivacySettings) => {
    privacyManager.updatePrivacySettings(settings);
    // Optionally provide feedback to user
  };

  return (
    <div className={`${styles.flowsistant} ${className || ""}`}>
      <div className={styles.header}>
        <h2>The Flowsistant</h2>
        <p>Powered by Google Gemini Flash 2.0</p>
      </div>

      <div className={styles.inputTypeSelector}>
        <button
          className={`${styles.typeButton} ${inputType === "text" ? styles.active : ""}`}
          onClick={() => handleInputTypeChange("text")}
        >
          Text
        </button>
        <button
          className={`${styles.typeButton} ${inputType === "file" ? styles.active : ""}`}
          onClick={() => handleInputTypeChange("file")}
        >
          File
        </button>
        <button
          className={`${styles.typeButton} ${inputType === "email" ? styles.active : ""}`}
          onClick={() => handleInputTypeChange("email")}
        >
          Email
        </button>
        <button
          className={`${styles.typeButton} ${inputType === "cloud" ? styles.active : ""}`}
          onClick={handleCloudStorageToggle}
        >
          Cloud Storage
        </button>
        <button
          className={styles.privacyButton}
          onClick={handlePrivacySettingsToggle}
          title="Configure privacy settings"
        >
          Privacy Settings
        </button>
      </div>

      <div className={styles.inputContainer}>
        {inputType === "text" && (
          <textarea
            className={styles.textInput}
            placeholder="Enter text to analyze..."
            value={inputContent}
            onChange={handleTextChange}
            rows={8}
          />
        )}

        {inputType === "file" && (
          <div className={styles.fileInput}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.doc,.docx,.pdf"
              style={{ display: "none" }}
            />
            <button
              className={styles.fileButton}
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </button>
            {inputContent ? (
              <div className={styles.filePreview}>
                <p>File content loaded ({inputContent.length} characters)</p>
                <div className={styles.previewContent}>
                  {inputContent.substring(0, 100)}...
                </div>
              </div>
            ) : (
              <p>Supported formats: .txt, .md, .doc, .docx, .pdf</p>
            )}
          </div>
        )}

        {inputType === "email" && (
          <textarea
            className={styles.textInput}
            placeholder="Paste email content here..."
            value={inputContent}
            onChange={handleTextChange}
            rows={8}
          />
        )}

        {inputType === "cloud" && showCloudStorage && (
          <div className={styles.cloudStorageContainer}>
            <div className={styles.providerList}>
              {storageManager.getProviders().map((provider) => (
                <button
                  key={provider.provider.name}
                  className={`${styles.providerButton} ${selectedProvider === provider.provider.name ? styles.active : ""}`}
                  onClick={() => handleProviderSelect(provider.provider.name)}
                >
                  <img
                    src={provider.provider.icon}
                    alt={provider.provider.displayName}
                    className={styles.providerIcon}
                  />
                  <span>{provider.provider.displayName}</span>
                </button>
              ))}
            </div>

            {selectedProvider && (
              <div className={styles.fileSelector}>
                <p>Connect to {selectedProvider} to select files</p>
                <button
                  className={styles.connectButton}
                  onClick={() => {
                    const options = {
                      clientId: "demo-client-id", // Should use real client ID
                      redirectUri: window.location.origin + "/auth/callback",
                    };
                    storageManager.connectProvider(selectedProvider, options);
                  }}
                >
                  Connect to {selectedProvider}
                </button>
                <p className={styles.privacyNote}>
                  Your privacy is important. Files processed according to
                  <button
                    className={styles.privacyLink}
                    onClick={handlePrivacySettingsToggle}
                  >
                    privacy settings
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        )}

        {inputContent && (
          <button
            className={styles.analyzeButton}
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputContent.trim()}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze with Flowsistant"}
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Analysis result section commented out due to parsing errors */}
      {/* {analysisResult && (
        <div className={styles.results}>
          <h3>Analysis Results</h3>
          
          {analysisResult.summary && (
            <div className={styles.section}>
              <h4>Summary</h4>
              <p>{analysisResult.summary}</p>
            </div>
          )}

          {analysisResult.tasks && analysisResult.tasks.length > 0 && (
            <div className={styles.section}>
              <h4>Extracted Tasks</h4>
              <ul className={styles.taskList}>
                // Task list rendering was here 
              </ul>
              <button onClick={handleAddToTasks} className={styles.addToTasksButton}>
                Add Tasks
              </button>
            </div>
          )}
        </div>
      )} */}

      {showPrivacySettings && (
        <PrivacySettingsDialog
          providerId={selectedProvider!}
          onClose={handlePrivacySettingsToggle}
          // currentSettings is fetched internally
          onSave={handleUpdatePrivacySettings}
        />
      )}
    </div> // Closing tag for the main flowsistant div
  );
};

export default Flowsistant;
