export const SearchBar: React.FC<SearchProps> = ({ onSearch, placeholder }) => {
  return (
    <div className="relative">
      <SearchInput onSearch={onSearch} placeholder={placeholder} />
      <SearchFilters />
      <SearchResults />
    </div>
  );
};
