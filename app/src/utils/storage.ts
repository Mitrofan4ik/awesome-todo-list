import { TodoState } from "../types";
import { STORAGE_KEYS } from "../constants/storage";

/**
 * Loads application state from localStorage
 * @returns TodoState object or null if not found
 */

export const loadState = (): TodoState | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.TODO_STATE);
    if (storedData === null) {
      return null;
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return null;
  }
};

/**
 * Saves application state to localStorage
 * @param state - TodoState object to save
 */

export const saveState = (state: TodoState): void => {
  try {
    const storedData = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS.TODO_STATE, storedData);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};
