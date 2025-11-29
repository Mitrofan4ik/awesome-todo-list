import { useState, useEffect, useCallback } from "react";
import { TodoState } from "../types";
import { loadState, saveState } from "../utils/storage";
import defaultData from "../data/defaultData.json";
import { useColumns } from "./useColumns";
import { useTasks } from "./useTasks";

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

  // ========== Task Selection ==========

  /**
   * Toggles task selection
   * @param taskId - ID of the task
   */
  const toggleTaskSelection = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      selectedTaskIds: prev.selectedTaskIds.includes(taskId)
        ? prev.selectedTaskIds.filter((id) => id !== taskId)
        : [...prev.selectedTaskIds, taskId],
    }));
  }, []);

  /**
   * Selects all tasks in a column
   * @param columnId - ID of the column
   */
  const selectAllTasksInColumn = useCallback((columnId: string) => {
    setState((prev) => {
      const columnTaskIds = prev.tasks
        .filter((task) => task.columnId === columnId)
        .map((task) => task.id);

      const allSelected = columnTaskIds.every((id) =>
        prev.selectedTaskIds.includes(id)
      );

      if (allSelected) {
        // Deselect all in this column
        return {
          ...prev,
          selectedTaskIds: prev.selectedTaskIds.filter(
            (id) => !columnTaskIds.includes(id)
          ),
        };
      } else {
        // Select all in this column
        const newSelected = new Set([
          ...prev.selectedTaskIds,
          ...columnTaskIds,
        ]);
        return {
          ...prev,
          selectedTaskIds: Array.from(newSelected),
        };
      }
    });
  }, []);

  /**
   * Clears all task selections
   */
  const clearTaskSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedTaskIds: [],
    }));
  }, []);

  // ========== Bulk Task Operations ==========

  /**
   * Deletes all selected tasks
   */
  const deleteSelectedTasks = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter(
        (task) => !prev.selectedTaskIds.includes(task.id)
      ),
      selectedTaskIds: [],
    }));
  }, []);

  /**
   * Marks all selected tasks as complete
   */
  const markSelectedAsComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        prev.selectedTaskIds.includes(task.id)
          ? { ...task, completed: true }
          : task
      ),
      selectedTaskIds: [],
    }));
  }, []);

  /**
   * Marks all selected tasks as incomplete
   */
  const markSelectedAsIncomplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        prev.selectedTaskIds.includes(task.id)
          ? { ...task, completed: false }
          : task
      ),
      selectedTaskIds: [],
    }));
  }, []);

  /**
   * Moves all selected tasks to a different column
   * @param targetColumnId - ID of the target column
   */
  const moveSelectedTasksToColumn = useCallback((targetColumnId: string) => {
    setState((prev) => {
      const selectedTasks = prev.tasks.filter((task) =>
        prev.selectedTaskIds.includes(task.id)
      );
      const targetColumnTasks = prev.tasks.filter(
        (task) =>
          task.columnId === targetColumnId &&
          !prev.selectedTaskIds.includes(task.id)
      );
      const maxOrder = targetColumnTasks.length;

      return {
        ...prev,
        tasks: prev.tasks.map((task, idx) => {
          if (prev.selectedTaskIds.includes(task.id)) {
            return {
              ...task,
              columnId: targetColumnId,
              order: maxOrder + idx,
            };
          }
          return task;
        }),
        selectedTaskIds: [],
      };
    });
  }, []);

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

    ...columns,
    ...tasks,

    // Task Selection
    toggleTaskSelection,
    selectAllTasksInColumn,
    clearTaskSelection,

    // Bulk Operations
    deleteSelectedTasks,
    markSelectedAsComplete,
    markSelectedAsIncomplete,
    moveSelectedTasksToColumn,

    // Search
    setSearchQuery,
  };
};
