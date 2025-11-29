import { useMemo } from "react";
import { Task } from "../types";
import { FILTER_STATUS } from "../constants/filter-status";

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
 * Filters tasks based on search query and completion status
 */
export const useTaskSearch = ({
  tasks,
  searchQuery = "",
  filterStatus = FILTER_STATUS.ALL,
}: UseTaskSearchProps): UseTaskSearchReturn => {
  const filteredTasks = useMemo(() => {
    let result = tasks;

    const isCompletedFilter = filterStatus === FILTER_STATUS.COMPLETED;
    const isIncompleteFilter = filterStatus === FILTER_STATUS.INCOMPLETE;

    if (isCompletedFilter) {
      result = result.filter((task) => task.completed);
    } else if (isIncompleteFilter) {
      result = result.filter((task) => !task.completed);
    }

    const hasSearchQuery =
      searchQuery &&
      typeof searchQuery === "string" &&
      searchQuery.trim() !== "";

    if (hasSearchQuery) {
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
