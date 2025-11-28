import { useMemo } from "react";
import { Task } from "../types";

interface UseTaskSearchProps {
  tasks: Task[];
  searchQuery?: string;
}

interface UseTaskSearchReturn {
  filteredTasks: Task[];
  hasResults: boolean;
  totalResults: number;
}

/**
 * Custom hook for task search functionality
 * Filters tasks based on search query
 */
export const useTaskSearch = ({
  tasks,
  searchQuery = "",
}: UseTaskSearchProps): UseTaskSearchReturn => {
  const filteredTasks = useMemo(() => {
    if (
      !searchQuery ||
      typeof searchQuery !== "string" ||
      searchQuery.trim() === ""
    ) {
      return tasks;
    }

    const query = searchQuery.toLowerCase().trim();
    return tasks.filter((task) => task.title.toLowerCase().includes(query));
  }, [tasks, searchQuery]);

  const hasResults = filteredTasks.length > 0;
  const totalResults = filteredTasks.length;

  return {
    filteredTasks,
    hasResults,
    totalResults,
  };
};
