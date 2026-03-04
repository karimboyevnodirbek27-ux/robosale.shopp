import './Skeleton.css';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-content">
            <div className="skeleton-badge shimmer"></div>
            <div className="skeleton-title shimmer"></div>
            <div className="skeleton-price shimmer"></div>
            <div className="skeleton-button shimmer"></div>
        </div>
    </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="products-grid grid grid-4">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
    <div className="product-detail-skeleton">
        <div className="skeleton-gallery">
            <div className="skeleton-main-image shimmer"></div>
        </div>
        <div className="skeleton-info">
            <div className="skeleton-category shimmer"></div>
            <div className="skeleton-detail-title shimmer"></div>
            <div className="skeleton-rating shimmer"></div>
            <div className="skeleton-detail-price shimmer"></div>
            <div className="skeleton-description shimmer"></div>
            <div className="skeleton-description shimmer" style={{ width: '80%' }}></div>
            <div className="skeleton-actions shimmer"></div>
        </div>
    </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
    <tr className="skeleton-row">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i}><div className="skeleton-cell shimmer"></div></td>
        ))}
    </tr>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
    <div className="skeleton-stats-card">
        <div className="skeleton-icon shimmer"></div>
        <div className="skeleton-stats-content">
            <div className="skeleton-stats-value shimmer"></div>
            <div className="skeleton-stats-label shimmer"></div>
        </div>
    </div>
);

// General Purpose Line Skeleton
export const LineSkeleton = ({ width = '100%', height = '20px' }) => (
    <div className="skeleton-line shimmer" style={{ width, height }}></div>
);

// Circle Skeleton (for avatars)
export const CircleSkeleton = ({ size = 48 }) => (
    <div className="skeleton-circle shimmer" style={{ width: size, height: size }}></div>
);
