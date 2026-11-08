import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, resolveProductImage } from "./productImage";

export default function ProductImage({ product, className = "", alt }) {
  const resolved = resolveProductImage(product);
  const [src, setSrc] = useState(resolved);

  useEffect(() => {
    setSrc(resolved);
  }, [resolved]);

  return (
    <img
      className={`product-image ${className}`.trim()}
      src={src}
      alt={alt || product?.name || "Producto agrícola"}
      loading="lazy"
      onError={() => {
        if (src !== FALLBACK_IMAGE) setSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
