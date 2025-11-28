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

  // ========== Columns ==========

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
      selectedTaskIds: prev.selectedTaskIds.filter(
        (id) => !prev.tasks.find((t) => t.id === id && t.columnId === columnId)
      ),
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

  // ========== Tasks ==========

  /**
   * Adds a new task to a column
   * @param title - task title
   * @param columnId - ID of the column
   */
  const addTask = useCallback(
    (title: string, columnId: string) => {
      const columnTasks = state.tasks.filter((t) => t.columnId === columnId);
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        completed: false,
        columnId,
        order: columnTasks.length,
        createdAt: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
    },
    [state.tasks]
  );

  /**
   * Deletes a task
   * @param taskId - ID of the task to delete
   */
  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
      selectedTaskIds: prev.selectedTaskIds.filter((id) => id !== taskId),
    }));
  }, []);

  /**
   * Toggles task completion status
   * @param taskId - ID of the task
   */
  const toggleTaskComplete = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  }, []);

  /**
   * Updates task title
   * @param taskId - ID of the task
   * @param title - new title
   */
  const updateTaskTitle = useCallback((taskId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, title } : task
      ),
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

    // Columns
    addColumn,
    deleteColumn,
    updateColumns,

    // Tasks
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTasks,
    updateTaskTitle,

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
