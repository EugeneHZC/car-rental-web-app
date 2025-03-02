const SearchBar = ({ searchDesc, setSearchDesc }: { searchDesc: string; setSearchDesc: React.Dispatch<string> }) => {
  return (
    <div className="search-bar">
      <img src="magnifying-glass.png" alt="Search Icon" width={30} height={30} />
      <input
        type="text"
        placeholder="Search"
        value={searchDesc}
        onChange={(e) => setSearchDesc(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
