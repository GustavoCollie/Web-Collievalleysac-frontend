import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../../services/productService";
import { ProductCard } from "../../../molecules/ProductCard/ProductCard";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";
import type { Product } from "../../../../types/product";

const MONTHS = [
  { value: "", label: "Todas las temporadas" },
  { value: "1", label: "Enero" }, { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" }, { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" }, { value: "6", label: "Junio" },
  { value: "7", label: "Julio" }, { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" }, { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
];

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const month = monthFilter ? parseInt(monthFilter) : undefined;
    productService
      .getProducts(month)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [monthFilter]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1>Catálogo de Productos</H1>
          <Paragraph className="mt-1">
            Selecciona un producto para crear un pedido.
          </Paragraph>
        </div>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center"><Spinner /></div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => navigate(`/importer/orders/new?product=${product.id}`)}
            />
          ))}
          {products.length === 0 && (
            <p className="col-span-full py-12 text-center text-gray-500">
              No hay productos disponibles para esta temporada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
