export const ProgressTracker: React.FC = () => {
  const { milestones, progress } = useProgressData();

  return (
    <div className="progress-tracker">
      <MilestoneList milestones={milestones} />
      <ProgressChart progress={progress} />
      <AchievementBadges />
    </div>
  );
};
