/**
 * Reusable skeleton loading component with pulse animation.
 * 
 * Usage:
 *   <Skeleton width={200} height={20} />
 *   <Skeleton width="100%" height={180} borderRadius={16} />
 *   <Skeleton.Card />      — full card placeholder
 *   <Skeleton.Text lines={3} /> — multi-line text placeholder
 */

const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '400% 100%',
    animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
};

export default function Skeleton({ width = '100%', height = 16, borderRadius = 8, style = {}, className = '' }) {
    return (
        <div
            className={`skeleton-pulse ${className}`}
            style={{
                ...shimmerStyle,
                width,
                height,
                borderRadius,
                ...style,
            }}
        />
    );
}

/** Multi-line text skeleton */
Skeleton.Text = function SkeletonText({ lines = 3, gap = 10, lastWidth = '60%' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={14}
                    width={i === lines - 1 ? lastWidth : '100%'}
                />
            ))}
        </div>
    );
};

/** Card skeleton for article/portfolio lists */
Skeleton.Card = function SkeletonCard({ imageHeight = 200 }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            overflow: 'hidden',
        }}>
            <Skeleton width="100%" height={imageHeight} borderRadius={0} />
            <div style={{ padding: 'clamp(16px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Skeleton width={80} height={22} borderRadius={50} />
                    <Skeleton width={100} height={22} borderRadius={50} />
                </div>
                <Skeleton width="85%" height={20} />
                <Skeleton.Text lines={2} gap={8} lastWidth="70%" />
                <Skeleton width={100} height={14} style={{ marginTop: 4 }} />
            </div>
        </div>
    );
};

/** Stat card skeleton for dashboards */
Skeleton.Stat = function SkeletonStat() {
    return (
        <div className="stat-card">
            <Skeleton width={60} height={36} style={{ marginBottom: 8 }} />
            <Skeleton width="75%" height={14} />
        </div>
    );
};

/** Chart placeholder skeleton */
Skeleton.Chart = function SkeletonChart({ height = 200 }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, padding: '0 8px' }}>
            {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <Skeleton
                    key={i}
                    width="100%"
                    height={`${h}%`}
                    borderRadius={6}
                    style={{ flex: 1 }}
                />
            ))}
        </div>
    );
};

/** Table row skeleton */
Skeleton.TableRow = function SkeletonTableRow({ cols = 4 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} style={{ padding: '12px 16px' }}>
                    <Skeleton width={i === 0 ? '70%' : '50%'} height={14} />
                </td>
            ))}
        </tr>
    );
};

/** Portfolio image card skeleton (public page) */
Skeleton.PortfolioCard = function SkeletonPortfolioCard() {
    return (
        <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#000',
            height: 'clamp(280px, 45vh, 450px)',
        }}>
            <Skeleton width="100%" height="100%" borderRadius={0} />
            <div style={{ position: 'absolute', bottom: 'clamp(15px, 3vw, 30px)', left: 'clamp(15px, 3vw, 30px)', right: 'clamp(15px, 3vw, 30px)' }}>
                <Skeleton width={100} height={22} borderRadius={50} style={{ marginBottom: 10 }} />
                <Skeleton width="60%" height={28} />
            </div>
        </div>
    );
};
