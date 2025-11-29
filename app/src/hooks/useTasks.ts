import { useCallback } from "react";
import { Task } from "../types";

interface UseTasksProps {
  tasks: Task[];
  updateState: (updater: (prev: any) => any) => void;
}

export const useTasks = ({ tasks, updateState }: UseTasksProps) => {

  const addTask = useCallback(
    (title: string, columnId: string) => {
      const columnTasks = tasks.filter((t) => t.columnId === columnId);
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        completed: false,
        columnId,
        order: columnTasks.length,
        createdAt: Date.now(),
      };

      updateState((prev: any) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
    },
    [tasks, updateState]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      updateState((prev: any) => ({
        ...prev,
        tasks: prev.tasks.filter((task: Task) => task.id !== taskId),
        selectedTaskIds: prev.selectedTaskIds.filter(
          (id: string) => id !== taskId
        ),
      }));
    },
    [updateState]
  );

  const toggleTaskComplete = useCallback(
    (taskId: string) => {
      updateState((prev: any) => ({
        ...prev,
        tasks: prev.tasks.map((task: Task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }));
    },
    [updateState]
  );

  const updateTaskTitle = useCallback(
    (taskId: string, title: string) => {
      updateState((prev: any) => ({
        ...prev,
        tasks: prev.tasks.map((task: Task) =>
          task.id === taskId ? { ...task, title } : task
        ),
      }));
    },
    [updateState]
  );

  const updateTasks = useCallback(
    (tasks: Task[]) => {
      updateState((prev: any) => ({
        ...prev,
        tasks,
      }));
    },
    [updateState]
  );

  return {
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskTitle,
    updateTasks,
  };
};
