import { Outlet } from 'react-router';
import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import Card from './components/Card.tsx';
import ErrorBtn from './components/ErrorBtn.tsx';
import './style/App.css';
import { useCallback, useEffect, useState } from 'react';
import Flyout from './components/Flyout';
import { ThemeContext } from './app/theme.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';

interface AppProps {
  page: number;
  children?: React.ReactNode;
}

export default function App({ page }: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem('searchTerm') || ''
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <Header title="Star Wars Heroes Library" />
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <Controls onSearch={handleSearchChange} />
        <div className="content">
          <Card searchTerm={searchTerm} page={page} />
          <Outlet />
        </div>
        <Flyout />
        <ErrorBtn />
      </div>
    </ThemeContext.Provider>
  );
}
