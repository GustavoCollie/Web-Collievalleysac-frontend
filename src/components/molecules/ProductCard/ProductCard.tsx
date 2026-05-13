import type { Product } from "../../../types/product";
import { Badge } from "../../atoms/Badge/Badge";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

const SEASON_MONTHS = [
  "", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div
      className="group cursor-pointer rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
      onClick={() => onSelect?.(product)}
    >
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="mb-4 h-40 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-collie-50">
          <span className="text-4xl text-collie-200">🌿</span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-collie-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <Badge variant={product.is_available ? "success" : "neutral"}>
          {product.is_available ? "Disponible" : "No disponible"}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-collie-600">
          ${product.price_per_kg.toFixed(2)}/kg
        </span>
        <span className="text-xs text-gray-400">
          {SEASON_MONTHS[product.season_start]} - {SEASON_MONTHS[product.season_end]}
        </span>
      </div>
    </div>
  );
}
