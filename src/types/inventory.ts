// Define inventory-related types based on the database schema

// Import common types
import { Json } from './database';

// Define enum types
export type ProductCategory = 'electronics' | 'office' | 'furniture' | 'supplies' | 'other';
export type StockMovementType = 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'count';

// Define table interfaces
export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  category: ProductCategory;
  price: number | null;
  cost: number | null;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface StockLocation {
  id: string;
  name: string;
  description: string | null;
  location_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  location_id: string;
  quantity: number;
  last_counted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  source_location_id: string | null;
  destination_location_id: string | null;
  quantity: number;
  movement_type: StockMovementType;
  reference_number: string | null;
  notes: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface LowStockAlert {
  id: string;
  product_id: string;
  location_id: string;
  current_quantity: number;
  threshold: number;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// Input types for creating/updating records
export interface CreateProductInput {
  name: string;
  description?: string | null;
  sku: string;
  category?: ProductCategory;
  price?: number | null;
  cost?: number | null;
  low_stock_threshold?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  sku?: string;
  category?: ProductCategory;
  price?: number | null;
  cost?: number | null;
  low_stock_threshold?: number;
}

export interface CreateStockLocationInput {
  name: string;
  description?: string | null;
  location_code: string;
  is_active?: boolean;
}

export interface UpdateStockLocationInput {
  name?: string;
  description?: string | null;
  location_code?: string;
  is_active?: boolean;
}

export interface CreateInventoryItemInput {
  product_id: string;
  location_id: string;
  quantity: number;
  last_counted_at?: string | null;
}

export interface UpdateInventoryItemInput {
  quantity?: number;
  last_counted_at?: string | null;
}

export interface CreateStockMovementInput {
  product_id: string;
  source_location_id?: string | null;
  destination_location_id?: string | null;
  quantity: number;
  movement_type: StockMovementType;
  reference_number?: string | null;
  notes?: string | null;
}

export interface ResolveLowStockAlertInput {
  id: string;
  is_resolved: boolean;
}