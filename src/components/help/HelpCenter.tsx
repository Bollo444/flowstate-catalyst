export const HelpCenter: React.FC = () => {
  const { articles, support } = useHelpResources();

  return (
    <div className="help-center">
      <KnowledgeBase articles={articles} />
      <SupportTickets support={support} />
      <GuidedTour />
    </div>
  );
};
