import { useState } from 'react';
import './styles/login.css';

interface LoginProps {
    onNavigate: (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => void;
}

function Login({ onNavigate }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("BUYER");
    const [profilePic, setProfilePic] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            if (isLogin) {
                // Submit Login Request DTO
                const response = await fetch("http://localhost:8080/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error("Invalid username or password. Please try again.");
                }

                const data = await response.json();

                // Persist session parameters
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                setSuccessMsg("Access Granted. Redirecting...");
                setTimeout(() => {
                    if (data.user && data.user.role === "SELLER") {
                        onNavigate('seller-dashboard');
                    } else {
                        onNavigate('landing');
                    }
                }, 1000);
            } else {
                // Submit User Registration DTO
                const registerBody = {
                    username,
                    email,
                    rawPassword: password,
                    role,
                    profilePictureUrl: profilePic || "https://api.dicebear.com/7.x/initials/svg?seed=" + username
                };

                const response = await fetch("http://localhost:8080/api/users/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(registerBody)
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || "Registration failed. Username or email might be taken.");
                }

                setSuccessMsg("Account created successfully! Please sign in.");
                setIsLogin(true);
                setPassword("");
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Connection refused. Please ensure the backend is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-layout-full">
            {/* Full-bleed background image and overlay */}
            <img src="/pasture.png" alt="Rel's Cattle Pastures at Sunset" className="auth-bg-img-full" />
            <div className="auth-visual-overlay-full"></div>

            <div className="auth-main-row-full">
                {/* Left Column: Editorial Welcome */}
                <div className="auth-left-visual-full">
                    <button className='auth-back-btn' onClick={() => onNavigate('landing')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                    <h2 className="auth-visual-title-full">Welcome<br />Back</h2>
                    <p className="auth-visual-desc-full">
                        Access your butcher account to manage your fresh portion box, review delivery dates,
                        change vacuum-sealing options, or check wholesale cuts directly from the farms.
                    </p>

                    {/* Social icons matching visual style */}
                    <div className="auth-social-row-full">
                        <a href="#facebook" className="social-icon-btn-full" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                        <a href="#twitter" className="social-icon-btn-full" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                        <a href="#instagram" className="social-icon-btn-full" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                            </svg>
                        </a>
                        <a href="#youtube" className="social-icon-btn-full" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Right Column: Sign In Form Overlaid Transparently */}
                <div className="auth-right-form-col-full">
                    <div className="auth-form-card-full">
                        <h1 className="auth-form-title-full">{isLogin ? "Sign in" : "Create Account"}</h1>

                        {errorMsg && <div className="auth-alert-full error">{errorMsg}</div>}
                        {successMsg && <div className="auth-alert-full success">{successMsg}</div>}

                        <form onSubmit={handleFormSubmit} className="auth-form-fields-full">
                            {/* Username */}
                            <div className="auth-form-group-full">
                                <label htmlFor="auth-username">Username</label>
                                <input
                                    id="auth-username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="auth-text-input-full"
                                />
                            </div>

                            {/* Email (only for registration) */}
                            {!isLogin && (
                                <div className="auth-form-group-full">
                                    <label htmlFor="auth-email">Email Address</label>
                                    <input
                                        id="auth-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="auth-text-input-full"
                                    />
                                </div>
                            )}

                            {/* Password */}
                            <div className="auth-form-group-full">
                                <label htmlFor="auth-password">Password</label>
                                <input
                                    id="auth-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="auth-text-input-full"
                                />
                            </div>

                            {/* Profile Picture URL (only for registration) */}
                            {!isLogin && (
                                <div className="auth-form-group-full">
                                    <label htmlFor="auth-pic">Profile Image URL (Optional)</label>
                                    <input
                                        id="auth-pic"
                                        type="url"
                                        value={profilePic}
                                        onChange={(e) => setProfilePic(e.target.value)}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="auth-text-input-full"
                                    />
                                </div>
                            )}

                            {/* Account Role Dropdown (only for registration) */}
                            {!isLogin && (
                                <div className="auth-form-group-full">
                                    <label htmlFor="auth-role">Account Type</label>
                                    <select
                                        id="auth-role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="auth-select-input-full"
                                    >
                                        <option value="BUYER">Buyer (Customer)</option>
                                        <option value="SELLER">Seller (Butcher/Shop Manager)</option>
                                    </select>
                                    <span className="auth-field-tip-full">SELLER role grants access to inventory edit actions.</span>
                                </div>
                            )}

                            {/* Remember Me & Terms (only for login) */}
                            {isLogin ? (
                                <div className="auth-form-row-full">
                                    <label className="auth-checkbox-label-full">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="auth-checkbox-full"
                                        />
                                        <span>Remember Me</span>
                                    </label>
                                </div>
                            ) : null}

                            {/* Action Submit Button (orange-red style matching visual) */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-submit-btn-full"
                            >
                                {loading ? "Connecting..." : isLogin ? "Sign in now" : "Create account now"}
                            </button>

                            {/* Additional Actions */}
                            {isLogin ? (
                                <a href="#lost" className="auth-forgot-link-full">Lost your password?</a>
                            ) : null}

                            {/* Auth View Switch Toggle */}
                            <div className="auth-toggle-row-full">
                                {isLogin ? (
                                    <p>
                                        New to Rel's Meat Co.?{" "}
                                        <button type="button" className="auth-toggle-btn-full" onClick={() => setIsLogin(false)}>
                                            Create an account
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{" "}
                                        <button type="button" className="auth-toggle-btn-full" onClick={() => setIsLogin(true)}>
                                            Sign in here
                                        </button>
                                    </p>
                                )}
                            </div>
                        </form>

                        <div className="auth-terms-disclaimer-full">
                            By clicking "{isLogin ? "Sign in now" : "Create account now"}" you agree to our<br />
                            <a href="#terms">Terms of Service</a> | <a href="#privacy">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
