import { StorageProvider, StorageItem, FileContent, ListFilesOptions, GetFileOptions, SearchFilesOptions, UserInfo } from './StorageProvider';

/**
 * Google Drive specific connection options
 */
export interface GoogleDriveConnectionOptions {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes?: string[];
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Google Drive storage provider implementation
 */
export class GoogleDriveProvider implements StorageProvider {
  readonly name = 'google-drive';
  readonly displayName = 'Google Drive';
  readonly icon = '/icons/google-drive.svg';
  
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string | null = null;
  private scopes: string[] = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  
  async connect(options?: GoogleDriveConnectionOptions): Promise<boolean> {
    if (!options) {
      throw new Error('Google Drive connection options are required');
    }
    
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret || null;
    this.redirectUri = options.redirectUri;
    
    if (options.scopes && options.scopes.length > 0) {
      this.scopes = options.scopes;
    }
    
    if (options.accessToken) {
      this.accessToken = options.accessToken;
      this.refreshToken = options.refreshToken || null;
      this.expiresAt = Date.now() + 3600 * 1000; // Assume 1 hour
      return true;
    }
    
    try {
      const authUrl = this.getAuthUrl();
      window.open(authUrl, 'Google Drive Authorization', 'width=600,height=700');
      
      // Simulate OAuth callback for demo
      return new Promise((resolve) => {
        console.log('Waiting for Google Drive authorization...');
        setTimeout(() => {
          this.accessToken = 'simulated_access_token';
          this.refreshToken = 'simulated_refresh_token';
          this.expiresAt = Date.now() + 3600 * 1000;
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Google Drive connection error:', error);
      return false;
    }
  }
  
  async disconnect(): Promise<void> {
    if (this.accessToken) {
      try {
        const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${this.accessToken}`;
        await fetch(revokeUrl, { method: 'POST' });
      } catch (error) {
        console.error('Error revoking Google Drive token:', error);
      }
    }
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
  }
  
  isConnected(): boolean {
    return !!this.accessToken && Date.now() < this.expiresAt;
  }
  
  async listFiles(path: string, options?: ListFilesOptions): Promise<StorageItem[]> {
     if (!this.isConnected()) {
       throw new Error('Not connected to Google Drive');
     }
     
     try {
       const folderId = path === '/' || !path ? 'root' : path; // Use path as folderId
       
       const queryParams = new URLSearchParams({
         q: `'${folderId}' in parents and trashed = false`,
         fields: 'files(id,name,mimeType,size,modifiedTime,createdTime,thumbnailLink,webViewLink,webContentLink,shared)', // Added shared
         pageSize: options?.limit?.toString() || '100',
       });
       
       if (options?.pageToken) {
         queryParams.append('pageToken', options.pageToken);
       }
       
       if (options?.fileType && options.fileType.length > 0) {
         const mimeTypeFilters = options.fileType.map(type => `mimeType contains '${type}'`).join(' or ');
         queryParams.set('q', `${queryParams.get('q')} and (${mimeTypeFilters})`);
       }
       
       const response = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`, {
         headers: {
           'Authorization': `Bearer ${this.accessToken}`,
         },
       });
       
       if (!response.ok) {
         throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
       }
       
       const data = await response.json();
       
       return data.files.map((file: any) => ({
         id: file.id,
         name: file.name,
         path: `/${file.name}`, // Simplified path
         isFolder: file.mimeType === 'application/vnd.google-apps.folder',
         mimeType: file.mimeType,
         size: parseInt(file.size, 10) || undefined,
         modifiedAt: file.modifiedTime ? new Date(file.modifiedTime) : undefined,
         createdAt: file.createdTime ? new Date(file.createdTime) : undefined,
         thumbnailUrl: file.thumbnailLink,
         webViewUrl: file.webViewLink,
         webEditUrl: file.mimeType.startsWith('application/vnd.google-apps.') ? file.webViewLink : undefined,
         metadata: {
           driveId: file.id,
           shared: !!file.shared,
         },
       }));
     } catch (error) {
       console.error('Error listing Google Drive files:', error);
       throw new Error(`Failed to list files: ${error instanceof Error ? error.message : String(error)}`);
     }
  }
  
  async getFileContent(fileId: string, options?: GetFileOptions): Promise<FileContent> {
     if (!this.isConnected()) {
       throw new Error('Not connected to Google Drive');
     }
     
     try {
       const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,size`, {
         headers: { 'Authorization': `Bearer ${this.accessToken}` },
       });
       
       if (!metadataResponse.ok) {
         throw new Error(`Google Drive API error (metadata): ${metadataResponse.status} ${metadataResponse.statusText}`);
       }
       
       const metadata = await metadataResponse.json();
       let downloadUrl: string;
       let finalMimeType = metadata.mimeType;
       
       // Handle Google Docs, Sheets, Slides export
       if (metadata.mimeType.startsWith('application/vnd.google-apps.')) {
         const exportMimeType = this.getExportMimeType(metadata.mimeType, options?.exportFormat);
         if (!exportMimeType) {
            throw new Error(`Unsupported export format for ${metadata.mimeType}`);
         }
         downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${exportMimeType}`;
         finalMimeType = exportMimeType; // Use the export mime type
       } else {
         // Standard file download
         downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
       }
       
       // Download the file content
       const downloadResponse = await fetch(downloadUrl, {
         headers: { 'Authorization': `Bearer ${this.accessToken}` },
       });
       
       if (!downloadResponse.ok) {
         throw new Error(`Google Drive API error (download): ${downloadResponse.status} ${downloadResponse.statusText}`);
       }
       
       const blob = await downloadResponse.blob();
       
       return {
         name: metadata.name,
         mimeType: finalMimeType,
         size: parseInt(metadata.size, 10) || blob.size, // Use actual blob size if metadata size is missing
         content: blob,
         metadata: { driveId: fileId },
       };
       
     } catch (error) {
       console.error('Error downloading Google Drive file:', error);
       throw new Error(`Failed to download file: ${error instanceof Error ? error.message : String(error)}`);
     }
  } // Added closing brace for getFileContent

  /**
   * Search for files in Google Drive
   * @param query Search query
   * @param options Search options
   */
  async searchFiles(query: string, options?: SearchFilesOptions): Promise<StorageItem[]> {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google Drive');
      }

      try {
          const queryParams = new URLSearchParams({
              q: `name contains '${query}' and trashed = false`, // Basic name search
              fields: 'files(id,name,mimeType,size,modifiedTime,createdTime,thumbnailLink,webViewLink,webContentLink,shared)',
              pageSize: options?.limit?.toString() || '100',
          });

          if (options?.folderId) {
              queryParams.set('q', `${queryParams.get('q')} and '${options.folderId}' in parents`);
          }
          if (options?.pageToken) {
              queryParams.append('pageToken', options.pageToken);
          }

          const response = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`, {
              headers: { 'Authorization': `Bearer ${this.accessToken}` },
          });

          if (!response.ok) {
              throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          return data.files.map((file: any) => ({
              // Mapping logic identical to listFiles
              id: file.id,
              name: file.name,
              path: `/${file.name}`, 
              isFolder: file.mimeType === 'application/vnd.google-apps.folder',
              mimeType: file.mimeType,
              size: parseInt(file.size, 10) || undefined,
              modifiedAt: file.modifiedTime ? new Date(file.modifiedTime) : undefined,
              createdAt: file.createdTime ? new Date(file.createdTime) : undefined,
              thumbnailUrl: file.thumbnailLink,
              webViewUrl: file.webViewLink,
              webEditUrl: file.mimeType.startsWith('application/vnd.google-apps.') ? file.webViewLink : undefined,
              metadata: { driveId: file.id, shared: !!file.shared },
          }));

      } catch (error) {
          console.error('Error searching Google Drive files:', error);
          throw new Error(`Failed to search files: ${error instanceof Error ? error.message : String(error)}`);
      }
  }
  
  /**
   * Get user information from Google Drive
   */
   async getUserInfo(): Promise<UserInfo> {
     if (!this.isConnected()) {
       throw new Error('Not connected to Google Drive');
     }
     
     try {
       const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
         headers: {
           'Authorization': `Bearer ${this.accessToken}`,
         },
       });
       
       if (!response.ok) {
         throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
       }
       
       const data = await response.json();
       
       return {
         id: data.id,
         name: data.name,
         email: data.email,
         avatarUrl: data.picture,
         metadata: { locale: data.locale }
       };
     } catch (error) {
       console.error('Error getting Google Drive user info:', error);
       throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : String(error)}`);
     }
   }

  // --- Helper Methods ---

  private getAuthUrl(): string {
    if (!this.clientId || !this.redirectUri) {
      throw new Error('Client ID and redirect URI are required');
    }
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent', // Force consent screen for refresh token
    });
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

   private getExportMimeType(googleMimeType: string, preferredFormat?: string): string | null {
      // Basic mapping for common Google Workspace types
      if (googleMimeType === 'application/vnd.google-apps.document') {
          return preferredFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // Default to docx
      }
      if (googleMimeType === 'application/vnd.google-apps.spreadsheet') {
          return preferredFormat === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // Default to xlsx
      }
       if (googleMimeType === 'application/vnd.google-apps.presentation') {
          return preferredFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; // Default to pptx
      }
      // Add more mappings as needed
      return null; // Cannot export this type or format not supported
   }

} // Closing brace for the GoogleDriveProvider class