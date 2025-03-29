export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-panel">
      <UserPreferences settings={settings} />
      <SystemSettings onUpdate={updateSettings} />
      <IntegrationSettings />
    </div>
  );
};
