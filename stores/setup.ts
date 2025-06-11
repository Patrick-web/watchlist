import { setupValtio } from "../valitio.store";
import { setupAppMemoryStore } from "./app-memory.store";
import { setupSettingsStore } from "./settings.store";

let unsubscribeFunctions: (() => void)[] = [];

export function setupAllStores() {
  // Clear any existing subscriptions
  cleanup();

  // Setup all stores and collect their unsubscribe functions
  const unsubscribeValtio = setupValtio();
  const unsubscribeAppMemory = setupAppMemoryStore();
  const unsubscribeSettings = setupSettingsStore();

  unsubscribeFunctions = [
    unsubscribeValtio,
    unsubscribeAppMemory,
    unsubscribeSettings,
  ];

  console.log("All Valtio stores have been initialized");
}

export function cleanup() {
  unsubscribeFunctions.forEach((unsubscribe) => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  });
  unsubscribeFunctions = [];
}

// Auto-setup on import (optional - you can remove this if you prefer manual setup)
setupAllStores();