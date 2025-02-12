import { useState, ChangeEvent } from 'react';
import '../style/Controls.css';
import Loader from './Loader.tsx';

interface ControlsProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

export default function Controls({ onSearch, isLoading }: ControlsProps) {
  const [searchValue, setSearchValue] = useState<string>(
    localStorage.getItem('searchTerm') || ''
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    localStorage.setItem('searchTerm', searchValue);
    onSearch(searchValue);
  };

  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Search"
        name="search"
        value={searchValue}
        onChange={handleInputChange}
      />
      {isLoading && <Loader />}
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
