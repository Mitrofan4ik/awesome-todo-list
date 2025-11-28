import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Task as TaskType } from "../../types";
import "./Task.css";
import { CheckIcon, CircleIcon, XIcon, EditIcon } from "../Icons/Icons";

interface TaskProps {
  task: TaskType;
  index: number;
  isSelected: boolean;
  onToggleComplete: (taskId: string) => void;
  onToggleSelect: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdateTitle: (taskId: string, title: string) => void;
}

export const Task = ({
  task,
  index,
  isSelected,
  onToggleComplete,
  onToggleSelect,
  onDelete,
  onUpdateTitle,
}: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

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
        canDrag: () => !isEditing,
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
  }, [task.id, task.columnId, index, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleTaskClick = () => {
    if (!isEditing) {
      onToggleSelect(task.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(task.title);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== task.title) {
      onUpdateTitle(task.id, trimmedValue);
    } else if (!trimmedValue) {
      setEditValue(task.title);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={taskRef}
      className={`task ${isSelected ? "task-selected" : ""} ${
        isDragging ? "task-dragging" : ""
      } ${isDraggedOver ? "task-drag-over" : ""} ${
        isEditing ? "task-editing" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation();
          onToggleSelect(task.id);
        }}
        className="task-checkbox"
        disabled={isEditing}
      />
      <div className="task-content" onClick={handleTaskClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={handleInputChange}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            className="form-control mb-0"
            maxLength={200}
          />
        ) : (
          <span
            className={`task-text ${task.completed ? "task-completed" : ""}`}
          >
            {task.title}
          </span>
        )}
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
      <div className="task-actions">
        <button
          onClick={handleEditClick}
          className="task-edit-btn"
          disabled={isEditing}
        >
          <EditIcon size={14} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="task-delete-btn"
          disabled={isEditing}
        >
          <XIcon size={14} />
        </button>
      </div>
    </div>
  );
};
