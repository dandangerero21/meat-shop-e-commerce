import { useState, useEffect } from 'react';
import './styles/seller-dashboard.css';
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

interface SellerDashboardProps {
    onNavigate: (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => void;
}

function SellerDashboard({ onNavigate }: SellerDashboardProps) {
    // Form parameters
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [animalType, setAnimalType] = useState("BEEF");
    const [category, setCategory] = useState("BEEF_RIB");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("/ribeye.png");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [sellerName, setSellerName] = useState("Butcher Console");

    // Animal type configurations
    const animalTypes = ["BEEF", "PORK", "CHICKEN", "LAMB", "DUCK", "FISH", "OTHER"];

    // Common categories map
    const commonCategories = [
        { value: "BEEF_RIB", label: "Beef Ribeye Cut" },
        { value: "BEEF_LOIN", label: "Beef Sirloin/Loin" },
        { value: "BEEF_BRISKET", label: "Beef Brisket" },
        { value: "MINCE_BEEF", label: "Ground Beef / Mince" },
        { value: "PORK_CHOP", label: "Pork Chops" },
        { value: "PORK_BELLY", label: "Pork Belly" },
        { value: "MINCE_PORK", label: "Ground Pork" },
        { value: "CHICKEN_BREAST", label: "Chicken Breast" },
        { value: "CHICKEN_THIGH", label: "Chicken Thigh" },
        { value: "WHOLE_CHICKEN", label: "Whole Chicken" },
        { value: "LAMB_CHOP", label: "Lamb Chops" },
        { value: "DUCK_BREAST", label: "Duck Breast" },
        { value: "FISH_FILLET", label: "Fish Fillet" },
        { value: "OTHER", label: "Other Cut" }
    ];

    // Image preset selections
    const imagePresets = [
        { path: "/ribeye.png", label: "Ribeye Steak Mockup" },
        { path: "/porkchops.png", label: "Pork Chops Mockup" },
        { path: "/groundbeef.png", label: "Ground Beef Mockup" },
        { path: "/chicken.png", label: "Chicken Breast Mockup" }
    ];

    useEffect(() => {
        fetchProducts();

        // Extract session name
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.username) {
                    setSellerName(parsed.username);
                }
            } catch (e) {
                console.error("Failed to parse user session in seller console", e);
            }
        }
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
            } else {
                setErrorMsg("Failed to retrieve current product inventory.");
            }
        } catch (error) {
            console.error("Fetch inventory error:", error);
            setErrorMsg("Could not connect to backend server. Make sure Spring Boot is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setActionLoading(true);

        const newProduct = {
            name,
            price: parseFloat(price),
            animalType,
            category,
            description,
            imageUrl
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/products/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                setSuccessMsg("Product listing registered successfully.");
                // Reset form fields
                setName("");
                setPrice("");
                setDescription("");
                // Refresh list
                fetchProducts();
            } else {
                setErrorMsg("Failed to register listing. Review parameters.");
            }
        } catch (error) {
            console.error("Register product error:", error);
            setErrorMsg("Connection failure while registering listing.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteListing = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this product listing?")) {
            return;
        }

        setErrorMsg("");
        setSuccessMsg("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });

            if (response.ok) {
                setSuccessMsg("Product listing removed.");
                fetchProducts();
            } else {
                setErrorMsg("Failed to remove product listing.");
            }
        } catch (error) {
            console.error("Delete listing error:", error);
            setErrorMsg("Connection failure while removing listing.");
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onNavigate('login');
    };

    const getInitials = (name: string) => {
        if (!name) return "BC";
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="dashboard-layout">
            {/* Custom Private Back-Office Header (Does not share client navigation) */}
            <header className="seller-header">
                <div className="seller-header-inner">
                    <a href="/" className="seller-logo" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>
                        <svg className="seller-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9 10l3-3 3 3M15 14l-3 3-3-3" />
                        </svg>
                        <div className="seller-logo-text">
                            <span className="seller-logo-title">REL'S BRAND</span>
                            <span className="seller-logo-badge">SELLER HUB</span>
                        </div>
                    </a>

                    <div className="seller-header-nav">
                        <span className="active-tab">Listing Console</span>
                    </div>

                    <div className="seller-header-right">
                        <button className="btn-secondary" onClick={() => onNavigate('shop')}>
                            Marketplace Storefront
                        </button>

                        <div className="seller-header-profile">
                            <div className="user-initials-badge">{getInitials(sellerName)}</div>
                            <span className="seller-username">{sellerName}</span>
                            <button onClick={handleLogout} className="seller-logout-btn">
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-content-wrapper">
                <div className="dashboard-container">
                    <div className="dashboard-header-row">
                        <div>
                            <h1 className="dashboard-title">Seller Dashboard</h1>
                        </div>
                    </div>

                    {/* Analytics / Overview Section */}
                    <div className="dashboard-analytics-row">
                        <div className="analytics-card">
                            <h3>Total Active Listings</h3>
                            <div className="analytics-value">{products.length}</div>
                        </div>
                        <div className="analytics-card">
                            <h3>Average Listing Price</h3>
                            <div className="analytics-value">
                                ${products.length > 0
                                    ? (products.reduce((acc, curr) => acc + curr.price, 0) / products.length).toFixed(2)
                                    : "0.00"}
                            </div>
                        </div>
                    </div>

                    {errorMsg && <div className="auth-alert-full error">{errorMsg}</div>}
                    {successMsg && <div className="auth-alert-full success">{successMsg}</div>}

                    <div className="dashboard-grid">
                        {/* Column 1: Create Product Form */}
                        <div className="dashboard-card-shell">
                            <div className="dashboard-card-inner">
                                <h2 className="dashboard-card-title">Register New Cut</h2>
                                <form onSubmit={handleCreateListing} className="dashboard-form-fields">
                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-name">Product Name</label>
                                        <input
                                            id="prod-name"
                                            type="text"
                                            required
                                            placeholder="e.g. Dry-Aged Ribeye Steak"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="dashboard-input"
                                        />
                                    </div>

                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-price">Price (USD)</label>
                                        <input
                                            id="prod-price"
                                            type="number"
                                            step="0.01"
                                            required
                                            placeholder="e.g. 28.50"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="dashboard-input"
                                        />
                                    </div>

                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-animal">Animal Category</label>
                                        <select
                                            id="prod-animal"
                                            value={animalType}
                                            onChange={(e) => setAnimalType(e.target.value)}
                                            className="dashboard-select"
                                        >
                                            {animalTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-cat">Cut Category</label>
                                        <select
                                            id="prod-cat"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="dashboard-select"
                                        >
                                            {commonCategories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-img">Display Image Preset</label>
                                        <select
                                            id="prod-img"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="dashboard-select"
                                        >
                                            {imagePresets.map(preset => (
                                                <option key={preset.path} value={preset.path}>{preset.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="dashboard-form-group">
                                        <label htmlFor="prod-desc">Description & Sourcing Specs</label>
                                        <textarea
                                            id="prod-desc"
                                            required
                                            placeholder="e.g. Richly marbled, grass-fed ribeye aged for 21 days..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="dashboard-textarea"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="dashboard-submit-btn"
                                    >
                                        {actionLoading ? "Registering..." : "Publish Listing"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Column 2: Listings List */}
                        <div className="dashboard-card-shell">
                            <div className="dashboard-card-inner">
                                <h2 className="dashboard-card-title">Active Market Listings</h2>
                                {loading ? (
                                    <p style={{ color: 'var(--text-main)' }}>Loading listings inventory...</p>
                                ) : (
                                    <div className="listings-list">
                                        {products.map(prod => (
                                            <div key={prod.id} className="listing-item-outer">
                                                <div className="listing-item-card">
                                                    <div className="listing-item-left">
                                                        <div className="listing-thumbnail-shell">
                                                            <img src={prod.imageUrl} alt={prod.name} className="listing-thumbnail" />
                                                        </div>
                                                        <div className="listing-info">
                                                            <h3>{prod.name}</h3>
                                                            <div className="listing-meta">
                                                                <span className="animal-tag">{prod.animalType}</span>
                                                                <span>•</span>
                                                                <span>{prod.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                        <div className="listing-price-col">
                                                            ${prod.price.toFixed(2)}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteListing(prod.id)}
                                                            className="delete-listing-btn"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {products.length === 0 && (
                                            <div className="no-listings-state">
                                                <p>No active listings found.</p>
                                                <span>Register your custom butcher cuts to populate the customer shop.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default SellerDashboard;
