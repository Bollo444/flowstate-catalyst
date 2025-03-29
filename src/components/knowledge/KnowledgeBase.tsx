export const KnowledgeBase: React.FC = () => {
  const { articles, categories } = useKnowledgeSystem();

  return (
    <div className="knowledge-base">
      <ArticleManager articles={articles} />
      <CategoryOrganizer categories={categories} />
      <SearchEngine />
    </div>
  );
};
