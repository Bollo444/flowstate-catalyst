export const SearchInterface: React.FC = () => {
  const { searchResults, performSearch } = useSearch();

  return (
    <div className="search-interface">
      <SearchBar onSearch={performSearch} />
      <SearchResults results={searchResults} />
      <FilterOptions />
    </div>
  );
};
