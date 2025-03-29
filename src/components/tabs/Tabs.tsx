export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <TabsList tabs={tabs} activeTab={activeTab} />
      <TabsContent onChange={onChange} />
    </div>
  );
};
