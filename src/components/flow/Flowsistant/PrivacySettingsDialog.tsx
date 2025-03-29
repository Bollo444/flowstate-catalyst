import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  PrivacyManager,
  PrivacyPermissionLevel,
  PrivacySettings,
} from "../../../security/privacy/PrivacyManager";

interface PrivacySettingsDialogProps {
  providerId: string;
  onClose: () => void;
  onSave: (settings: PrivacySettings) => void;
}

const PrivacySettingsDialog: React.FC<PrivacySettingsDialogProps> = ({
  providerId,
  onClose,
  onSave,
}) => {
  const privacyManager = PrivacyManager.getInstance();
  const currentSettings = privacyManager.getPrivacySettings(providerId) || {
    integrationId: providerId,
    permissionLevel: PrivacyPermissionLevel.ASK_EVERY_TIME,
    allowedOperations: ["list", "read"],
    preferLocalProcessing: true,
    anonymizeMetadata: true,
    enableAuditLog: true,
  };

  const [settings, setSettings] = useState<PrivacySettings>({
    ...currentSettings,
  });

  const handlePermissionLevelChange = (level: PrivacyPermissionLevel) => {
    setSettings((prev) => ({
      ...prev,
      permissionLevel: level,
    }));
  };

  const handleToggleSetting = (setting: keyof PrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof PrivacySettings],
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className={styles.privacyDialog}>
      <div className={styles.privacyDialogContent}>
        <h3>Privacy Settings for {providerId}</h3>

        <div className={styles.settingSection}>
          <h4>Permission Level</h4>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="permissionLevel"
                checked={
                  settings.permissionLevel === PrivacyPermissionLevel.DENIED
                }
                onChange={() =>
                  handlePermissionLevelChange(PrivacyPermissionLevel.DENIED)
                }
              />
              Denied (No Access)
            </label>
            <p className={styles.settingDescription}>
              The application will not be able to access this storage provider.
            </p>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="permissionLevel"
                checked={
                  settings.permissionLevel === PrivacyPermissionLevel.READ_ONLY
                }
                onChange={() =>
                  handlePermissionLevelChange(PrivacyPermissionLevel.READ_ONLY)
                }
              />
              Read Only
            </label>
            <p className={styles.settingDescription}>
              The application can only read files, not modify or delete them.
            </p>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="permissionLevel"
                checked={
                  settings.permissionLevel ===
                  PrivacyPermissionLevel.ASK_EVERY_TIME
                }
                onChange={() =>
                  handlePermissionLevelChange(
                    PrivacyPermissionLevel.ASK_EVERY_TIME
                  )
                }
              />
              Ask Every Time
            </label>
            <p className={styles.settingDescription}>
              You will be prompted for permission each time the application
              needs to access files.
            </p>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="permissionLevel"
                checked={
                  settings.permissionLevel ===
                  PrivacyPermissionLevel.FULL_ACCESS
                }
                onChange={() =>
                  handlePermissionLevelChange(
                    PrivacyPermissionLevel.FULL_ACCESS
                  )
                }
              />
              Full Access
            </label>
            <p className={styles.settingDescription}>
              The application has full access to this storage provider.
            </p>
          </div>
        </div>

        <div className={styles.settingSection}>
          <h4>Privacy Options</h4>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.preferLocalProcessing}
              onChange={() => handleToggleSetting("preferLocalProcessing")}
            />
            Process files locally when possible
          </label>
          <p className={styles.settingDescription}>
            Files will be processed on your device instead of being sent to
            external servers when possible.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.anonymizeMetadata}
              onChange={() => handleToggleSetting("anonymizeMetadata")}
            />
            Anonymize file metadata
          </label>
          <p className={styles.settingDescription}>
            Remove personally identifiable information from file metadata.
          </p>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.enableAuditLog}
              onChange={() => handleToggleSetting("enableAuditLog")}
            />
            Enable access audit log
          </label>
          <p className={styles.settingDescription}>
            Keep a record of all file access operations for security purposes.
          </p>
        </div>

        <div className={styles.dialogButtons}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsDialog;
