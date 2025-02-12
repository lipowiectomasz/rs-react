import { Outlet } from 'react-router';
import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import Card from './components/Card.tsx';
import ErrorBtn from './components/ErrorBtn.tsx';
import './style/App.css';
import { useState } from 'react';

interface AppProps {
  page: number;
}

export default function App({ page }: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem('searchTerm') || ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleToggleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="app">
      <Header title="Star Wars Heroes Library" />
      <Controls onSearch={handleSearchChange} isLoading={isLoading} />
      <div className="content">
        <Card
          searchTerm={searchTerm}
          toggleLoading={handleToggleLoading}
          page={page}
        />
        <Outlet />
      </div>
      <ErrorBtn />
    </div>
  );
}
