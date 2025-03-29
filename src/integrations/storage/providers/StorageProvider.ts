/**
 * Common interfaces for storage providers
 */

/**
 * Represents a file or folder in a storage provider
 */
export interface StorageItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Display name of the item
   */
  name: string;

  /**
   * Path to the item (may be virtual in some providers)
   */
  path: string;

  /**
   * Whether this item is a folder
   */
  isFolder: boolean;

  /**
   * MIME type of the file (undefined for folders)
   */
  mimeType?: string;

  /**
   * Size of the file in bytes (undefined for folders)
   */
  size?: number;

  /**
   * Last modified timestamp
   */
  modifiedAt?: Date;

  /**
   * Creation timestamp
   */
  createdAt?: Date;

  /**
   * URL to a thumbnail image (if available)
   */
  thumbnailUrl?: string;

  /**
   * URL to view the file in the provider's web interface
   */
  webViewUrl?: string;

  /**
   * URL to edit the file in the provider's web interface
   */
  webEditUrl?: string;

  /**
   * Provider-specific metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Represents file content returned from a storage provider
 */
export interface FileContent {
  /**
   * File name
   */
  name: string;

  /**
   * MIME type of the file
   */
  mimeType: string;

  /**
   * Size of the file in bytes
   */
  size: number;

  /**
   * File content as a Blob
   */
  content: Blob;

  /**
   * Provider-specific metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Options for listing files
 */
export interface ListFilesOptions {
  /**
   * Maximum number of items to return
   */
  limit?: number;

  /**
   * Token for pagination
   */
  pageToken?: string;

  /**
   * Filter by file types (MIME types)
   */
  fileType?: string[];

  /**
   * Sort order
   */
  sortBy?: "name" | "modifiedAt" | "createdAt" | "size";

  /**
   * Sort direction
   */
  sortDirection?: "asc" | "desc";
}

/**
 * Options for getting file content
 */
export interface GetFileOptions {
  /**
   * Export format for Google Docs and similar
   */
  exportFormat?: string;

  /**
   * Whether to include file metadata
   */
  includeMetadata?: boolean;
}

/**
 * Options for searching files
 */
export interface SearchFilesOptions extends ListFilesOptions {
  /**
   * Folder ID to search within
   */
  folderId?: string;

  /**
   * Search in file content (if supported)
   */
  searchContent?: boolean;
}

/**
 * User information from a storage provider
 */
export interface UserInfo {
  /**
   * User ID
   */
  id: string;

  /**
   * User display name
   */
  name: string;

  /**
   * User email
   */
  email?: string;

  /**
   * URL to user avatar
   */
  avatarUrl?: string;

  /**
   * Provider-specific metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Interface for storage providers
 */
export interface StorageProvider {
  /**
   * Unique identifier for this provider
   */
  readonly name: string;

  /**
   * Display name for this provider
   */
  readonly displayName: string;

  /**
   * Icon path for this provider
   */
  readonly icon: string;

  /**
   * Connect to the storage provider
   * @param options Provider-specific connection options
   */
  connect(options?: any): Promise<boolean>;

  /**
   * Disconnect from the storage provider
   */
  disconnect(): Promise<void>;

  /**
   * Check if connected to the storage provider
   */
  isConnected(): boolean;

  /**
   * List files in a directory
   * @param path Path to the directory
   * @param options Listing options
   */
  listFiles(path: string, options?: ListFilesOptions): Promise<StorageItem[]>;

  /**
   * Get file content
   * @param fileId File ID or path
   * @param options Download options
   */
  getFileContent(
    fileId: string,
    options?: GetFileOptions
  ): Promise<FileContent>;

  /**
   * Search for files
   * @param query Search query
   * @param options Search options
   */
  searchFiles(
    query: string,
    options?: SearchFilesOptions
  ): Promise<StorageItem[]>;

  /**
   * Get user information
   */
  getUserInfo(): Promise<UserInfo>;
}
