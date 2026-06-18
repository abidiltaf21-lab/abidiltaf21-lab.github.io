import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'adminTheme';

/** Keeps document theme in sync across public site + admin. */
const ThemeManager = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const isAdmin = pathname.startsWith('/admin');
        const isHomeDark = pathname === '/home-dark';

        if (isHomeDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('bg-dark');
            return () => document.body.classList.remove('bg-dark');
        }

        document.body.classList.remove('bg-dark');

        if (isAdmin) {
            const saved = (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null) || 'dark';
            document.documentElement.setAttribute('data-theme', saved);
            return;
        }

        document.documentElement.setAttribute('data-theme', 'light');
    }, [pathname]);

    return null;
};

export default ThemeManager;
