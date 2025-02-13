
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="animate-fade-down relative mx-auto max-w-2xl w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, concerts, sports..."
          className="w-full rounded-full bg-white px-6 py-4 pr-12 text-base shadow-lg outline-none ring-1 ring-gray-100 transition-shadow focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-white transition-colors hover:bg-primary/90"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
