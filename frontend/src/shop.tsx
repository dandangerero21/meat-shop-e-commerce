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
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    const filteredCuts = products.filter(cut => {
        const matchesFilter = activeFilter === "ALL" || cut.animalType === activeFilter;
        const matchesSearch = cut.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              cut.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="shop-layout">
            <Header currentPage="shop" onNavigate={onNavigate} />

            <div className="shop-content-wrapper">
                {/* Shop Page Title banner */}
                <div className="shop-header-banner">
                    <h1 className="shop-page-title">The Butcher Shop</h1>
                    <p className="shop-page-subtitle">
                        Hand-selected cuts, portioned daily.
                    </p>
                </div>

                {/* Dynamic animalType Filters & Search */}
                <div className="cuts-section">
                    <div className="shop-controls">
                        <div className="search-bar-container">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                className="shop-search-input"
                                placeholder="Search cuts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
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
                                    <div key={cut.id} className="product-card" onClick={() => setSelectedProduct(cut)}>
                                        <div className="card-outer">
                                            <div className="card-inner">
                                                <div className="product-media-container">
                                                    <img src={cut.imageUrl} alt={cut.name} className="product-card-img" />
                                                </div>

                                                <div className="product-info-top">
                                                    <span className="product-category-text">{cut.category.replace('_', ' ')}</span>
                                                    <span className="product-status-text">In Stock</span>
                                                </div>

                                                <h3 className="product-name">{cut.name}</h3>
                                                <div className="product-footer">
                                                    <div className="product-price-col">
                                                        <span className="price-value">${cut.price.toFixed(2)}</span>
                                                        <span className="price-unit">/ pkg</span>
                                                    </div>
                                                </div>
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

            {/* Product Modal */}
            {selectedProduct && (
                <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="product-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="modal-grid">
                            <div className="modal-image-col">
                                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
                            </div>
                            <div className="modal-info-col">
                                <span className="modal-category">{selectedProduct.category.replace('_', ' ')}</span>
                                <h2>{selectedProduct.name}</h2>
                                <p className="modal-price">${selectedProduct.price.toFixed(2)} <span>/ pkg</span></p>
                                <p className="modal-description">{selectedProduct.description}</p>
                                <button className="add-to-cart-btn">
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default Shop;
