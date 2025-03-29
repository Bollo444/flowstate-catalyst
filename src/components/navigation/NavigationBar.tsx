export const NavigationBar: React.FC = () => {
  const { routes, currentRoute } = useNavigation();

  return (
    <div className="navigation-bar">
      <MainMenu routes={routes} />
      <QuickActions />
      <UserProfile />
    </div>
  );
};
