"use client";
import { useMemo, useSyncExternalStore } from "react";
import { designs, type DesignSlug } from "./catalog";
const KEY = "rody-lody-design-review-v1";
const EVENT = "rody-lody-review-updated";
let memory = "";
let volatile = false;
function snapshot() {
  if (volatile) return memory;
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return memory;
  }
}
function subscribe(notify: () => void) {
  const storage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) notify();
  };
  window.addEventListener("storage", storage);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener(EVENT, notify);
  };
}
export function useReviewStore() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const value = useMemo(() => {
    try {
      const stored: unknown = JSON.parse(raw);
      if (
        stored &&
        typeof stored === "object" &&
        "favorites" in stored &&
        "notes" in stored
      ) {
        return {
          favorites: Array.isArray(stored.favorites)
            ? [
                ...new Set(
                  stored.favorites.filter((s: unknown): s is DesignSlug =>
                    designs.some((d) => d.slug === s),
                  ),
                ),
              ]
            : [],
          notes:
            typeof stored.notes === "string" ? stored.notes.slice(0, 3000) : "",
        };
      }
    } catch {
      /* Ignore damaged or outdated browser data. */
    }
    return { favorites: [] as DesignSlug[], notes: "" };
  }, [raw]);
  function update(next: { favorites: DesignSlug[]; notes: string }) {
    memory = JSON.stringify(next);
    try {
      localStorage.setItem(KEY, memory);
      volatile = false;
    } catch {
      volatile = true;
    }
    window.dispatchEvent(new Event(EVENT));
  }
  return { ...value, update };
}
