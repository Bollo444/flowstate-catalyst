"use client";

import React, { useState } from "react";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import StockMovementForm from "@/components/inventory/StockMovementForm";
import { Plus } from "lucide-react";
// Removed unused ArrowLeft import

const InventoryPage: React.FC = () => {
  const [showMovementForm, setShowMovementForm] = useState<boolean>(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {!showMovementForm && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowMovementForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Stock Movement
          </button>
        </div>
      )}

      {showMovementForm ? (
        <div className="mb-8">
          <StockMovementForm
            onComplete={() => setShowMovementForm(false)}
            onCancel={() => setShowMovementForm(false)}
          />
        </div>
      ) : (
        <InventoryDashboard />
      )}
    </div>
  );
};

export default InventoryPage;
