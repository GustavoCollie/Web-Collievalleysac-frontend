import { H1, Paragraph } from "../../../atoms/Typography/Typography";

// Mock market data — will be replaced with real API data when available
const MARKET_DATA = {
  palta_hass: { price_fob: 2.85, trend: "+5.2%", unit: "USD/kg" },
  mandarina: { price_fob: 1.20, trend: "+2.1%", unit: "USD/kg" },
  paprika: { price_fob: 4.50, trend: "-1.3%", unit: "USD/kg" },
  arandanos: { price_fob: 8.90, trend: "+12.4%", unit: "USD/kg" },
};

const TOP_DESTINATIONS = [
  { country: "Estados Unidos", share: "32%" },
  { country: "Países Bajos", share: "18%" },
  { country: "España", share: "14%" },
  { country: "Reino Unido", share: "11%" },
  { country: "China", share: "8%" },
];

export function MarketIndicators() {
  return (
    <div>
      <H1>Indicadores de Mercado</H1>
      <Paragraph className="mt-2">
        Precios FOB de referencia y tendencias del mercado agroexportador.
      </Paragraph>

      {/* FOB Prices */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(MARKET_DATA).map(([key, data]) => (
          <div key={key} className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium capitalize text-gray-700">
              {key.replace("_", " ")}
            </p>
            <p className="mt-2 text-2xl font-bold text-collie-700">
              ${data.price_fob.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">{data.unit}</p>
            <p
              className={`mt-2 text-sm font-medium ${
                data.trend.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.trend} vs mes anterior
            </p>
          </div>
        ))}
      </div>

      {/* Top destinations */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">
          Principales destinos de exportación
        </h3>
        <div className="mt-4 rounded-xl bg-white shadow-md">
          <div className="divide-y">
            {TOP_DESTINATIONS.map((dest, idx) => (
              <div key={dest.country} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-collie-100 text-sm font-bold text-collie-700">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{dest.country}</span>
                </div>
                <span className="font-semibold text-collie-600">{dest.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-gray-400">
        * Datos de referencia basados en promedios del mercado. Los precios finales pueden
        variar según volumen, certificaciones y condiciones de entrega.
      </p>
    </div>
  );
}
