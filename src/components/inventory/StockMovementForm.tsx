import React, { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabaseClient"; // Import useSupabase
import { InventoryService } from "@/services/InventoryService";
import { Product, StockLocation, StockMovementType } from "@/types/inventory";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";

interface StockMovementFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
  productId?: string; // Optional pre-selected product
  locationId?: string; // Optional pre-selected location
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  onComplete,
  onCancel,
  productId,
  locationId,
}) => {
  const { session } = useSupabase(); // Use useSupabase hook
  const user = session?.user; // Get user from session
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState<string>(
    productId || ""
  );
  const [movementType, setMovementType] =
    useState<StockMovementType>("purchase");
  const [sourceLocation, setSourceLocation] = useState<string>(
    locationId || ""
  );
  const [destinationLocation, setDestinationLocation] = useState<string>(
    locationId || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    const inventoryService = new InventoryService(user.id);

    try {
      // Load products and locations in parallel
      const [productsData, locationsData] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getStockLocations(),
      ]);

      setProducts(productsData);
      setLocations(locationsData);

      // Set default values if provided
      if (productId) {
        setSelectedProduct(productId);
      } else if (productsData.length > 0) {
        setSelectedProduct(productsData[0].id);
      }

      if (locationId) {
        setSourceLocation(locationId);
        setDestinationLocation(locationId);
      } else if (locationsData.length > 0) {
        setSourceLocation(locationsData[0].id);
        setDestinationLocation(locationsData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load products and locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedProduct) return;

    setError(null);
    setSubmitting(true);

    try {
      const inventoryService = new InventoryService(user.id);

      // Prepare input based on movement type
      const input = {
        product_id: selectedProduct,
        quantity,
        movement_type: movementType,
        reference_number: referenceNumber || null,
        notes: notes || null,
        source_location_id: ["sale", "transfer"].includes(movementType)
          ? sourceLocation
          : null,
        destination_location_id: ["purchase", "transfer", "count"].includes(
          movementType
        )
          ? destinationLocation
          : null,
      };

      // Validate input based on movement type
      if (movementType === "purchase" && !destinationLocation) {
        setError("Destination location is required for purchases");
        setSubmitting(false);
        return;
      }

      if (movementType === "sale" && !sourceLocation) {
        setError("Source location is required for sales");
        setSubmitting(false);
        return;
      }

      if (
        movementType === "transfer" &&
        (!sourceLocation || !destinationLocation)
      ) {
        setError(
          "Both source and destination locations are required for transfers"
        );
        setSubmitting(false);
        return;
      }

      if (movementType === "count" && !destinationLocation) {
        setError("Location is required for inventory counts");
        setSubmitting(false);
        return;
      }

      // Create the stock movement
      const result = await inventoryService.createStockMovement(input);

      if (result) {
        setSuccess(true);
        // Reset form or close
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            setSuccess(false);
            resetForm();
          }
        }, 1500);
      } else {
        setError("Failed to record stock movement. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating stock movement:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct(products.length > 0 ? products[0].id : "");
    setMovementType("purchase");
    setSourceLocation(locations.length > 0 ? locations[0].id : "");
    setDestinationLocation(locations.length > 0 ? locations[0].id : "");
    setQuantity(1);
    setReferenceNumber("");
    setNotes("");
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Record Stock Movement
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
          Stock movement recorded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Movement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Movement Type
            </label>
            <select
              value={movementType}
              onChange={(e) =>
                setMovementType(e.target.value as StockMovementType)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="purchase">Purchase (Add Stock)</option>
              <option value="sale">Sale (Remove Stock)</option>
              <option value="transfer">Transfer Between Locations</option>
              <option value="adjustment">Inventory Adjustment</option>
              <option value="count">Inventory Count</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Source Location - for sales and transfers */}
          {["sale", "transfer", "adjustment"].includes(movementType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {movementType === "transfer" ? "Source Location" : "Location"}
              </label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.location_code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Destination Location - for purchases, transfers, and counts */}
          {["purchase", "transfer", "count", "adjustment"].includes(
            movementType
          ) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {movementType === "transfer"
                  ? "Destination Location"
                  : "Location"}
              </label>
              <select
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.location_code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reference Number (Optional)
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Invoice #, PO #, etc."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Additional details about this stock movement"
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Record Movement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockMovementForm;
