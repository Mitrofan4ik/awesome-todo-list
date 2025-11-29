import { useMemo } from "react";
import { Task } from "../types";

interface UseTaskSearchProps {
  tasks: Task[];
  searchQuery?: string;
  filterStatus?: "all" | "completed" | "incomplete";
}

interface UseTaskSearchReturn {
  filteredTasks: Task[];
  hasResults: boolean;
  totalResults: number;
}

/**
 * Custom hook for task search and filter functionality
 * Filters tasks based on search query and completion status
 */
export const useTaskSearch = ({
  tasks,
  searchQuery = "",
  filterStatus = "all",
}: UseTaskSearchProps): UseTaskSearchReturn => {
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filterStatus === "completed") {
      result = result.filter((task) => task.completed);
    } else if (filterStatus === "incomplete") {
      result = result.filter((task) => !task.completed);
    }

    // Filter by search query
    if (
      searchQuery &&
      typeof searchQuery === "string" &&
      searchQuery.trim() !== ""
    ) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, searchQuery, filterStatus]);

  const hasResults = filteredTasks.length > 0;
  const totalResults = filteredTasks.length;

  return {
    filteredTasks,
    hasResults,
    totalResults,
  };
};
