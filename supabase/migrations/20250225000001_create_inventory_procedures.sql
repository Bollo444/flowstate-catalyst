-- Create stored procedures for inventory management

-- Procedure to create a stock movement and update inventory levels
CREATE OR REPLACE FUNCTION create_stock_movement(
    p_product_id UUID,
    p_source_location_id UUID,
    p_destination_location_id UUID,
    p_quantity INTEGER,
    p_movement_type TEXT,
    p_reference_number TEXT,
    p_notes TEXT,
    p_performed_by UUID
) RETURNS JSONB AS $$
DECLARE
    v_movement_id UUID;
    v_source_inventory_id UUID;
    v_destination_inventory_id UUID;
    v_current_source_quantity INTEGER;
    v_current_destination_quantity INTEGER;
    v_source_updated BOOLEAN := FALSE;
    v_destination_updated BOOLEAN := FALSE;
    v_result JSONB;
BEGIN
    -- Validate inputs
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than zero';
    END IF;
    
    -- For 'purchase' type, only destination is required
    IF p_movement_type = 'purchase' AND p_destination_location_id IS NULL THEN
        RAISE EXCEPTION 'Destination location is required for purchase movements';
    END IF;
    
    -- For 'sale' type, only source is required
    IF p_movement_type = 'sale' AND p_source_location_id IS NULL THEN
        RAISE EXCEPTION 'Source location is required for sale movements';
    END IF;
    
    -- For 'transfer' type, both source and destination are required
    IF p_movement_type = 'transfer' AND (p_source_location_id IS NULL OR p_destination_location_id IS NULL) THEN
        RAISE EXCEPTION 'Both source and destination locations are required for transfer movements';
    END IF;
    
    -- Create the stock movement record
    INSERT INTO stock_movements (
        product_id,
        source_location_id,
        destination_location_id,
        quantity,
        movement_type,
        reference_number,
        notes,
        performed_by
    ) VALUES (
        p_product_id,
        p_source_location_id,
        p_destination_location_id,
        p_quantity,
        p_movement_type::stock_movement_type,
        p_reference_number,
        p_notes,
        p_performed_by
    ) RETURNING id INTO v_movement_id;
    
    -- Update source inventory if applicable (sale, transfer, adjustment)
    IF p_source_location_id IS NOT NULL AND p_movement_type IN ('sale', 'transfer', 'adjustment') THEN
        -- Check if inventory record exists
        SELECT id, quantity INTO v_source_inventory_id, v_current_source_quantity
        FROM inventory_items
        WHERE product_id = p_product_id AND location_id = p_source_location_id;
        
        IF v_source_inventory_id IS NULL THEN
            RAISE EXCEPTION 'No inventory record found for product % at source location %', p_product_id, p_source_location_id;
        END IF;
        
        -- Check if there's enough stock
        IF v_current_source_quantity < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock at source location. Available: %, Required: %', v_current_source_quantity, p_quantity;
        END IF;
        
        -- Update the inventory
        UPDATE inventory_items
        SET quantity = quantity - p_quantity
        WHERE id = v_source_inventory_id;
        
        v_source_updated := TRUE;
    END IF;
    
    -- Update destination inventory if applicable (purchase, transfer, adjustment)
    IF p_destination_location_id IS NOT NULL AND p_movement_type IN ('purchase', 'transfer', 'adjustment') THEN
        -- Check if inventory record exists
        SELECT id, quantity INTO v_destination_inventory_id, v_current_destination_quantity
        FROM inventory_items
        WHERE product_id = p_product_id AND location_id = p_destination_location_id;
        
        -- If no record exists, create one
        IF v_destination_inventory_id IS NULL THEN
            INSERT INTO inventory_items (product_id, location_id, quantity)
            VALUES (p_product_id, p_destination_location_id, p_quantity)
            RETURNING id INTO v_destination_inventory_id;
        ELSE
            -- Update existing record
            UPDATE inventory_items
            SET quantity = quantity + p_quantity
            WHERE id = v_destination_inventory_id;
        END IF;
        
        v_destination_updated := TRUE;
    END IF;
    
    -- For count movement type, just set the exact quantity
    IF p_movement_type = 'count' THEN
        IF p_destination_location_id IS NULL THEN
            RAISE EXCEPTION 'Destination location is required for count movements';
        END IF;
        
        -- Check if inventory record exists
        SELECT id INTO v_destination_inventory_id
        FROM inventory_items
        WHERE product_id = p_product_id AND location_id = p_destination_location_id;
        
        -- If no record exists, create one
        IF v_destination_inventory_id IS NULL THEN
            INSERT INTO inventory_items (product_id, location_id, quantity, last_counted_at)
            VALUES (p_product_id, p_destination_location_id, p_quantity, now())
            RETURNING id INTO v_destination_inventory_id;
        ELSE
            -- Update existing record
            UPDATE inventory_items
            SET quantity = p_quantity, last_counted_at = now()
            WHERE id = v_destination_inventory_id;
        END IF;
        
        v_destination_updated := TRUE;
    END IF;
    
    -- Prepare result
    v_result := jsonb_build_object(
        'movement_id', v_movement_id,
        'source_updated', v_source_updated,
        'destination_updated', v_destination_updated
    );
    
    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    -- Rollback is automatic in functions
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Function to generate low stock alerts
CREATE OR REPLACE FUNCTION generate_low_stock_alerts() RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_product RECORD;
    v_inventory RECORD;
    v_existing_alert RECORD;
BEGIN
    -- Loop through all inventory items
    FOR v_inventory IN (
        SELECT i.id, i.product_id, i.location_id, i.quantity, p.low_stock_threshold
        FROM inventory_items i
        JOIN products p ON i.product_id = p.id
        WHERE i.quantity <= p.low_stock_threshold
    ) LOOP
        -- Check if there's already an unresolved alert for this product/location
        SELECT id INTO v_existing_alert
        FROM low_stock_alerts
        WHERE product_id = v_inventory.product_id
          AND location_id = v_inventory.location_id
          AND is_resolved = FALSE;
        
        -- If no existing alert, create one
        IF v_existing_alert IS NULL THEN
            INSERT INTO low_stock_alerts (
                product_id,
                location_id,
                current_quantity,
                threshold,
                is_resolved
            ) VALUES (
                v_inventory.product_id,
                v_inventory.location_id,
                v_inventory.quantity,
                v_inventory.low_stock_threshold,
                FALSE
            );
            
            v_count := v_count + 1;
        END IF;
    END LOOP;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get inventory summary
CREATE OR REPLACE FUNCTION get_inventory_summary() RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    sku TEXT,
    category TEXT,
    total_quantity INTEGER,
    locations JSONB,
    low_stock BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.category::TEXT,
        COALESCE(SUM(i.quantity), 0)::INTEGER AS total_quantity,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'location_id', l.id,
                    'location_name', l.name,
                    'quantity', i.quantity
                )
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'::jsonb
        ) AS locations,
        CASE WHEN MIN(i.quantity) <= p.low_stock_threshold THEN TRUE ELSE FALSE END AS low_stock
    FROM 
        products p
    LEFT JOIN 
        inventory_items i ON p.id = i.product_id
    LEFT JOIN 
        stock_locations l ON i.location_id = l.id
    GROUP BY 
        p.id, p.name, p.sku, p.category
    ORDER BY 
        p.name;
    
END;
$$ LANGUAGE plpgsql;