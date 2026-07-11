import { useState } from 'react';
import LandingPage from './landing-page.tsx';
import Shop from './shop.tsx';
import Login from './login.tsx';
import SellerDashboard from './seller-dashboard.tsx';

function App() {
    const [currentPage, setCurrentPage] = useState<'landing' | 'shop' | 'login' | 'seller-dashboard'>('landing');

    const handleNavigate = (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <>
            {currentPage === 'landing' ? (
                <LandingPage onNavigate={handleNavigate} />
            ) : currentPage === 'shop' ? (
                <Shop onNavigate={handleNavigate} />
            ) : currentPage === 'login' ? (
                <Login onNavigate={handleNavigate} />
            ) : (
                <SellerDashboard onNavigate={handleNavigate} />
            )}
        </>
    );
}

export default App;
