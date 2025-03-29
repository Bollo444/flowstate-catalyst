export const BaseLayout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      <main className="ml-64 p-8">
        <ContentArea>{children}</ContentArea>
      </main>
      <UpdatesPanel />
    </div>
  );
};
