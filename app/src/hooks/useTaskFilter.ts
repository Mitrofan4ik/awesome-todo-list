import { useState, useCallback } from "react";

type FilterStatus = "all" | "completed" | "incomplete";

interface UseTaskFilterReturn {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}

/**
 * Custom hook for managing task filter state
 */
export const useTaskFilter = (
  initialFilter: FilterStatus = "all"
): UseTaskFilterReturn => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(initialFilter);

  const handleSetFilterStatus = useCallback((status: FilterStatus) => {
    setFilterStatus(status);
  }, []);

  return {
    filterStatus,
    setFilterStatus: handleSetFilterStatus,
  };
};
