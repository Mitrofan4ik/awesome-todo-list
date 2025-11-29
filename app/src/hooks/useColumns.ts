import { useCallback } from "react";
import { Column } from "../types";

interface UseColumnsProps {
  columns: Column[];
  tasks: any[];
  updateState: (updater: (prev: any) => any) => void;
}

export const useColumns = ({
  columns,
  tasks,
  updateState,
}: UseColumnsProps) => {
  const addColumn = useCallback(
    (title: string) => {
      const newColumn: Column = {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        order: columns.length,
      };

      updateState((prev: any) => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }));
    },
    [columns.length, updateState]
  );

  const deleteColumn = useCallback(
    (columnId: string) => {
      updateState((prev: any) => ({
        ...prev,
        columns: prev.columns.filter((col: Column) => col.id !== columnId),
        tasks: prev.tasks.filter((task: any) => task.columnId !== columnId),
        selectedTaskIds: prev.selectedTaskIds.filter(
          (id: string) =>
            !prev.tasks.find((t: any) => t.id === id && t.columnId === columnId)
        ),
      }));
    },
    [updateState]
  );

  const updateColumns = useCallback(
    (columns: Column[]) => {
      updateState((prev: any) => ({
        ...prev,
        columns,
      }));
    },
    [updateState]
  );

  return {
    addColumn,
    deleteColumn,
    updateColumns,
  };
};
