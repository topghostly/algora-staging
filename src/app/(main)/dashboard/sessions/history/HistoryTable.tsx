"use client";

import { ArrowUpDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type HistoryRow = {
  id: string;
  kind: "Group Session" | "1-on-1 Session";
  title: string;
  tutor: string;
  displayDate: string;
  sortDate: Date;
  status: string;
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "rgba(234,179,8,0.1)", color: "#92400e" },
  ACCEPTED: { bg: "rgba(34,197,94,0.1)", color: "#166534" },
  COMPLETED: { bg: "rgba(34,197,94,0.1)", color: "#166534" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", color: "#991b1b" },
  CANCELLED: { bg: "rgba(239,68,68,0.1)", color: "#991b1b" },
  EXPIRED: { bg: "rgba(156,163,175,0.2)", color: "#6b7280" },
};

const kindStyles: Record<string, { bg: string; color: string }> = {
  "Group Session": { bg: "rgba(147,51,234,0.1)", color: "#7e22ce" },
  "1-on-1 Session": { bg: "rgba(59,130,246,0.1)", color: "#1d4ed8" },
};

const columnHelper = createColumnHelper<HistoryRow>();

const columns = [
  columnHelper.accessor("kind", {
    header: "Type",
    cell: (info) => {
      const val = info.getValue();
      const style = kindStyles[val] ?? {
        bg: "var(--muted-light)",
        color: "var(--muted)",
      };
      return (
        <span
          style={{
            backgroundColor: style.bg,
            color: style.color,
            padding: "0.2rem 0.6rem",
            borderRadius: "99px",
            fontSize: "0.75rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {val}
        </span>
      );
    },
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor("tutor", {
    header: "Tutor",
    cell: (info) => (
      <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("sortDate", {
    header: "Date",
    cell: (info) => {
      const row = info.row.original;
      return (
        <span style={{ fontSize: "0.875rem", whiteSpace: "nowrap" }}>
          {row.displayDate}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const val = info.getValue();
      const style = statusStyles[val] ?? {
        bg: "var(--muted-light)",
        color: "var(--muted)",
      };
      return (
        <span
          style={{
            backgroundColor: style.bg,
            color: style.color,
            padding: "0.2rem 0.6rem",
            borderRadius: "99px",
            fontSize: "0.78rem",
            fontWeight: 500,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {val.charAt(0) + val.slice(1).toLowerCase()}
        </span>
      );
    },
  }),
];

export default function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sortDate", desc: true },
  ]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--muted-light)",
                }}
              >
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: "0.75rem 1.5rem",
                      textAlign: "left",
                      fontWeight: 500,
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown size={13} style={{ opacity: 0.4 }} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "3rem 0",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No session history found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: "0.875rem 1.5rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div
          style={{
            padding: "0.875rem 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.85rem",
            color: "var(--muted)",
          }}
        >
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
