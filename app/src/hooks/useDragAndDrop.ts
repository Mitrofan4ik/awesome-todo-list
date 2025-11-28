import { useEffect, useCallback } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column, Task } from "../types";

interface UseDragAndDropProps {
  columns: Column[];
  tasks: Task[];
  updateColumns: (columns: Column[]) => void;
  updateTasks: (tasks: Task[]) => void;
}

export const useDragAndDrop = ({
  columns,
  tasks,
  updateColumns,
  updateTasks,
}: UseDragAndDropProps) => {
  /**
   * Reorders columns after drag and drop
   * @param sourceIndex - original index
   * @param destinationIndex - new index
   */
  const reorderColumns = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      const newColumns = Array.from(columns);
      const [movedColumn] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, movedColumn);

      // Update order property
      const reorderedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      updateColumns(reorderedColumns);
    },
    [columns, updateColumns]
  );

  /**
   * Reorders tasks within the same column
   * @param columnId - ID of the column
   * @param sourceIndex - original index
   * @param destinationIndex - new index
   */
  const reorderTasksInColumn = useCallback(
    (columnId: string, sourceIndex: number, destinationIndex: number) => {
      const columnTasks = tasks.filter((t) => t.columnId === columnId);
      const otherTasks = tasks.filter((t) => t.columnId !== columnId);

      const reorderedTasks = Array.from(columnTasks);
      const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
      reorderedTasks.splice(destinationIndex, 0, movedTask);

      // Update order property
      const tasksWithUpdatedOrder = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      updateTasks([...otherTasks, ...tasksWithUpdatedOrder]);
    },
    [tasks, updateTasks]
  );

  /**
   * Moves task to a different column
   * @param taskId - ID of the task to move
   * @param sourceColumnId - ID of the source column
   * @param destinationColumnId - ID of the destination column
   * @param destinationIndex - index in destination column
   */
  const moveTaskToColumn = useCallback(
    (
      taskId: string,
      sourceColumnId: string,
      destinationColumnId: string,
      destinationIndex: number
    ) => {
      const movedTask = tasks.find((t) => t.id === taskId);
      if (!movedTask) return;

      const sourceTasks = tasks.filter(
        (t) => t.columnId === sourceColumnId && t.id !== taskId
      );
      const destinationTasks = Array.from(
        tasks.filter((t) => t.columnId === destinationColumnId)
      );
      const otherTasks = tasks.filter(
        (t) =>
          t.columnId !== sourceColumnId && t.columnId !== destinationColumnId
      );

      // Update moved task with new column
      const updatedTask = {
        ...movedTask,
        columnId: destinationColumnId,
      };

      // Insert into destination at specific index
      destinationTasks.splice(destinationIndex, 0, updatedTask);

      // Update order for source column tasks
      const sourceTasksWithOrder = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      // Update order for destination column tasks
      const destinationTasksWithOrder = destinationTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      updateTasks([
        ...otherTasks,
        ...sourceTasksWithOrder,
        ...destinationTasksWithOrder,
      ]);
    },
    [tasks, updateTasks]
  );

  /**
   * Setup pragmatic-drag-and-drop monitor
   * Listens for all drop events and handles them
   */
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceData = source.data;
        const destinationData = destination.data;

        // Handle column reordering
        if (sourceData.type === "column" && destinationData.type === "column") {
          const sourceIndex = sourceData.index;
          const destinationIndex = destinationData.index;

          if (
            typeof sourceIndex === "number" &&
            typeof destinationIndex === "number" &&
            sourceIndex !== destinationIndex
          ) {
            reorderColumns(sourceIndex, destinationIndex);
          }
        }

        // Handle task reordering within same column
        if (
          sourceData.type === "task" &&
          destinationData.type === "task" &&
          sourceData.columnId === destinationData.columnId
        ) {
          const sourceIndex = sourceData.index;
          const destinationIndex = destinationData.index;
          const columnId = sourceData.columnId;

          if (
            typeof sourceIndex === "number" &&
            typeof destinationIndex === "number" &&
            typeof columnId === "string" &&
            sourceIndex !== destinationIndex
          ) {
            reorderTasksInColumn(columnId, sourceIndex, destinationIndex);
          }
        }

        // Handle task moving between columns
        if (
          sourceData.type === "task" &&
          destinationData.type === "column" &&
          sourceData.columnId !== destinationData.columnId
        ) {
          const taskId = sourceData.taskId;
          const sourceColumnId = sourceData.columnId;
          const destinationColumnId = destinationData.columnId;
          const destinationIndex = destinationData.taskCount ?? 0;

          if (
            typeof taskId === "string" &&
            typeof sourceColumnId === "string" &&
            typeof destinationColumnId === "string" &&
            typeof destinationIndex === "number"
          ) {
            moveTaskToColumn(
              taskId,
              sourceColumnId,
              destinationColumnId,
              destinationIndex
            );
          }
        }
      },
    });
  }, [reorderColumns, reorderTasksInColumn, moveTaskToColumn]);

  return {
    reorderColumns,
    reorderTasksInColumn,
    moveTaskToColumn,
  };
};
