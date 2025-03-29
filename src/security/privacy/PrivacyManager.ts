/**
 * Privacy Manager for handling user privacy settings and permissions
 */

/**
 * Privacy permission levels for different operations
 */
export enum PrivacyPermissionLevel {
  /**
   * No access allowed
   */
  DENIED = "denied",

  /**
   * Read-only access allowed
   */
  READ_ONLY = "read_only",

  /**
   * Full access allowed
   */
  FULL_ACCESS = "full_access",

  /**
   * Access allowed only after explicit user confirmation for each operation
   */
  ASK_EVERY_TIME = "ask_every_time",
}

/**
 * Privacy settings for a specific integration
 */
export interface PrivacySettings {
  /**
   * Integration identifier
   */
  integrationId: string;

  /**
   * Permission level for this integration
   */
  permissionLevel: PrivacyPermissionLevel;

  /**
   * Allowed operations (e.g., 'read', 'write', 'list', 'delete')
   */
  allowedOperations?: string[];

  /**
   * Allowed paths or resources
   */
  allowedPaths?: string[];

  /**
   * Denied paths or resources (takes precedence over allowedPaths)
   */
  deniedPaths?: string[];

  /**
   * Whether to process data locally when possible
   */
  preferLocalProcessing?: boolean;

  /**
   * Whether to anonymize metadata
   */
  anonymizeMetadata?: boolean;

  /**
   * Whether to keep audit logs
   */
  enableAuditLog?: boolean;

  /**
   * Expiration time for these settings
   */
  expiresAt?: Date;
}

/**
 * Result of a permission check
 */
export interface PermissionCheckResult {
  /**
   * Whether the operation is allowed
   */
  allowed: boolean;

  /**
   * Reason for denial if not allowed
   */
  reason?: string;

  /**
   * Whether user confirmation is required
   */
  requiresConfirmation?: boolean;
}

/**
 * Access log entry
 */
export interface AccessLogEntry {
  /**
   * Integration identifier
   */
  integrationId: string;

  /**
   * Operation performed or attempted
   */
  operation: string;

  /**
   * Resource path accessed
   */
  resourcePath: string;

  /**
   * Whether access was allowed
   */
  allowed: boolean;

  /**
   * Reason for denial if not allowed
   */
  denialReason?: string;

  /**
   * Timestamp of the access
   */
  timestamp?: Date;

  /**
   * User ID if available
   */
  userId?: string;
}

/**
 * Privacy Manager for handling user privacy settings and permissions
 */
export class PrivacyManager {
  private settings: Map<string, PrivacySettings> = new Map();
  private accessLog: AccessLogEntry[] = [];
  private static instance: PrivacyManager;

  /**
   * Get the singleton instance
   */
  public static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager();
    }
    return PrivacyManager.instance;
  }

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize with default settings
    this.initializeDefaultSettings();
  }

  /**
   * Initialize default privacy settings
   */
  private initializeDefaultSettings(): void {
    // Default settings for Google Drive
    this.settings.set("google-drive", {
      integrationId: "google-drive",
      permissionLevel: PrivacyPermissionLevel.ASK_EVERY_TIME,
      allowedOperations: ["list", "read"],
      preferLocalProcessing: true,
      anonymizeMetadata: true,
      enableAuditLog: true,
    });

    // Default settings for Dropbox
    this.settings.set("dropbox", {
      integrationId: "dropbox",
      permissionLevel: PrivacyPermissionLevel.ASK_EVERY_TIME,
      allowedOperations: ["list", "read"],
      preferLocalProcessing: true,
      anonymizeMetadata: true,
      enableAuditLog: true,
    });

    // Add more default settings for other integrations as needed
  }

  /**
   * Get privacy settings for an integration
   * @param integrationId Integration identifier
   */
  public getPrivacySettings(
    integrationId: string
  ): PrivacySettings | undefined {
    return this.settings.get(integrationId);
  }

  /**
   * Update privacy settings for an integration
   * @param settings New privacy settings
   */
  public updatePrivacySettings(settings: PrivacySettings): void {
    this.settings.set(settings.integrationId, settings);
  }

  /**
   * Check if an operation is allowed for an integration
   * @param integrationId Integration identifier
   * @param operation Operation to check
   * @param resourcePath Resource path to check
   */
  public isOperationAllowed(
    integrationId: string,
    operation: string,
    resourcePath: string
  ): PermissionCheckResult {
    const settings = this.settings.get(integrationId);

    if (!settings) {
      return {
        allowed: false,
        reason: `No privacy settings found for ${integrationId}`,
      };
    }

    // Check if operation is allowed
    if (
      settings.allowedOperations &&
      !settings.allowedOperations.includes(operation)
    ) {
      return {
        allowed: false,
        reason: `Operation '${operation}' is not allowed for ${integrationId}`,
      };
    }

    // Check permission level
    switch (settings.permissionLevel) {
      case PrivacyPermissionLevel.DENIED:
        return {
          allowed: false,
          reason: `Access to ${integrationId} is denied by user settings`,
        };

      case PrivacyPermissionLevel.READ_ONLY:
        if (operation !== "list" && operation !== "read") {
          return {
            allowed: false,
            reason: `Only read operations are allowed for ${integrationId}`,
          };
        }
        break;

      case PrivacyPermissionLevel.ASK_EVERY_TIME:
        return {
          allowed: true,
          requiresConfirmation: true,
        };

      case PrivacyPermissionLevel.FULL_ACCESS:
        // Full access is allowed, continue with path checks
        break;
    }

    // Check denied paths (takes precedence)
    if (
      settings.deniedPaths &&
      settings.deniedPaths.some((path) => resourcePath.startsWith(path))
    ) {
      return {
        allowed: false,
        reason: `Access to path '${resourcePath}' is explicitly denied`,
      };
    }

    // Check allowed paths
    if (settings.allowedPaths && settings.allowedPaths.length > 0) {
      const isAllowedPath = settings.allowedPaths.some((path) =>
        resourcePath.startsWith(path)
      );
      if (!isAllowedPath) {
        return {
          allowed: false,
          reason: `Access to path '${resourcePath}' is not allowed`,
        };
      }
    }

    // All checks passed
    return { allowed: true };
  }

  /**
   * Log an access attempt
   * @param entry Access log entry
   */
  public logAccess(entry: AccessLogEntry): void {
    const settings = this.settings.get(entry.integrationId);

    // Only log if audit logging is enabled
    if (settings?.enableAuditLog) {
      // Add timestamp if not provided
      if (!entry.timestamp) {
        entry.timestamp = new Date();
      }

      this.accessLog.push(entry);

      // In a real implementation, we might persist this to a database
      console.log("Access logged:", entry);
    }
  }

  /**
   * Get access logs for an integration
   * @param integrationId Integration identifier
   * @param limit Maximum number of entries to return
   */
  public getAccessLogs(
    integrationId: string,
    limit?: number
  ): AccessLogEntry[] {
    const logs = this.accessLog
      .filter((entry) => entry.integrationId === integrationId)
      .sort((a, b) => {
        const timeA = a.timestamp?.getTime() || 0;
        const timeB = b.timestamp?.getTime() || 0;
        return timeB - timeA; // Sort by timestamp descending (newest first)
      });

    return limit ? logs.slice(0, limit) : logs;
  }

  /**
   * Clear access logs for an integration
   * @param integrationId Integration identifier
   */
  public clearAccessLogs(integrationId: string): void {
    this.accessLog = this.accessLog.filter(
      (entry) => entry.integrationId !== integrationId
    );
  }

  /**
   * Get a summary of privacy settings for user display
   */
  public getPrivacySummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    for (const [id, settings] of this.settings.entries()) {
      summary[id] = {
        permissionLevel: settings.permissionLevel,
        localProcessing: settings.preferLocalProcessing || false,
        anonymizeMetadata: settings.anonymizeMetadata || false,
        operations: settings.allowedOperations || [],
        restrictedPaths: settings.deniedPaths || [],
      };
    }

    return summary;
  }
}
