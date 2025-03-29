import { supabase } from "@/lib/supabaseClient";
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
  ResolveLowStockAlertInput,
  ProductCategory,
  StockMovementType
} from "@/types/inventory";

export class InventoryService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data as Product[];
  }

  async getProductById(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data as Product;
  }

  async createProduct(input: CreateProductInput): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return null;
    }

    return data as Product;
  }

  async updateProduct(productId: string, input: UpdateProductInput): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .update(input)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return null;
    }

    return data as Product;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }

    return true;
  }

  // Stock Location methods
  async getStockLocations(): Promise<StockLocation[]> {
    const { data, error } = await supabase
      .from("stock_locations")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching stock locations:", error);
      return [];
    }

    return data as StockLocation[];
  }

  async getStockLocationById(locationId: string): Promise<StockLocation | null> {
    const { data, error } = await supabase
      .from("stock_locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (error) {
      console.error("Error fetching stock location:", error);
      return null;
    }

    return data as StockLocation;
  }

  async createStockLocation(input: CreateStockLocationInput): Promise<StockLocation | null> {
    const { data, error } = await supabase
      .from("stock_locations")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Error creating stock location:", error);
      return null;
    }

    return data as StockLocation;
  }

  async updateStockLocation(locationId: string, input: UpdateStockLocationInput): Promise<StockLocation | null> {
    const { data, error } = await supabase
      .from("stock_locations")
      .update(input)
      .eq("id", locationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating stock location:", error);
      return null;
    }

    return data as StockLocation;
  }

  // Inventory Item methods
  async getInventoryItems(productId?: string, locationId?: string): Promise<InventoryItem[]> {
    let query = supabase.from("inventory_items").select("*");

    if (productId) {
      query = query.eq("product_id", productId);
    }

    if (locationId) {
      query = query.eq("location_id", locationId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching inventory items:", error);
      return [];
    }

    return data as InventoryItem[];
  }

  async getInventoryItemById(itemId: string): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      console.error("Error fetching inventory item:", error);
      return null;
    }

    return data as InventoryItem;
  }

  async createInventoryItem(input: CreateInventoryItemInput): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory_items")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Error creating inventory item:", error);
      return null;
    }

    return data as InventoryItem;
  }

  async updateInventoryItem(itemId: string, input: UpdateInventoryItemInput): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory_items")
      .update(input)
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      console.error("Error updating inventory item:", error);
      return null;
    }

    return data as InventoryItem;
  }

  // Stock Movement methods
  async getStockMovements(productId?: string, movementType?: StockMovementType): Promise<StockMovement[]> {
    let query = supabase.from("stock_movements").select("*").order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    if (movementType) {
      query = query.eq("movement_type", movementType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching stock movements:", error);
      return [];
    }

    return data as StockMovement[];
  }

  async createStockMovement(input: CreateStockMovementInput): Promise<StockMovement | null> {
    // Start a transaction to update inventory items and create movement record
    const { data, error } = await supabase.rpc('create_stock_movement', {
      p_product_id: input.product_id,
      p_source_location_id: input.source_location_id,
      p_destination_location_id: input.destination_location_id,
      p_quantity: input.quantity,
      p_movement_type: input.movement_type,
      p_reference_number: input.reference_number,
      p_notes: input.notes,
      p_performed_by: this.userId
    });

    if (error) {
      console.error("Error creating stock movement:", error);
      return null;
    }

    return data as StockMovement;
  }

  // Low Stock Alert methods
  async getLowStockAlerts(resolved: boolean = false): Promise<LowStockAlert[]> {
    const { data, error } = await supabase
      .from("low_stock_alerts")
      .select("*")
      .eq("is_resolved", resolved)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching low stock alerts:", error);
      return [];
    }

    return data as LowStockAlert[];
  }

  async resolveLowStockAlert(input: ResolveLowStockAlertInput): Promise<LowStockAlert | null> {
    const updateData = {
      is_resolved: input.is_resolved,
      resolved_at: input.is_resolved ? new Date().toISOString() : null
    };

    const { data, error } = await supabase
      .from("low_stock_alerts")
      .update(updateData)
      .eq("id", input.id)
      .select()
      .single();

    if (error) {
      console.error("Error resolving low stock alert:", error);
      return null;
    }

    return data as LowStockAlert;
  }

  // Check for low stock and generate alerts
  async checkAndGenerateLowStockAlerts(): Promise<number> {
    const { data, error } = await supabase.rpc('generate_low_stock_alerts');

    if (error) {
      console.error("Error generating low stock alerts:", error);
      return 0;
    }

    return data as number;
  }
}