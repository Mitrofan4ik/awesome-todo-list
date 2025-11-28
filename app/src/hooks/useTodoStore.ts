import { useState, useEffect, useCallback } from "react";
import { TodoState, Column, Task } from "../types";
import { loadState, saveState } from "../utils/storage";
import defaultData from "../data/defaultData.json";

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

  /**
   * Adds a new column
   * @param title - column title
   */
  const addColumn = useCallback(
    (title: string) => {
      const newColumn: Column = {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        order: state.columns.length,
      };

      setState((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }));
    },
    [state.columns.length]
  );

  /**
   * Deletes a column and all its tasks
   * @param columnId - ID of the column to delete
   */
  const deleteColumn = useCallback((columnId: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
      tasks: prev.tasks.filter((task) => task.columnId !== columnId),
    }));
  }, []);

  /**
   * Updates columns array
   * @param columns - new columns array
   */
  const updateColumns = useCallback((columns: Column[]) => {
    setState((prev) => ({
      ...prev,
      columns,
    }));
  }, []);

  /**
   * Updates tasks array
   * @param tasks - new tasks array
   */
  const updateTasks = useCallback((tasks: Task[]) => {
    setState((prev) => ({
      ...prev,
      tasks,
    }));
  }, []);

  return {
    state,
    addColumn,
    deleteColumn,
    updateColumns,
    updateTasks,
  };
};
