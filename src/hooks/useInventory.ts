import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { InventoryService } from '@/services/InventoryService';
import {
  Product,
  StockLocation,
  InventoryItem,
  StockMovement,
  LowStockAlert,
  CreateProductInput,
  UpdateProductInput,
  CreateStockLocationInput,
  UpdateStockLocationInput,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  CreateStockMovementInput,
  ResolveLowStockAlertInput
} from '@/types/inventory';

export function useInventory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  
  // Initialize service
  const getService = useCallback(() => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    return new InventoryService(user.id);
  }, [user]);

  // Load all inventory data
  const loadInventoryData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const service = getService();
      
      // Load data in parallel where possible
      const [productsData, locationsData, alertsData, movementsData] = await Promise.all([
        service.getProducts(),
        service.getStockLocations(),
        service.getLowStockAlerts(false),
        service.getStockMovements()
      ]);
      
      setProducts(productsData);
      setLocations(locationsData);
      setLowStockAlerts(alertsData);
      setStockMovements(movementsData);
      
      // Load inventory items after we have products and locations
      const itemsData = await service.getInventoryItems();
      setInventoryItems(itemsData);
    } catch (err: any) {
      console.error('Error loading inventory data:', err);
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, [user, getService]);

  // Load data on initial mount
  useEffect(() => {
    if (user?.id) {
      loadInventoryData();
    }
  }, [user, loadInventoryData]);

  // Product operations
  const createProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    try {
      const service = getService();
      const result = await service.createProduct(input);
      if (result) {
        setProducts(prev => [...prev, result]);
      }
      return result;
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
      return null;
    }
  }, [getService]);

  const updateProduct = useCallback(async (productId: string, input: UpdateProductInput): Promise<Product | null> => {
    try {
      const service = getService();
      const result = await service.updateProduct(productId, input);
      if (result) {
        setProducts(prev => prev.map(p => p.id === productId ? result : p));
      }
      return result;
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      return null;
    }
  }, [getService]);

  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const service = getService();
      const result = await service.deleteProduct(productId);
      if (result) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
      return result;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
      return false;
    }
  }, [getService]);

  // Location operations
  const createLocation = useCallback(async (input: CreateStockLocationInput): Promise<StockLocation | null> => {
    try {
      const service = getService();
      const result = await service.createStockLocation(input);
      if (result) {
        setLocations(prev => [...prev, result]);
      }
      return result;
    } catch (err: any) {
      console.error('Error creating location:', err);
      setError(err.message || 'Failed to create location');
      return null;
    }
  }, [getService]);

  const updateLocation = useCallback(async (locationId: string, input: UpdateStockLocationInput): Promise<StockLocation | null> => {
    try {
      const service = getService();
      const result = await service.updateStockLocation(locationId, input);
      if (result) {
        setLocations(prev => prev.map(l => l.id === locationId ? result : l));
      }
      return result;
    } catch (err: any) {
      console.error('Error updating location:', err);
      setError(err.message || 'Failed to update location');
      return null;
    }
  }, [getService]);

  // Stock movement operations
  const createStockMovement = useCallback(async (input: CreateStockMovementInput): Promise<StockMovement | null> => {
    try {
      const service = getService();
      const result = await service.createStockMovement(input);
      if (result) {
        setStockMovements(prev => [result, ...prev]);
        // Refresh inventory items after a movement
        const items = await service.getInventoryItems();
        setInventoryItems(items);
        // Check for new low stock alerts
        await service.checkAndGenerateLowStockAlerts();
        const alerts = await service.getLowStockAlerts(false);
        setLowStockAlerts(alerts);
      }
      return result;
    } catch (err: any) {
      console.error('Error creating stock movement:', err);
      setError(err.message || 'Failed to create stock movement');
      return null;
    }
  }, [getService]);

  // Low stock alert operations
  const resolveLowStockAlert = useCallback(async (input: ResolveLowStockAlertInput): Promise<LowStockAlert | null> => {
    try {
      const service = getService();
      const result = await service.resolveLowStockAlert(input);
      if (result) {
        setLowStockAlerts(prev => prev.map(a => a.id === input.id ? result : a));
      }
      return result;
    } catch (err: any) {
      console.error('Error resolving low stock alert:', err);
      setError(err.message || 'Failed to resolve low stock alert');
      return null;
    }
  }, [getService]);

  const checkForLowStockAlerts = useCallback(async (): Promise<number> => {
    try {
      const service = getService();
      const count = await service.checkAndGenerateLowStockAlerts();
      if (count > 0) {
        // Refresh alerts if new ones were generated
        const alerts = await service.getLowStockAlerts(false);
        setLowStockAlerts(alerts);
      }
      return count;
    } catch (err: any) {
      console.error('Error checking for low stock alerts:', err);
      setError(err.message || 'Failed to check for low stock alerts');
      return 0;
    }
  }, [getService]);

  return {
    // State
    loading,
    error,
    products,
    locations,
    inventoryItems,
    lowStockAlerts,
    stockMovements,
    
    // Data loading
    loadInventoryData,
    
    // Product operations
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Location operations
    createLocation,
    updateLocation,
    
    // Stock movement operations
    createStockMovement,
    
    // Low stock alert operations
    resolveLowStockAlert,
    checkForLowStockAlerts
  };
}