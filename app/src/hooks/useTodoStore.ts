import { useState, useEffect, useCallback } from "react";
import { TodoState } from "../types";
import { loadState, saveState } from "../utils/storage";
import defaultData from "../data/defaultData.json";
import { useColumns } from "./useColumns";
import { useTasks } from "./useTasks";
import { useTaskSelection } from "./useTaskSelection";
import { useTaskBulkOperations } from "./useTaskBulkOperations";

/**
 * Initialize state from localStorage or default data
 */
const getInitialState = (): TodoState => {
  const savedState = loadState();

  if (savedState) {
    return savedState;
  }

  return {
    columns: defaultData.columns,
    tasks: defaultData.tasks,
    selectedTaskIds: [],
    searchQuery: "",
  };
};

/**
 * Main application state management hook
 * Composes specialized hooks for columns, tasks, selection, and bulk operations
 * Automatically syncs state to localStorage
 */
export const useTodoStore = () => {
  const [state, setState] = useState<TodoState>(getInitialState);

  // Auto-save to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Compose specialized hooks
  const columns = useColumns({
    columns: state.columns,
    tasks: state.tasks,
    updateState: setState,
  });

  const tasks = useTasks({
    tasks: state.tasks,
    updateState: setState,
  });

  const taskSelection = useTaskSelection({
    tasks: state.tasks,
    selectedTaskIds: state.selectedTaskIds,
    updateState: setState,
  });

  const bulkOperations = useTaskBulkOperations({
    updateState: setState,
  });

  // Search query management
  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  return {
    state,
    setSearchQuery,
    ...columns,
    ...tasks,
    ...taskSelection,
    ...bulkOperations,
  };
};
