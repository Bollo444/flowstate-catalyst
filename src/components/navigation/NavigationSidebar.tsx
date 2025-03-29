export const NavigationSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      <nav className="p-4">
        <NavMenu />
        <NavLinks />
        <NavFooter />
      </nav>
    </aside>
  );
};
