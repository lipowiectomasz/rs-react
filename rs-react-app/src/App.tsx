import { Outlet } from 'react-router';
import { useDispatch } from 'react-redux';
import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import Card from './components/Card.tsx';
import ErrorBtn from './components/ErrorBtn.tsx';
import './style/App.css';
import { useCallback, useState } from 'react';
import Flyout from './components/Flyout';
import { setLoading } from './features/selector/SelectorSlice';

interface AppProps {
  page: number;
  children?: React.ReactNode;
}

export default function App({ page }: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem('searchTerm') || ''
  );
  const dispatch = useDispatch();

  dispatch(setLoading(true));
  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  return (
    <div className="app">
      <Header title="Star Wars Heroes Library" />
      <Controls onSearch={handleSearchChange} />
      <div className="content">
        <Card searchTerm={searchTerm} page={page} />
        <Outlet />
      </div>
      <Flyout />
      <ErrorBtn />
    </div>
  );
}
