import { StorageProvider } from "./providers/StorageProvider";
import { GoogleDriveProvider } from "./providers/GoogleDriveProvider";
import { DropboxProvider } from "./providers/DropboxProvider";

/**
 * Status of a storage provider connection
 */
export enum StorageProviderStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

/**
 * Storage provider connection information
 */
export interface StorageProviderConnection {
  /**
   * The storage provider instance
   */
  provider: StorageProvider;

  /**
   * Current connection status
   */
  status: StorageProviderStatus;

  /**
   * Error message if status is ERROR
   */
  error?: string;

  /**
   * Last connection time
   */
  lastConnected?: Date;

  /**
   * User information if connected
   */
  userInfo?: any;
}

/**
 * Manages storage provider integrations
 */
export class StorageManager {
  private providers: Map<string, StorageProviderConnection> = new Map();
  private static instance: StorageManager;

  /**
   * Get the singleton instance
   */
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Register available providers
    this.registerProvider(new GoogleDriveProvider());
    this.registerProvider(new DropboxProvider());
    // Additional providers can be registered here
  }

  /**
   * Register a storage provider
   * @param provider The provider to register
   */
  public registerProvider(provider: StorageProvider): void {
    this.providers.set(provider.name, {
      provider,
      status: StorageProviderStatus.DISCONNECTED,
    });
  }

  /**
   * Get all registered providers
   */
  public getProviders(): StorageProviderConnection[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get a specific provider by name
   * @param name Provider name
   */
  public getProvider(name: string): StorageProviderConnection | undefined {
    return this.providers.get(name);
  }

  /**
   * Connect to a storage provider
   * @param name Provider name
   * @param options Connection options
   */
  public async connectProvider(name: string, options: any): Promise<boolean> {
    const connection = this.providers.get(name);
    if (!connection) {
      throw new Error(`Provider ${name} not found`);
    }

    try {
      connection.status = StorageProviderStatus.CONNECTING;

      const success = await connection.provider.connect(options);

      if (success) {
        connection.status = StorageProviderStatus.CONNECTED;
        connection.lastConnected = new Date();

        // Get user info if connected
        try {
          connection.userInfo = await connection.provider.getUserInfo();
        } catch (error) {
          console.warn(`Failed to get user info for ${name}:`, error);
        }

        return true;
      } else {
        connection.status = StorageProviderStatus.ERROR;
        connection.error = "Connection failed";
        return false;
      }
    } catch (error) {
      connection.status = StorageProviderStatus.ERROR;
      connection.error = error instanceof Error ? error.message : String(error);
      return false;
    }
  }

  /**
   * Disconnect from a storage provider
   * @param name Provider name
   */
  public async disconnectProvider(name: string): Promise<void> {
    const connection = this.providers.get(name);
    if (!connection) {
      throw new Error(`Provider ${name} not found`);
    }

    try {
      await connection.provider.disconnect();
      connection.status = StorageProviderStatus.DISCONNECTED;
      connection.userInfo = undefined;
    } catch (error) {
      console.error(`Error disconnecting from ${name}:`, error);
      throw error;
    }
  }

  /**
   * Check if a provider is connected
   * @param name Provider name
   */
  public isProviderConnected(name: string): boolean {
    const connection = this.providers.get(name);
    return connection
      ? connection.status === StorageProviderStatus.CONNECTED
      : false;
  }
}
