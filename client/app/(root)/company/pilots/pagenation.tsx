import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  page: number;
  totalPage: number;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function DataTablePagination({
  page,
  totalPage,
  fetchNextPage,
  fetchPreviousPage,
  hasPreviousPage,
  hasNextPage,
}: DataTablePaginationProps) {    
  return (
    <div className="flex w-full items-center justify-between px-2 mt-5">
      <div className="flex w-full justify-between items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page 10</p>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of{" "}
          {totalPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={fetchPreviousPage}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={fetchNextPage}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
