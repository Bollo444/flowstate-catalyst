// src/components/core/FlowInterface/index.tsx
export const FlowInterface: React.FC = () => {
  return (
    <div className={styles.flowContainer}>
      {/* Main Navigation */}
      <FlowNavigation>
        <FlowLogo />
        <NavItems>
          <FlowMenuItem icon="🌊" label="Dashboard" />
          <FlowMenuItem icon="📊" label="Projects" />
          <FlowMenuItem icon="👥" label="Team" />
          <FlowMenuItem icon="⚡" label="Flow Stats" />
        </NavItems>
      </FlowNavigation>

      {/* Main Content Area */}
      <FlowContent>
        <FlowHeader>
          <FlowStateIndicator />
          <QuickActions />
          <TeamPresence />
        </FlowHeader>

        <FlowWorkspace>
          <FlowTabs />
          <ContentArea />
          <FlowSidebar />
        </FlowWorkspace>
      </FlowContent>
    </div>
  );
};