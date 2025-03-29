-- Create inventory-related tables

-- Product categories enum
CREATE TYPE product_category AS ENUM ('electronics', 'office', 'furniture', 'supplies', 'other');

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE NOT NULL,
    category product_category NOT NULL DEFAULT 'other',
    price NUMERIC(10, 2),
    cost NUMERIC(10, 2),
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock locations table
CREATE TABLE stock_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location_code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inventory items table (current stock levels)
CREATE TABLE inventory_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES stock_locations(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_counted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(product_id, location_id)
);

-- Stock movement types enum
CREATE TYPE stock_movement_type AS ENUM ('purchase', 'sale', 'transfer', 'adjustment', 'count');

-- Stock movement history table
CREATE TABLE stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_location_id UUID REFERENCES stock_locations(id) ON DELETE SET NULL,
    destination_location_id UUID REFERENCES stock_locations(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    movement_type stock_movement_type NOT NULL,
    reference_number TEXT,
    notes TEXT,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Low stock alerts table
CREATE TABLE low_stock_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES stock_locations(id) ON DELETE CASCADE,
    current_quantity INTEGER NOT NULL,
    threshold INTEGER NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for common queries
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX inventory_items_product_id_idx ON inventory_items(product_id);
CREATE INDEX inventory_items_location_id_idx ON inventory_items(location_id);
CREATE INDEX stock_movements_product_id_idx ON stock_movements(product_id);
CREATE INDEX stock_movements_source_location_id_idx ON stock_movements(source_location_id);
CREATE INDEX stock_movements_destination_location_id_idx ON stock_movements(destination_location_id);
CREATE INDEX stock_movements_movement_type_idx ON stock_movements(movement_type);
CREATE INDEX low_stock_alerts_product_id_idx ON low_stock_alerts(product_id);
CREATE INDEX low_stock_alerts_is_resolved_idx ON low_stock_alerts(is_resolved);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

CREATE TRIGGER stock_locations_updated_at
    BEFORE UPDATE ON stock_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

CREATE TRIGGER inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

CREATE TRIGGER low_stock_alerts_updated_at
    BEFORE UPDATE ON low_stock_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE low_stock_alerts ENABLE ROW LEVEL SECURITY;

-- Basic policies for viewing inventory data (can be refined based on team/role permissions)
CREATE POLICY "Users can view all products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Users can view all stock locations"
    ON stock_locations FOR SELECT
    USING (true);

CREATE POLICY "Users can view all inventory items"
    ON inventory_items FOR SELECT
    USING (true);

CREATE POLICY "Users can view all stock movements"
    ON stock_movements FOR SELECT
    USING (true);

CREATE POLICY "Users can view all low stock alerts"
    ON low_stock_alerts FOR SELECT
    USING (true);

-- More restrictive policies for modifications (example - can be adjusted)
CREATE POLICY "Only authenticated users can modify products"
    ON products FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can modify stock locations"
    ON stock_locations FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can modify inventory items"
    ON inventory_items FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can modify stock movements"
    ON stock_movements FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can modify low stock alerts"
    ON low_stock_alerts FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');