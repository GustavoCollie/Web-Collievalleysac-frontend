import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../../../../services/productService";
import { orderService } from "../../../../services/orderService";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { H1 } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";
import type { Product } from "../../../../types/product";

interface CartItem {
  product: Product;
  quantity_kg: number;
  quality_grade: string;
}

export function OrderCreate() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    productService.getProducts().then((prods) => {
      setProducts(prods);
      const preselected = searchParams.get("product");
      if (preselected) {
        const found = prods.find((p) => p.id === preselected);
        if (found) {
          setCart([{ product: found, quantity_kg: 100, quality_grade: "Standard" }]);
        }
      }
      setLoading(false);
    });
  }, [searchParams]);

  const addItem = (product: Product) => {
    if (cart.some((c) => c.product.id === product.id)) return;
    setCart([...cart, { product, quantity_kg: 100, quality_grade: "Standard" }]);
  };

  const removeItem = (productId: string) => {
    setCart(cart.filter((c) => c.product.id !== productId));
  };

  const updateItem = (productId: string, field: string, value: string | number) => {
    setCart(
      cart.map((c) =>
        c.product.id === productId ? { ...c, [field]: value } : c,
      ),
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.quantity_kg * item.product.price_per_kg,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Agrega al menos un producto al pedido.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await orderService.createOrder({
        items: cart.map((c) => ({
          product_id: c.product.id,
          quantity_kg: c.quantity_kg,
          quality_grade: c.quality_grade,
        })),
        delivery_date: deliveryDate || undefined,
        shipping_address: shippingAddress,
        notes,
      });
      navigate("/importer/orders");
    } catch {
      setError("Error al crear el pedido. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center"><Spinner /></div>
    );
  }

  return (
    <div>
      <H1>Nuevo Pedido</H1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Product selector */}
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-medium">Agregar productos</h3>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  cart.some((c) => c.product.id === p.id)
                    ? "border-collie-300 bg-collie-50"
                    : "border-gray-200 hover:border-collie-200"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    ${p.price_per_kg.toFixed(2)}/kg
                  </p>
                </div>
                {cart.some((c) => c.product.id === p.id) ? (
                  <span className="text-xs text-collie-600">Agregado</span>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => addItem(p)}>
                    Agregar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 text-lg font-medium">
              Detalle del pedido ({cart.length} productos)
            </h3>

            {cart.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                Selecciona productos de la lista para agregar.
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        ${item.product.price_per_kg.toFixed(2)}/kg
                      </p>
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        value={String(item.quantity_kg)}
                        onChange={(e) =>
                          updateItem(
                            item.product.id,
                            "quantity_kg",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        label="Kg"
                      />
                    </div>
                    <div className="w-32">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Calidad
                      </label>
                      <select
                        value={item.quality_grade}
                        onChange={(e) =>
                          updateItem(item.product.id, "quality_grade", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                      >
                        <option value="Premium">Premium</option>
                        <option value="Standard">Standard</option>
                        <option value="Economy">Economy</option>
                      </select>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-sm font-bold">
                        ${(item.quantity_kg * item.product.price_per_kg).toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Order details */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Fecha de entrega deseada"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
              <Input
                label="Dirección de envío"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notas
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Total and submit */}
            <div className="mt-6 flex items-center justify-between rounded-lg bg-collie-50 p-4">
              <span className="text-lg font-semibold">Total estimado:</span>
              <span className="text-2xl font-bold text-collie-700">
                ${total.toFixed(2)} USD
              </span>
            </div>

            <Button
              type="submit"
              isLoading={submitting}
              disabled={cart.length === 0}
              className="mt-4 w-full"
            >
              Confirmar Pedido
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
