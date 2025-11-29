import { useCallback } from "react";

interface UseTaskBulkOperationsProps {
  updateState: (updater: (prev: any) => any) => void;
}

export const useTaskBulkOperations = ({
  updateState,
}: UseTaskBulkOperationsProps) => {
  const deleteSelectedTasks = useCallback(() => {
    updateState((prev: any) => ({
      ...prev,
      tasks: prev.tasks.filter(
        (task: any) => !prev.selectedTaskIds.includes(task.id)
      ),
      selectedTaskIds: [],
    }));
  }, [updateState]);

  const markSelectedAsComplete = useCallback(() => {
    updateState((prev: any) => ({
      ...prev,
      tasks: prev.tasks.map((task: any) =>
        prev.selectedTaskIds.includes(task.id)
          ? { ...task, completed: true }
          : task
      ),
      selectedTaskIds: [],
    }));
  }, [updateState]);

  const markSelectedAsIncomplete = useCallback(() => {
    updateState((prev: any) => ({
      ...prev,
      tasks: prev.tasks.map((task: any) =>
        prev.selectedTaskIds.includes(task.id)
          ? { ...task, completed: false }
          : task
      ),
      selectedTaskIds: [],
    }));
  }, [updateState]);

  const moveSelectedTasksToColumn = useCallback(
    (targetColumnId: string) => {
      updateState((prev: any) => {
        const targetColumnTasks = prev.tasks.filter(
          (task: any) =>
            task.columnId === targetColumnId &&
            !prev.selectedTaskIds.includes(task.id)
        );
        const maxOrder = targetColumnTasks.length;

        return {
          ...prev,
          tasks: prev.tasks.map((task: any, idx: number) => {
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
    },
    [updateState]
  );

  return {
    deleteSelectedTasks,
    markSelectedAsComplete,
    markSelectedAsIncomplete,
    moveSelectedTasksToColumn,
  };
};
