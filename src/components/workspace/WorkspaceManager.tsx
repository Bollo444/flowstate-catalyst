export const WorkspaceManager: React.FC = () => {
  const { spaces, active } = useWorkspaces();

  return (
    <div className="workspace-manager">
      <SpaceSelector spaces={spaces} />
      <WorkspaceTools active={active} />
      <CollaborationPanel />
    </div>
  );
};
