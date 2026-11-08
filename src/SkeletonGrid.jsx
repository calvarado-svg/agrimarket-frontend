export default function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product skeleton-card">
          <div className="skeleton-media" />
          <div className="product-body">
            <div className="skeleton-line wide" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
