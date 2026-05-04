import React, { lazy } from "react";
import { retry } from "./retry";

// Helper to create a lazy component with retry and preload support
export const lazyLoad = (factory, { retries = 3, delay = 500 } = {}) => {
  let _import = () => retry(factory, retries, delay);
  const Component = lazy(() => _import());

  // attach preload for route prefetching
  Component.preload = () => _import();

  return Component;
};

export default lazyLoad;
