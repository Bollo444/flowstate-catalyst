import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import { StorageManager, StorageProviderStatus, StorageProviderConnection } from '../../../integrations/storage/StorageManager';
import { PrivacyManager, PrivacyPermissionLevel } from '../../../security/privacy/PrivacyManager';
import { StorageItem, FileContent } from '../../../integrations/storage/providers/StorageProvider';

interface StorageIntegrationProps {
  providerId: string;
  onFileSelected: (fileContent: FileContent) => void;
  onClose: () => void; 
}

const StorageIntegration: React.FC<StorageIntegrationProps> = ({
  providerId,
  onFileSelected,
  onClose
}) => {
  const [connection, setConnection] = useState<StorageProviderConnection | null>(null);
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined); // For navigation
  const [error, setError] = useState<string | null>(null);
  
  const storageManager = StorageManager.getInstance();
  const privacyManager = PrivacyManager.getInstance();

  // Effect to get initial connection status
  useEffect(() => {
    const conn = storageManager.getProvider(providerId);
    if (conn) {
      setConnection(conn);
      if (conn.status === StorageProviderStatus.CONNECTED) {
        fetchFiles(); // Fetch root files if already connected
      }
    } else {
      setError(`Provider ${providerId} not found.`);
    }
  }, [providerId, storageManager]);

  const fetchFiles = useCallback(async (folderId?: string) => {
    if (!connection || connection.status !== StorageProviderStatus.CONNECTED) {
      setError("Provider not connected.");
      return;
    }

    const privacySettings = privacyManager.getPrivacySettings(providerId);
    if (privacySettings?.permissionLevel === PrivacyPermissionLevel.DENIED) {
        setError('Access denied due to privacy settings.');
        return;
    }
    // TODO: Implement ASK_EVERY_TIME logic if needed

    try {
      setError(null);
      setFiles([]); // Clear previous files
      setCurrentFolderId(folderId); // Update current folder
      // Call listFiles on the provider instance
      const listedFiles = await connection.provider.listFiles(folderId || '', {}); // Pass folderId string directly, empty options 
      setFiles(listedFiles);
    } catch (err) {
      setError(`Error listing files: ${err instanceof Error ? err.message : String(err)}`);
      setFiles([]); // Clear files on error
    }
  }, [connection, providerId, privacyManager]);

  const handleFileClick = async (file: StorageItem) => {
     if (!connection || connection.status !== StorageProviderStatus.CONNECTED) return;

     const privacySettings = privacyManager.getPrivacySettings(providerId);
     if (privacySettings?.permissionLevel === PrivacyPermissionLevel.DENIED) {
         setError('Access denied due to privacy settings.');
         return;
     }
     // TODO: Implement ASK_EVERY_TIME logic if needed
     
     if (file.isFolder) {
       fetchFiles(file.id); // Navigate into folder
     } else {
        try {
          setError(null);
          // Call readFile on the provider instance
          const fileContent = await connection.provider.getFileContent(file.id); // Use getFileContent method 
          onFileSelected(fileContent);
        } catch (err) {
           setError(`Error reading file: ${err instanceof Error ? err.message : String(err)}`);
        }
     }
  };
  
   const handleConnect = async () => {
     try {
       setError(null);
       // Example connection options - replace with actual config from env or settings
       const options = { 
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID', // Example using env var
          redirectUri: window.location.origin + '/auth/callback/storage' 
       };
       const success = await storageManager.connectProvider(providerId, options);
       if (success) {
           // Refetch connection to update status and user info
           const updatedConn = storageManager.getProvider(providerId);
           if (updatedConn) if (updatedConn) setConnection(updatedConn); else setConnection(null); // Handle potentially undefined connection // Add null/undefined check
           fetchFiles(); // Fetch files on successful connection
       } else {
           setError(`Connection to ${providerId} failed. Check console.`);
       }
     } catch (err) {
        setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
     }
   };

   // Function to navigate up one folder level
   const handleGoUp = () => {
      // This requires the provider's listFiles/readFile to also return parent folder info
      // or maintaining a path history. Simplified for now.
      fetchFiles(undefined); // Go back to root for simplicity
   }

  return (
    <div className={styles.storageIntegration}>
      <h4>Select file from {connection?.provider.displayName || providerId}</h4>
      {error && <p className={styles.error}>{error}</p>}

      {(!connection || connection.status === StorageProviderStatus.DISCONNECTED || connection.status === StorageProviderStatus.ERROR) && (
        <button onClick={handleConnect} className={styles.connectButton}>
          Connect to {connection?.provider.displayName || providerId}
        </button>
      )}
      
      {connection?.status === StorageProviderStatus.CONNECTING && (
         <p>Connecting...</p> 
      )}

      {connection?.status === StorageProviderStatus.CONNECTED && (
        <>
          {/* Optional: Add button to navigate up */}
          {/* {currentFolderId && <button onClick={handleGoUp}>⬆️ Up</button>} */}
          <ul className={styles.fileList}>
            {files.length === 0 && <li>(No files found or empty folder)</li>}
            {files.map(file => (
              <li 
                key={file.id} 
                onClick={() => handleFileClick(file)}
                className={file.isFolder ? styles.folderItem : styles.fileItem}
                title={file.name}
              >
                {file.isFolder ? '📁' : '📄'} {file.name}
              </li>
            ))}
          </ul>
        </>
      )}
       <button onClick={onClose} className={styles.cancelButton} style={{ marginTop: '1rem' }}>Close</button>
    </div>
  );
};

export default StorageIntegration;