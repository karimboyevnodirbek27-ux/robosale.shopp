import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { categories } from '../data/products';
import { API_URL } from '../config';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        sort: searchParams.get('sort') || 'default',
        search: searchParams.get('search') || '',
        minPrice: '',
        maxPrice: ''
    });

    // Sync filters with URL when searchParams change (e.g., from navbar)
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: searchParams.get('category') || 'all',
            sort: searchParams.get('sort') || 'default',
            search: searchParams.get('search') || ''
        }));
    }, [searchParams]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = `${API_URL}/products?`;
                if (filters.category !== 'all') url += `category=${filters.category}&`;
                if (filters.search) url += `search=${filters.search}&`;
                if (filters.sort !== 'default') url += `sort=${filters.sort}&`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    let filteredProducts = data.products;

                    // Client-side price filtering
                    if (filters.minPrice) {
                        filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minPrice));
                    }
                    if (filters.maxPrice) {
                        filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maxPrice));
                    }

                    setProducts(filteredProducts);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError('Mahsulotlarni yuklashda xatolik yuz berdi. Backend server ishga tushirilganini tekshiring.');
                console.error('Fetch error:', err);
                // Fallback to local data
                const { products: localProducts } = await import('../data/products');
                setProducts(localProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters.category, filters.sort, filters.search]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === 'category' || key === 'sort' || key === 'search') {
            if (value && value !== 'all' && value !== 'default') {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
            setSearchParams(searchParams);
        }
    };

    const clearFilters = () => {
        setFilters({
            category: 'all',
            sort: 'default',
            search: '',
            minPrice: '',
            maxPrice: ''
        });
        setSearchParams({});
    };

    const sortOptions = [
        { value: 'default', label: 'Standart' },
        { value: 'price-low', label: 'Narx: arzondan qimmatga' },
        { value: 'price-high', label: 'Narx: qimmatdan arzonga' },
        { value: 'rating', label: 'Reyting bo\'yicha' },
        { value: 'newest', label: 'Eng yangilar' }
    ];

    const activeFiltersCount = [
        filters.category !== 'all',
        filters.minPrice,
        filters.maxPrice
    ].filter(Boolean).length;

    return (
        <div className="products-page">
            <div className="container">
                {/* Header */}
                <div className="products-header">
                    <div className="products-title">
                        <h1>Mahsulotlar</h1>
                        <span className="products-count">{products.length} ta mahsulot</span>
                    </div>

                    <div className="products-controls">
                        {/* Search */}
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Mahsulot qidirish..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                            {filters.search && (
                                <button className="clear-search" onClick={() => handleFilterChange('search', '')}>
                                    <FiX />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Filter Toggle */}
                        <button
                            className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FiFilter />
                            <span>Filterlar</span>
                            {activeFiltersCount > 0 && (
                                <span className="filter-badge">{activeFiltersCount}</span>
                            )}
                        </button>

                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                            >
                                <FiGrid />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                            >
                                <FiList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <p>⚠️ {error}</p>
                    </div>
                )}

                {/* Filters Panel */}
                {showFilters && (
                    <div className="filters-panel animate-fadeIn">
                        <div className="filters-grid">
                            {/* Category */}
                            <div className="filter-group">
                                <label>Kategoriya</label>
                                <div className="category-chips">
                                    <button
                                        className={`chip ${filters.category === 'all' ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('category', 'all')}
                                    >
                                        Barchasi
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`chip ${filters.category === cat.id ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('category', cat.id)}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="filter-group">
                                <label>Narx oralig'i (so'm)</label>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                    <span>—</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {activeFiltersCount > 0 && (
                            <button className="clear-filters" onClick={clearFilters}>
                                <FiX /> Filterlarni tozalash
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <ProductGridSkeleton count={8} />
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <div className="no-products-icon">🔍</div>
                        <h3>Mahsulot topilmadi</h3>
                        <p>Filterlarni o'zgartirib ko'ring</p>
                        <button className="btn btn-primary" onClick={clearFilters}>
                            Filterlarni tozalash
                        </button>
                    </div>
                ) : (
                    <div className={`products-grid ${viewMode === 'list' ? 'list-view' : 'grid grid-4'}`}>
                        {products.map(product => (
                            <ProductCard
                                key={product._id || product.id}
                                product={product}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
