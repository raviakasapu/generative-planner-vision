import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (updates: { page?: number; pageSize?: number }) => void;
}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  page,
  pageSize,
  total,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Showing {start} to {end} of {total} entries
        </p>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onChange({ pageSize: Number(value), page: 0 })}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({ page: page - 1 })}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">
          Page {page + 1} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({ page: page + 1 })}
          disabled={page >= totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataTablePagination;