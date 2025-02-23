import '../style/ToggleSwitcher.css';

interface ThemeSwitcherProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export default function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
    const handleToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <div className="theme-switcher">
            Light/Dark
            <label className="switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={handleToggle} />
                <span className="slider round"></span>
            </label>
        </div>

    );
}
