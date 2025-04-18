mport React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import {
  StorageManager,
  StorageProviderStatus,
  StorageProviderConnection,
} from "../../../integrations/storage/StorageManager";
import {
  PrivacyManager,
  PrivacyPermissionLevel,
} from "../../../security/privacy/PrivacyManager";
import {
  StorageItem,
  FileContent,
} from "../../../integrations/storage/providers/StorageProvider";
import { ConfirmDialog } from "../../shared/ConfirmDialog"; // Corrected: Named import
import clsx from "clsx";

interface StorageIntegrationProps {
  providerId: string;
  onFileSelected: (fileContent: FileContent) => void;
  onClose: () => void;
}

// Type for the pending confirmation action
type ConfirmationAction = () => Promise<void>;

const StorageIntegration: React.FC<StorageIntegrationProps> = ({
  providerId,
  onFileSelected,
  onClose,
}) => {
  const [connection, setConnection] = useState<StorageProviderConnection | null>(
    null
  );
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(
    undefined // For navigation
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] =
    useState<ConfirmationAction | null>(null);

  const storageManager = StorageManager.getInstance();
  const privacyManager = PrivacyManager.getInstance();

  const performFetchFiles = useCallback(
    async (folderId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        setFiles([]); // Clear previous files
        setCurrentFolderId(folderId); // Update current folder
        if (!connection?.provider)
          throw new Error("Provider instance is missing.");
        // Call listFiles on the provider instance
        const listedFiles = await connection.provider.listFiles(
          folderId || "",
          {} // Pass folderId string directly, empty options
        );
        setFiles(listedFiles);
      } catch (err) {
        setError(
          `Error listing files: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setFiles([]); // Clear files on error
      } finally {
        setIsLoading(false);
      }
    },
    [connection]
  );

  const fetchFiles = useCallback(
    async (folderId?: string) => {
      if (
        !connection ||
        connection.status !== StorageProviderStatus.CONNECTED
      ) {
        setError("Provider not connected.");
        return;
      }

      const privacySettings = privacyManager.getPrivacySettings(providerId);
      if (privacySettings?.permissionLevel === PrivacyPermissionLevel.DENIED) {
        setError("Access denied due to privacy settings.");
        return;
      }

      const action = () => performFetchFiles(folderId);

      if (
        privacySettings?.permissionLevel ===
        PrivacyPermissionLevel.ASK_EVERY_TIME
      ) {
        setConfirmMessage(
          `Allow accessing folder contents in ${connection.provider.displayName}?`
        );
        setConfirmAction(() => action); // Store action in state
        setIsConfirmOpen(true);
      } else {
        await action(); // Execute directly if ALLOWED or not specified (assuming default is ALLOW)
      }
    },
    [connection, providerId, privacyManager, performFetchFiles]
  );

  // Effect to get initial connection status and potentially fetch files
  useEffect(() => {
    const conn = storageManager.getProvider(providerId);
    if (conn) {
      setConnection(conn);
      // Initial fetch logic
      if (conn.status === StorageProviderStatus.CONNECTED) {
        const privacySettings = privacyManager.getPrivacySettings(providerId);
        if (privacySettings?.permissionLevel !== PrivacyPermissionLevel.DENIED) {
          if (
            privacySettings?.permissionLevel !==
            PrivacyPermissionLevel.ASK_EVERY_TIME
          ) {
            console.log("Connected, auto-fetching allowed.");
            fetchFiles(); // Fetch initially if allowed
          } else {
            console.log("Connected, but permission requires asking first.");
            // Ask user to confirm fetching root folder initially
             setConfirmMessage(`Allow fetching root folder from ${conn.provider.displayName}?`);
             setConfirmAction(() => () => performFetchFiles(undefined));
             setIsConfirmOpen(true);
          }
        } else {
          setError("Access denied due to privacy settings.");
        }
      }
    } else {
      setError(`Provider ${providerId} not found.`);
    }
    // We only want this to run once based on initial providerId/manager
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, storageManager]);

  const performReadFile = useCallback(
    async (file: StorageItem) => {
      setIsLoading(true);
      setError(null);
      try {
        if (!connection?.provider)
          throw new Error("Provider instance is missing.");
        const fileContent = await connection.provider.getFileContent(file.id);
        onFileSelected(fileContent);
      } catch (err) {
        setError(
          `Error reading file: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [connection, onFileSelected]
  );

  const handleFileClick = useCallback(
    async (file: StorageItem) => {
      if (
        !connection ||
        connection.status !== StorageProviderStatus.CONNECTED ||
        isLoading
      )
        return;

      if (file.isFolder) {
        fetchFiles(file.id); // Navigate into folder (fetchFiles handles privacy check)
      } else {
        const privacySettings = privacyManager.getPrivacySettings(providerId);
        if (privacySettings?.permissionLevel === PrivacyPermissionLevel.DENIED) {
          setError("Access denied due to privacy settings.");
          return;
        }

        const action = () => performReadFile(file);

        if (
          privacySettings?.permissionLevel ===
          PrivacyPermissionLevel.ASK_EVERY_TIME
        ) {
          setConfirmMessage(
            `Allow reading file "${file.name}" from ${connection.provider.displayName}?`
          );
          setConfirmAction(() => action);
          setIsConfirmOpen(true);
        } else {
          await action(); // Execute directly
        }
      }
    },
    [
      connection,
      providerId,
      privacyManager,
      isLoading,
      fetchFiles,
      performReadFile,
    ]
  );

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Example connection options - replace with actual config from env or settings
      const options = {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID", // Example using env var
        redirectUri: window.location.origin + "/auth/callback/storage",
      };
      const success = await storageManager.connectProvider(providerId, options);
      if (success) {
        // Refetch connection to update status and user info
        const updatedConn = storageManager.getProvider(providerId);
        setConnection(updatedConn ?? null); // Corrected: Handle undefined case

        if (updatedConn?.status === StorageProviderStatus.CONNECTED) {
          // Check privacy again after connect, before fetching
          const privacySettings = privacyManager.getPrivacySettings(providerId);
          if (privacySettings?.permissionLevel !== PrivacyPermissionLevel.DENIED) {
            if (
              privacySettings?.permissionLevel !==
              PrivacyPermissionLevel.ASK_EVERY_TIME
            ) {
              fetchFiles(); // Fetch files on successful connection if allowed
            } else {
              console.log(
                "Connected, but requires confirmation to fetch files."
              );
              // Ask user to confirm fetching root folder
              setConfirmMessage(
                `Connection successful. Allow fetching root folder from ${updatedConn.provider.displayName}?`
              );
              setConfirmAction(() => () => performFetchFiles(undefined)); // Wrap performFetchFiles
              setIsConfirmOpen(true);
            }
          } else {
            setError("Access denied due to privacy settings after connection.");
          }
        } else {
          setError(
            `Connection established but status is not CONNECTED: ${updatedConn?.status}`
          );
        }
      } else {
        setError(`Connection to ${providerId} failed. Check console.`);
      }
    } catch (err) {
      setError(
        `Connection failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate up one folder level
  const handleGoUp = () => {
    // This requires the provider's listFiles/readFile to also return parent folder info
    // or maintaining a path history. Simplified for now.
    fetchFiles(undefined); // Go back to root for simplicity
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      setIsLoading(true); // Show loading during confirmed action
      try {
        await confirmAction();
      } catch (err) {
        setError(
          `Action failed after confirmation: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
    setConfirmMessage("");
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setConfirmAction(null);
    setConfirmMessage("");
    // Optionally set an error or info message
    // setError("Action cancelled by user.");
  };

  return (
    <div className={styles.storageIntegration}>
      <h4>Select file from {connection?.provider.displayName || providerId}</h4>
      {error && <p className={styles.error}>{error}</p>}
      {isLoading && <p>Loading...</p>}

      {(!connection ||
        connection.status === StorageProviderStatus.DISCONNECTED ||
        connection.status === StorageProviderStatus.ERROR) &&
        !isLoading && (
          <button
            onClick={handleConnect}
            className={styles.connectButton}
            disabled={isLoading}
          >
            Connect to {connection?.provider.displayName || providerId}
          </button>
        )}

      {connection?.status === StorageProviderStatus.CONNECTING && !isLoading && (
        <p>Connecting...</p>
      )}

      {connection?.status === StorageProviderStatus.CONNECTED && !isLoading && (
        <>
          {/* Optional: Add button to navigate up */}
          {/* {currentFolderId && <button onClick={handleGoUp} disabled={isLoading}>⬆️ Up</button>} */}
          <ul className={styles.fileList}>
            {files.length === 0 && <li>(No files found or empty folder)</li>}
            {files.map((file) => (
              <li
                key={file.id}
                onClick={() => !isLoading && handleFileClick(file)} // Prevent clicks while loading
                className={clsx(
                  file.isFolder ? styles.folderItem : styles.fileItem,
                  isLoading && styles.disabledItem // Optional: Style for disabled state
                )}
                title={file.name}
              >
                {file.isFolder ? "📁" : "📄"} {file.name}
              </li>
            ))}
          </ul>
        </>
      )}
      <button
        onClick={onClose}
        className={styles.cancelButton}
        style={{ marginTop: "1rem" }}
        disabled={isLoading}
      >
        Close
      </button>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message={confirmMessage}
      />
    </div>
  );
};

export default StorageIntegration;