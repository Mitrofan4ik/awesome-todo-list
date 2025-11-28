import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Task as TaskType } from "../../types";
import "./Task.css";
import { CheckIcon, CircleIcon, XIcon } from "../Icons/Icons";

interface TaskProps {
  task: TaskType;
  index: number;
  isSelected: boolean;
  onToggleComplete: (taskId: string) => void;
  onToggleSelect: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const Task = ({
  task,
  index,
  isSelected,
  onToggleComplete,
  onToggleSelect,
  onDelete,
}: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = taskRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          type: "task",
          taskId: task.id,
          columnId: task.columnId,
          index,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({
          type: "task",
          taskId: task.id,
          columnId: task.columnId,
          index,
        }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        canDrop: ({ source }) => {
          return source.data.type === "task" && source.data.taskId !== task.id;
        },
      })
    );
  }, [task.id, task.columnId, index]);

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleTaskClick = () => {
    onToggleSelect(task.id);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <div
      ref={taskRef}
      className={`task ${isSelected ? "task-selected" : ""} ${
        isDragging ? "task-dragging" : ""
      } ${isDraggedOver ? "task-drag-over" : ""}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation();
          onToggleSelect(task.id);
        }}
        className="task-checkbox"
      />
      <div className="task-content" onClick={handleTaskClick}>
        <span className={`task-text ${task.completed ? "task-completed" : ""}`}>
          {task.title}
        </span>
        <button
          onClick={handleStatusClick}
          className={`task-status-badge ${
            task.completed ? "task-status-complete" : "task-status-incomplete"
          }`}
        >
          {task.completed ? (
            <>
              <CheckIcon size={10} />
              <span className="ml-2">Complete</span>
            </>
          ) : (
            <>
              <CircleIcon size={10} />
              <span className="ml-2">Incomplete</span>
            </>
          )}
        </button>
      </div>
      <button
        onClick={handleDeleteClick}
        className="task-delete-btn"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
};
