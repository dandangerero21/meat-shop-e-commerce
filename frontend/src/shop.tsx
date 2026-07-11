import { useState, useEffect } from 'react';
import './styles/shop.css';
import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    animalType: string;
    description: string;
    imageUrl: string;
}

interface ShopProps {
    onNavigate: (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => void;
}

function Shop({ onNavigate }: ShopProps) {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const filterTabs = [
        { id: "ALL", label: "All Cuts" },
        { id: "BEEF", label: "Beef" },
        { id: "PORK", label: "Pork" },
        { id: "CHICKEN", label: "Chicken" },
        { id: "LAMB", label: "Lamb" },
        { id: "DUCK", label: "Duck" },
        { id: "FISH", label: "Fish" }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/products/all", {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to retrieve catalog cuts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCuts = activeFilter === "ALL" 
        ? products 
        : products.filter(cut => cut.animalType === activeFilter);

    return (
        <div className="shop-layout">
            <Header currentPage="shop" onNavigate={onNavigate} />

            <div className="shop-content-wrapper">
                {/* Shop Page Title banner */}
                <div className="shop-header-banner">
                    <span className="section-eyebrow">THE BUTCHER SHOP</span>
                    <h1 className="shop-page-title">Hand-Selected Cuts</h1>
                    <p className="shop-page-subtitle">
                        Custom portioned daily on order. Sealed under vacuum parameters and delivered frozen or sub-38°F.
                    </p>
                </div>

                {/* Dynamic animalType Filters */}
                <div className="cuts-section">
                    <div className="filter-tabs-container">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`filter-tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Storefront Products Catalog Grid */}
                    <div className="products-grid">
                        {loading ? (
                            <p style={{ gridColumn: '1 / -1', color: 'var(--text-main)', textAlign: 'center', padding: '4rem' }}>
                                Loading fresh cuts inventory...
                            </p>
                        ) : (
                            <>
                                {filteredCuts.map((cut) => (
                                    <div key={cut.id} className="product-card">
                                        <div className="card-outer">
                                            <div className="card-inner">
                                                <div className="product-info-top">
                                                    <span className="product-tag">{cut.category}</span>
                                                    <span className="product-status-tag">
                                                        In Stock
                                                    </span>
                                                </div>
                                                
                                                <div className="product-media-container">
                                                    <img src={cut.imageUrl} alt={cut.name} className="product-card-img" />
                                                    <div className="vacuum-seal-badge">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                                        </svg>
                                                        <span>COLD-CHAIN SECURED</span>
                                                    </div>
                                                </div>

                                                <h3 className="product-name">{cut.name}</h3>
                                                <p className="product-specs">{cut.description}</p>
                                                <div className="product-footer">
                                                    <div className="product-price-col">
                                                        <span className="price-value">${cut.price.toFixed(2)}</span>
                                                        <span className="price-unit">/ pkg</span>
                                                    </div>
                                                    <button className="add-to-cart-btn">
                                                        <span>Add to Box</span>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="product-card-date">Cut: Fresh Daily</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredCuts.length === 0 && (
                                    <div className="empty-catalog-state">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>No fresh cuts available in this category today.</p>
                                        <span>Check back tomorrow or contact supply@relsmeat.com for custom orders.</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default Shop;
