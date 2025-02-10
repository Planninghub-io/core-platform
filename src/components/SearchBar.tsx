
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="animate-fade-down relative mx-auto max-w-2xl">
      <div className="relative">
        <input
          type="text"
          placeholder="Search events, concerts, sports..."
          className="w-full rounded-full bg-white px-6 py-4 pr-12 text-base shadow-lg outline-none ring-1 ring-gray-100 transition-shadow focus:ring-2 focus:ring-primary"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-white transition-colors hover:bg-primary/90">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
