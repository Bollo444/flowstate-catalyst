export const FocusTimer: React.FC = () => {
  const { timer, settings } = useFocusTimer();

  return (
    <div className="focus-timer">
      <TimerDisplay timer={timer} />
      <TimerControls />
      <SessionStats />
    </div>
  );
};
