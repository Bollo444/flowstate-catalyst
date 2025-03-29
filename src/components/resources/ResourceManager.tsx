export const ResourceManager: React.FC = () => {
  const { resources, allocateResource } = useResources();

  return (
    <div className="resource-manager">
      <ResourceList resources={resources} />
      <ResourceAllocation onAllocate={allocateResource} />
      <ResourceUtilization />
    </div>
  );
};
