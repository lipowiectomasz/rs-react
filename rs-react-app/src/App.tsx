import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import Card from './components/Card.tsx';
import ErrorBtn from './components/ErrorBtn.tsx';
import Detail from './components/Detail.tsx';
import './style/App.css';
import { useState } from 'react';

interface AppProps {
  page: number;
  detail: number;
}

export default function App({ page, detail }: AppProps) {
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
      <Header title="Star Wars heroes library"></Header>
      <Controls onSearch={handleSearchChange} isLoading={isLoading}></Controls>
      <div className="content">
        <Card
          searchTerm={searchTerm}
          toggleLoading={handleToggleLoading}
          page={page}
        ></Card>
        {detail !== 0 && <Detail detailId={detail.toString()} />}
      </div>
      <ErrorBtn></ErrorBtn>
    </div>
  );
}
