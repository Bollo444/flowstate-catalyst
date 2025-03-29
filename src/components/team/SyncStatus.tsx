export const SyncStatus: React.FC<SyncProps> = ({ status }) => {
  const syncInfo = processSyncStatus(status);

  return (
    <div className="sync-status">
      <SyncIndicator status={status} />
      <SyncDetails info={syncInfo} />
      <SyncControls />
    </div>
  );
};
