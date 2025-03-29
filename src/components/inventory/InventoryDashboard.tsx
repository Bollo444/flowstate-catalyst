import React, { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabaseClient"; // Import useSupabase
import { InventoryService } from "@/services/InventoryService";
import {
  Product,
  StockLocation,
  InventoryItem,
  LowStockAlert,
} from "@/types/inventory";
import {
  AlertTriangle,
  Package,
  MapPin,
  ArrowRight,
  Plus,
  RefreshCw,
} from "lucide-react";

interface InventorySummary {
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  total_quantity: number;
  locations: {
    location_id: string;
    location_name: string;
    quantity: number;
  }[];
  low_stock: boolean;
}

const InventoryDashboard: React.FC = () => {
  const { session } = useSupabase(); // Use useSupabase hook
  const user = session?.user; // Get user from session
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "locations" | "alerts"
  >("overview");

  useEffect(() => {
    if (user?.id) {
      loadInventoryData();
    }
  }, [user]);

  const loadInventoryData = async () => {
    if (!user?.id) return;

    setLoading(true);
    const inventoryService = new InventoryService(user.id);

    try {
      // Load all inventory data in parallel
      const [productsData, locationsData, alertsData] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getStockLocations(),
        inventoryService.getLowStockAlerts(false),
      ]);

      setProducts(productsData);
      setLocations(locationsData);
      setLowStockAlerts(alertsData);

      // Load inventory items after we have products and locations
      const itemsData = await inventoryService.getInventoryItems();
      setInventoryItems(itemsData);

      // Generate inventory summary
      const summary = generateInventorySummary(
        productsData,
        locationsData,
        itemsData,
        alertsData
      );
      setInventorySummary(summary);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      setError("Failed to load inventory data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateInventorySummary = (
    products: Product[],
    locations: StockLocation[],
    items: InventoryItem[],
    alerts: LowStockAlert[]
  ): InventorySummary[] => {
    const summary: InventorySummary[] = [];

    // Create a map of product IDs to their low stock status
    const lowStockMap = new Map<string, boolean>();
    alerts.forEach((alert) => {
      lowStockMap.set(alert.product_id, true);
    });

    // Process each product
    products.forEach((product) => {
      // Find all inventory items for this product
      const productItems = items.filter(
        (item) => item.product_id === product.id
      );

      // Calculate total quantity across all locations
      const totalQuantity = productItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Create location details
      const locationDetails = productItems.map((item) => {
        const location = locations.find((loc) => loc.id === item.location_id);
        return {
          location_id: item.location_id,
          location_name: location?.name || "Unknown Location",
          quantity: item.quantity,
        };
      });

      // Add to summary
      summary.push({
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        category: product.category,
        total_quantity: totalQuantity,
        locations: locationDetails,
        low_stock:
          lowStockMap.has(product.id) ||
          totalQuantity <= product.low_stock_threshold,
      });
    });

    return summary;
  };

  const refreshData = () => {
    loadInventoryData();
  };

  const renderOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Package className="mr-2 h-5 w-5 text-blue-500" />
            Products
          </h3>
          <p className="text-3xl font-bold">{products.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total products in inventory
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-green-500" />
            Locations
          </h3>
          <p className="text-3xl font-bold">{locations.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active storage locations
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Low Stock Alerts
          </h3>
          <p className="text-3xl font-bold">{lowStockAlerts.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Items requiring attention
          </p>
        </div>
      </div>
    );
  };

  const renderInventoryTable = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Total Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {inventorySummary.map((item) => (
                <tr key={item.product_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.total_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.low_stock ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLowStockAlerts = () => {
    if (lowStockAlerts.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No low stock alerts at this time.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Current Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Threshold
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {lowStockAlerts.map((alert) => {
                const product = products.find((p) => p.id === alert.product_id);
                const location = locations.find(
                  (l) => l.id === alert.location_id
                );
                return (
                  <tr key={alert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product?.name || "Unknown Product"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {location?.name || "Unknown Location"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {alert.current_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {alert.threshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={async () => {
                          if (!user?.id) return;
                          const inventoryService = new InventoryService(
                            user.id
                          );
                          try {
                            await inventoryService.resolveLowStockAlert({
                              id: alert.id,
                              is_resolved: true,
                            });
                            // Refresh data after resolving
                            loadInventoryData();
                          } catch (error) {
                            console.error("Error resolving alert:", error);
                            setError(
                              "Failed to resolve alert. Please try again."
                            );
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLocations = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-lg font-medium mb-2">{location.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {location.description || "No description"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Code:</span>{" "}
              {location.location_code}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              {location.is_active ? "Active" : "Inactive"}
            </p>
            <div className="mt-4 flex justify-end">
              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                View Inventory
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inventory Management
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${activeTab === "overview" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`${activeTab === "products" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("locations")}
                  className={`${activeTab === "locations" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Locations
                </button>
                <button
                  onClick={() => setActiveTab("alerts")}
                  className={`${activeTab === "alerts" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Low Stock Alerts
                  {lowStockAlerts.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                      {lowStockAlerts.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          <div>
            {activeTab === "overview" && (
              <>
                {renderOverview()}
                {renderInventoryTable()}
              </>
            )}
            {activeTab === "products" && renderInventoryTable()}
            {activeTab === "locations" && renderLocations()}
            {activeTab === "alerts" && renderLowStockAlerts()}
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryDashboard;
