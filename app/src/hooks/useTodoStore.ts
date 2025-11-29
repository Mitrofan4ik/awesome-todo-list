import { useState, useEffect, useCallback } from "react";
import { TodoState } from "../types";
import { loadState, saveState } from "../utils/storage";
import defaultData from "../data/defaultData.json";
import { useColumns } from "./useColumns";
import { useTasks } from "./useTasks";
import { useTaskSelection } from "./useTaskSelection";
import { useTaskBulkOperations } from "./useTaskBulkOperations";

/**
 * Initializes application state
 * First checks localStorage for saved data, if none exists - uses defaultData.json
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
 * Custom hook for managing Todo application state
 * Automatically synchronizes state with localStorage
 */
export const useTodoStore = () => {
  const [state, setState] = useState<TodoState>(getInitialState);

  // Sync state to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

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


  // ========== Search ==========

  /**
   * Sets search query
   * @param query - search query string
   */
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
