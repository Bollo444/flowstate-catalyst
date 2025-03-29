export const InfiniteScroll: React.FC<InfiniteProps> = ({
  items,
  loadMore,
}) => {
  return (
    <div className="infinite-container">
      <ItemList items={items} />
      <LoadTrigger loadMore={loadMore} />
      <LoadingIndicator />
    </div>
  );
};
