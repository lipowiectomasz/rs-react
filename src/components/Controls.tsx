import { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../features/selector/SelectorSlice';
import '../style/Controls.css';
import Loader from './Loader.tsx';

interface ControlsProps {
  onSearch: (searchTerm: string) => void;
}

export default function Controls({ onSearch }: ControlsProps) {
  const [searchValue, setSearchValue] = useState<string>(
    localStorage.getItem('searchTerm') || ''
  );
  const isLoading = useSelector(selectIsLoading);

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
