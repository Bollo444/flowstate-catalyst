import React, { ReactNode, createContext } from "react";

// Create mock contexts directly here instead of importing
const MockTaskRoutingContext = createContext(null);
const MockFlowContext = createContext(null);

// Create mock context providers for testing
export const MockTaskRoutingProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: any;
}) => {
  return (
    <MockTaskRoutingContext.Provider value={value}>
      {children}
    </MockTaskRoutingContext.Provider>
  );
};

export const MockFlowContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: any;
}) => {
  return (
    <MockFlowContext.Provider value={value}>
      {children}
    </MockFlowContext.Provider>
  );
};

// Combined provider for convenience
export const MockProvidersWrapper = ({
  children,
  taskRoutingValue,
  flowContextValue,
}: {
  children: ReactNode;
  taskRoutingValue: any;
  flowContextValue: any;
}) => {
  return (
    <MockFlowContextProvider value={flowContextValue}>
      <MockTaskRoutingProvider value={taskRoutingValue}>
        {children}
      </MockTaskRoutingProvider>
    </MockFlowContextProvider>
  );
};
