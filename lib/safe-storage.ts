import { createJSONStorage, type StateStorage } from "zustand/middleware";

// localStorage can be missing or throw (private mode, blocked site data, quota exceeded).
// Every read and write goes through try/catch so the site still works with an empty store.

const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Storage full or blocked: keep the in-memory state for this visit.
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Ignore.
    }
  },
};

/** JSON storage for zustand's persist middleware that never throws. */
export const safeJSONStorage = createJSONStorage(() => safeLocalStorage);
