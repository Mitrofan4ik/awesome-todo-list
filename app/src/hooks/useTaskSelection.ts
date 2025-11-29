import { useCallback } from "react";

interface UseTaskSelectionProps {
  tasks: any[];
  selectedTaskIds: string[];
  updateState: (updater: (prev: any) => any) => void;
}

export const useTaskSelection = ({
  tasks,
  selectedTaskIds,
  updateState,
}: UseTaskSelectionProps) => {
  const toggleTaskSelection = useCallback(
    (taskId: string) => {
      updateState((prev: any) => ({
        ...prev,
        selectedTaskIds: prev.selectedTaskIds.includes(taskId)
          ? prev.selectedTaskIds.filter((id: string) => id !== taskId)
          : [...prev.selectedTaskIds, taskId],
      }));
    },
    [updateState]
  );

  const selectAllTasksInColumn = useCallback(
    (columnId: string) => {
      updateState((prev: any) => {
        const columnTaskIds = prev.tasks
          .filter((task: any) => task.columnId === columnId)
          .map((task: any) => task.id);

        const allSelected = columnTaskIds.every((id: string) =>
          prev.selectedTaskIds.includes(id)
        );

        if (allSelected) {
          return {
            ...prev,
            selectedTaskIds: prev.selectedTaskIds.filter(
              (id: string) => !columnTaskIds.includes(id)
            ),
          };
        } else {
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
    },
    [updateState]
  );

  const clearTaskSelection = useCallback(() => {
    updateState((prev: any) => ({
      ...prev,
      selectedTaskIds: [],
    }));
  }, [updateState]);

  return {
    toggleTaskSelection,
    selectAllTasksInColumn,
    clearTaskSelection,
  };
};
