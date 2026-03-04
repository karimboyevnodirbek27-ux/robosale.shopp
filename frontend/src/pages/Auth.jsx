import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiAlertCircle, FiLogIn } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Check if already logged in
    useEffect(() => {
        const user = localStorage.getItem('robosale_user');
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Phone number formatting
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

        // Format: XX-XXX-XX-XX (without +998)
        if (value.length > 9) value = value.slice(0, 9);

        let formatted = '';
        if (value.length > 0) {
            formatted = value.slice(0, 2);
        }
        if (value.length > 2) {
            formatted += '-' + value.slice(2, 5);
        }
        if (value.length > 5) {
            formatted += '-' + value.slice(5, 7);
        }
        if (value.length > 7) {
            formatted += '-' + value.slice(7, 9);
        }

        setFormData(prev => ({ ...prev, phone: formatted }));
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };

    const getFullPhone = () => {
        return '+998' + formData.phone.replace(/-/g, '');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            if (!formData.firstName.trim()) newErrors.firstName = 'Ism kiritilishi shart';
            if (!formData.lastName.trim()) newErrors.lastName = 'Familiya kiritilishi shart';
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Parollar mos kelmayapti';
            }
        }

        const phoneDigits = formData.phone.replace(/-/g, '');
        if (!phoneDigits || phoneDigits.length !== 9) {
            newErrors.phone = 'To\'liq telefon raqam kiritilishi shart (9 ta raqam)';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Parol kiritilishi shart';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring');
            return;
        }

        setLoading(true);
        const fullPhone = getFullPhone();

        if (isLogin) {
            // Login
            const users = JSON.parse(localStorage.getItem('robosale_users') || '[]');
            const user = users.find(u => u.phone === fullPhone && u.password === formData.password);

            if (user) {
                localStorage.setItem('robosale_user', JSON.stringify(user));
                localStorage.setItem('robosale_token', 'user_token_' + Date.now());
                toast.success(`${user.firstName}, xush kelibsiz!`);
                // Redirect to home
                window.location.href = '/';
            } else {
                toast.error('Telefon raqam yoki parol noto\'g\'ri');
                setLoading(false);
            }
        } else {
            // Registration
            const users = JSON.parse(localStorage.getItem('robosale_users') || '[]');
            const exists = users.find(u => u.phone === fullPhone);

            if (exists) {
                toast.error('Bu raqam bilan foydalanuvchi mavjud');
                setLoading(false);
            } else {
                const newUser = {
                    id: Date.now(),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: fullPhone,
                    password: formData.password
                };
                users.push(newUser);
                localStorage.setItem('robosale_users', JSON.stringify(users));
                localStorage.setItem('robosale_user', JSON.stringify(newUser));
                localStorage.setItem('robosale_token', 'user_token_' + Date.now());
                toast.success(`${newUser.firstName}, ro'yxatdan muvaffaqiyatli o'tdingiz!`);
                // Redirect to home
                window.location.href = '/';
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <Link to="/" className="auth-logo">
                        <span className="logo-icon">🤖</span>
                        <span>RoboSale</span>
                    </Link>
                    <h1>
                        {isLogin ? 'Qaytganingizdan xursandmiz!' : 'Yangi akkaunt yarating'}
                    </h1>
                    <p>
                        {isLogin
                            ? 'Akkauntingizga kiring va xaridni davom ettiring'
                            : 'Ro\'yxatdan o\'ting va mahsulotlarni xarid qiling'
                        }
                    </p>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <span>📱</span>
                            <span>Telegram orqali buyurtma</span>
                        </div>
                        <div className="auth-feature">
                            <span>🚚</span>
                            <span>Beruniy bo'ylab yetkazish</span>
                        </div>
                        <div className="auth-feature">
                            <span>💯</span>
                            <span>Sifatli mahsulotlar</span>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        <div className="auth-tabs">
                            <button
                                className={isLogin ? 'active' : ''}
                                onClick={() => setIsLogin(true)}
                            >
                                Kirish
                            </button>
                            <button
                                className={!isLogin ? 'active' : ''}
                                onClick={() => setIsLogin(false)}
                            >
                                Ro'yxatdan o'tish
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="form-row">
                                    <div className={`input-group ${errors.firstName ? 'error' : ''}`}>
                                        <label>Ism</label>
                                        <div className="input-with-icon">
                                            <FiUser className="input-icon" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Ismingiz"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.firstName && <span className="error-text"><FiAlertCircle /> {errors.firstName}</span>}
                                    </div>
                                    <div className={`input-group ${errors.lastName ? 'error' : ''}`}>
                                        <label>Familiya</label>
                                        <div className="input-with-icon">
                                            <FiUser className="input-icon" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Familiyangiz"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.lastName && <span className="error-text"><FiAlertCircle /> {errors.lastName}</span>}
                                    </div>
                                </div>
                            )}

                            <div className={`input-group ${errors.phone ? 'error' : ''}`}>
                                <label>Telefon raqam</label>
                                <div className="input-with-icon phone-input">
                                    <span className="phone-prefix">+998</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="90-123-45-67"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        maxLength="12"
                                    />
                                </div>
                                {errors.phone && <span className="error-text"><FiAlertCircle /> {errors.phone}</span>}
                            </div>

                            <div className={`input-group ${errors.password ? 'error' : ''}`}>
                                <label>Parol</label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="error-text"><FiAlertCircle /> {errors.password}</span>}
                            </div>

                            {!isLogin && (
                                <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`}>
                                    <label>Parolni tasdiqlang</label>
                                    <div className="input-with-icon">
                                        <FiLock className="input-icon" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.confirmPassword && <span className="error-text"><FiAlertCircle /> {errors.confirmPassword}</span>}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                                <FiLogIn />
                                {loading ? 'Kutilmoqda...' : (isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
