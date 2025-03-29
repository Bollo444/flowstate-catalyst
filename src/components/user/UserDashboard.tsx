export const UserDashboard: React.FC = () => {
  const { profile, activities } = useUserData();

  return (
    <div className="user-dashboard">
      <ProfileOverview profile={profile} />
      <ActivityHistory activities={activities} />
      <PersonalMetrics />
    </div>
  );
};
