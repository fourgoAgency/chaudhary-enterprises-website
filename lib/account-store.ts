"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingAddress } from "@/lib/order-schema";
import { safeJSONStorage } from "@/lib/safe-storage";

// Accounts saved ONLY in this browser. This is a convenience profile (prefill checkout, keep a
// wishlist and order history), not real authentication: anyone using this device and browser
// profile can read localStorage. Passwords are never stored, only a salted SHA-256 hash.

export type Account = {
  name: string;
  email: string;
  phone: string;
  address?: ShippingAddress;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type Profile = Omit<Account, "passwordHash" | "salt">;

const SESSION_KEY = "ce-session";

const keyOf = (email: string) => email.trim().toLowerCase();

function toHex(buffer: ArrayBuffer | Uint8Array) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

// ---- Session ("Remember me" keeps it in localStorage, otherwise only for this browser tab session) ----

function readSession(): string | null {
  for (const storage of ["sessionStorage", "localStorage"] as const) {
    try {
      const value = window[storage].getItem(SESSION_KEY);
      if (value) return value;
    } catch {
      // Storage blocked.
    }
  }
  return null;
}

function writeSession(email: string | null, remember = false) {
  for (const storage of ["sessionStorage", "localStorage"] as const) {
    try {
      window[storage].removeItem(SESSION_KEY);
      if (email && (storage === "localStorage") === remember) window[storage].setItem(SESSION_KEY, email);
    } catch {
      // Storage blocked: the session lasts until the page is closed.
    }
  }
}

type AccountState = {
  accounts: Record<string, Account>;
  /** Email (lowercase) of the signed-in account on this device, or null. */
  session: string | null;
  register: (input: { name: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (changes: Partial<Pick<Account, "name" | "phone" | "address">>) => void;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  /** Removes the signed-in account from this device and signs out. */
  deleteAccount: () => string | null;
};

export const useAccounts = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: {},
      session: typeof window === "undefined" ? null : readSession(),

      register: async ({ name, email, password }) => {
        const key = keyOf(email);
        if (get().accounts[key]) {
          return { ok: false, error: "An account with this email already exists on this device. Please log in." };
        }
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        const account: Account = {
          name: name.trim(),
          email: email.trim(),
          phone: "",
          passwordHash: await hashPassword(password, salt),
          salt,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ accounts: { ...s.accounts, [key]: account }, session: key }));
        writeSession(key, true);
        return { ok: true };
      },

      login: async (email, password, remember) => {
        const key = keyOf(email);
        const account = get().accounts[key];
        if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
          return { ok: false, error: "That email and password don't match an account saved on this device." };
        }
        set({ session: key });
        writeSession(key, remember);
        return { ok: true };
      },

      logout: () => {
        set({ session: null });
        writeSession(null);
      },

      updateProfile: (changes) =>
        set((s) => {
          const key = s.session;
          const account = key ? s.accounts[key] : undefined;
          if (!key || !account) return s;
          return { accounts: { ...s.accounts, [key]: { ...account, ...changes } } };
        }),

      changePassword: async (current, next) => {
        const { session, accounts } = get();
        const account = session ? accounts[session] : undefined;
        if (!session || !account) return { ok: false, error: "Please log in again." };
        if ((await hashPassword(current, account.salt)) !== account.passwordHash) {
          return { ok: false, error: "Your current password is incorrect." };
        }
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        const passwordHash = await hashPassword(next, salt);
        set((s) => ({ accounts: { ...s.accounts, [session]: { ...account, salt, passwordHash } } }));
        return { ok: true };
      },

      deleteAccount: () => {
        const key = get().session;
        if (!key) return null;
        set((s) => {
          const accounts = { ...s.accounts };
          delete accounts[key];
          return { accounts, session: null };
        });
        writeSession(null);
        return key;
      },
    }),
    {
      name: "ce-accounts",
      version: 1,
      storage: safeJSONStorage,
      // The session is stored separately (see writeSession) so "Remember me" can be honoured.
      partialize: (s) => ({ accounts: s.accounts }),
    },
  ),
);

/** The signed-in account's profile, or null. */
export function useCurrentAccount(): Profile | null {
  return useAccounts((s) => {
    const account = s.session ? s.accounts[s.session] : undefined;
    return account ?? null;
  });
}

/** Lowercase email of the signed-in account, or null. */
export const useSessionKey = () => useAccounts((s) => (s.session && s.accounts[s.session] ? s.session : null));
