import { StorageProvider, StorageItem, FileContent, ListFilesOptions, GetFileOptions, SearchFilesOptions, UserInfo } from './StorageProvider';

/**
 * Dropbox specific connection options
 */
export interface DropboxConnectionOptions {
  /**
   * OAuth client ID (App key)
   */
  clientId: string;
  
  /**
   * OAuth client secret (App secret)
   */
  clientSecret?: string;
  
  /**
   * OAuth redirect URI
   */
  redirectUri: string;
  
  /**
   * OAuth scopes to request
   */
  scopes?: string[];
  
  /**
   * Access token (if already authenticated)
   */
  accessToken?: string;
  
  /**
   * Refresh token (if already authenticated)
   */
  refreshToken?: string;
}

/**
 * Dropbox storage provider implementation
 */
export class DropboxProvider implements StorageProvider {
  readonly name = 'dropbox';
  readonly displayName = 'Dropbox';
  readonly icon = '/icons/dropbox.svg';
  
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string | null = null;
  private scopes: string[] = [
    'files.metadata.read',
    'files.content.read',
    'account_info.read'
  ];
  
  /**
   * Get Dropbox OAuth authorization URL
   */
  private getAuthUrl(): string {
    if (!this.clientId || !this.redirectUri) {
      throw new Error('Client ID and redirect URI are required');
    }
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      token_access_type: 'offline',
    });
    
    if (this.scopes.length > 0) {
      params.append('scope', this.scopes.join(' '));
    }
    
    return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  }
  
  /**
   * Connect to Dropbox
   * @param options Connection options
   */
  async connect(options?: DropboxConnectionOptions): Promise<boolean> {
    if (!options) {
      throw new Error('Dropbox connection options are required');
    }
    
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret || null;
    this.redirectUri = options.redirectUri;
    
    if (options.scopes && options.scopes.length > 0) {
      this.scopes = options.scopes;
    }
    
    // If tokens are provided, use them
    if (options.accessToken) {
      this.accessToken = options.accessToken;
      this.refreshToken = options.refreshToken || null;
      this.expiresAt = Date.now() + 3600 * 1000; // Assume 1 hour validity if not specified
      return true;
    }
    
    // Otherwise, initiate OAuth flow
    try {
      const authUrl = this.getAuthUrl();
      // Open auth URL in a popup or redirect
      window.open(authUrl, 'Dropbox Authorization', 'width=600,height=700');
      
      // In a real implementation, we would handle the OAuth callback
      // and exchange the authorization code for tokens
      
      // For now, we'll simulate a successful connection
      return new Promise((resolve) => {
        // This would be replaced with actual OAuth flow handling
        console.log('Waiting for Dropbox authorization...');
        
        // In a real implementation, we would listen for the OAuth callback
        // and resolve the promise when tokens are received
        
        // For demo purposes only:
        setTimeout(() => {
          this.accessToken = 'simulated_access_token';
          this.refreshToken = 'simulated_refresh_token';
          this.expiresAt = Date.now() + 3600 * 1000;
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Dropbox connection error:', error);
      return false;
    }
  }
  
  /**
   * Disconnect from Dropbox
   */
  async disconnect(): Promise<void> {
    // Revoke the token if possible
    if (this.accessToken) {
      try {
        await fetch('https://api.dropboxapi.com/2/auth/token/revoke', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error revoking Dropbox token:', error);
      }
    }
    
    // Clear stored tokens
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
  }
  
  /**
   * Check if connected to Dropbox
   */
  isConnected(): boolean {
    return !!this.accessToken && Date.now() < this.expiresAt;
  }
  
  /**
   * List files in Dropbox
   * @param path Folder path
   * @param options Listing options
   */
  async listFiles(path: string, options?: ListFilesOptions): Promise<StorageItem[]> {
    if (!this.isConnected()) {
      throw new Error('Not connected to Dropbox');
    }
    
    try {
      // Ensure path starts with a slash
      const folderPath = path.startsWith('/') ? path : `/${path}`;
      
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: folderPath === '/' ? '' : folderPath, // Dropbox uses empty string for root
          recursive: false,
          include_media_info: true,
          include_deleted: false,
          include_has_explicit_shared_members: true,
          limit: options?.limit || 100,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Dropbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convert to StorageItem format
      return data.entries.map((entry: any) => ({
        id: entry.id,
        name: entry.name,
        path: entry.path_display,
        isFolder: entry['.tag'] === 'folder',
        mimeType: entry['.tag'] === 'file' ? this.getMimeType(entry.name) : undefined,
        size: entry.size,
        modifiedAt: entry.server_modified ? new Date(entry.server_modified) : undefined,
        createdAt: entry.client_modified ? new Date(entry.client_modified) : undefined,
        thumbnailUrl: entry.thumbnail_url,
        webViewUrl: entry.preview_url,
        metadata: {
          dropboxId: entry.id,
          shared: !!entry.shared_folder_id,
        },
      }));
    } catch (error) {
      console.error('Error listing Dropbox files:', error);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get file content from Dropbox
   * @param fileId File path
   * @param options Download options
   */
  async getFileContent(fileId: string, options?: GetFileOptions): Promise<FileContent> {
    if (!this.isConnected()) {
      throw new Error('Not connected to Dropbox');
    }
    
    try {
      // Ensure path starts with a slash
      const filePath = fileId.startsWith('/') ? fileId : `/${fileId}`;
      
      // Get file metadata first
      const metadataResponse = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
          include_media_info: true,
        }),
      });
      
      if (!metadataResponse.ok) {
        throw new Error(`Dropbox API error: ${metadataResponse.status} ${metadataResponse.statusText}`);
      }
      
      const metadata = await metadataResponse.json();
      
      // Download the file
      const downloadResponse = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: filePath,
          }),
        },
      });
      
      if (!downloadResponse.ok) {
        throw new Error(`Dropbox download error: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }
      
      const blob = await downloadResponse.blob();
      
      return {
        name: metadata.name,
        mimeType: this.getMimeType(metadata.name),
        size: metadata.size,
        content: blob,
        metadata: {
          dropboxId: metadata.id,
          shared: !!metadata.shared_folder_id,
        },
      };
    } catch (error) {
      console.error('Error downloading Dropbox file:', error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Search for files in Dropbox
   * @param query Search query
   * @param options Search options
   */
  async searchFiles(query: string, options?: SearchFilesOptions): Promise<StorageItem[]> {
    if (!this.isConnected()) {
      throw new Error('Not connected to Dropbox');
    }
    
    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/search_v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          options: {
            path: options?.folderId || '',
            max_results: options?.limit || 100,
            file_status: 'active',
          },
          match_field_options: {
            include_highlights: false,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Dropbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convert to StorageItem format
      return data.matches.map((match: any) => {
        const metadata = match.metadata.metadata;
        return {
          id: metadata.id,
          name: metadata.name,
          path: metadata.path_display,
          isFolder: metadata['.tag'] === 'folder',
          mimeType: metadata['.tag'] === 'file' ? this.getMimeType(metadata.name) : undefined,
          size: metadata.size,
          modifiedAt: metadata.server_modified ? new Date(metadata.server_modified) : undefined,
          createdAt: metadata.client_modified ? new Date(metadata.client_modified) : undefined,
          metadata: {
            dropboxId: metadata.id,
            shared: !!metadata.shared_folder_id,
          },
        };
      });
    } catch (error) {
      console.error('Error searching Dropbox files:', error);
      throw new Error(`Failed to search files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get user information from Dropbox
   */
  async getUserInfo(): Promise<UserInfo> {
    if (!this.isConnected()) {
      throw new Error('Not connected to Dropbox');
    }
    
    try {
      const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Dropbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.account_id,
        name: `${data.name.given_name} ${data.name.surname}`.trim(),
        email: data.email,
        avatarUrl: data.profile_photo_url,
        metadata: {
          dropboxId: data.account_id,
          country: data.country,
          locale: data.locale,
          accountType: data.account_type['.tag'],
        },
      };
    } catch (error) {
      console.error('Error getting Dropbox user info:', error);
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get MIME type from file name
   * @param fileName File name
   */
  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'csv': 'text/csv'
    };

        return mimeTypes[extension ?? ''] || 'application/octet-stream';
  }
}
