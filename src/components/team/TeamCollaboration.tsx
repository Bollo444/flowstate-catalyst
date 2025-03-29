export const TeamCollaboration: React.FC = () => {
  const { sessions, participants } = useCollabSessions();

  return (
    <div className="team-collaboration">
      <LiveSessions sessions={sessions} />
      <ParticipantList participants={participants} />
      <CollabTools />
    </div>
  );
};
