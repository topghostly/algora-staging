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

export type ActivityRow = {
  id: string;
  action: string;
  userName: string | null;
  userEmail: string | null;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

function formatAction(action: string) {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getActionStyle(action: string): { bg: string; color: string } {
  if (action.startsWith("USER_"))
    return { bg: "rgba(59,130,246,0.1)", color: "#1d4ed8" };
  if (action.startsWith("SESSION_"))
    return { bg: "rgba(20,184,166,0.1)", color: "#0f766e" };
  if (action.startsWith("TRACK_"))
    return { bg: "rgba(147,51,234,0.1)", color: "#7e22ce" };
  if (action.startsWith("LESSON_"))
    return { bg: "rgba(249,115,22,0.1)", color: "#c2410c" };
  if (action.startsWith("PROFILE_"))
    return { bg: "rgba(156,163,175,0.15)", color: "#4b5563" };
  if (action.startsWith("ROLE_"))
    return { bg: "rgba(99,102,241,0.1)", color: "#4338ca" };
  return { bg: "rgba(156,163,175,0.15)", color: "#6b7280" };
}

const columnHelper = createColumnHelper<ActivityRow>();

const columns = [
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
      const val = info.getValue();
      const { bg, color } = getActionStyle(val);
      return (
        <span
          style={{
            // backgroundColor: bg,
            color,
            padding: "0.2rem 0.6rem",
            // borderRadius: "99px",
            fontSize: "0.80rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
            fontFamily: "monospace",
          }}
        >
          {formatAction(val)}
        </span>
      );
    },
  }),

  columnHelper.accessor("userName", {
    header: "User",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            {row.userName ?? "System"}
          </span>
          {row.userEmail && (
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {row.userEmail}
            </span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor("entityType", {
    header: "Entity",
    cell: (info) => {
      const row = info.row.original;
      if (!row.entityType)
        return (
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>—</span>
        );
      return (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--muted)",
            }}
          >
            {row.entityType}
          </span>
          {row.entityId && (
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                fontFamily: "monospace",
              }}
            >
              {row.entityId.slice(0, 12)}…
            </span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor("metadata", {
    header: "Details",
    enableSorting: false,
    cell: (info) => {
      const meta = info.getValue();
      if (!meta || Object.keys(meta).length === 0) {
        return (
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>—</span>
        );
      }
      const preview = Object.entries(meta)
        .slice(0, 2)
        .map(
          ([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`,
        )
        .join(" · ");
      return (
        <span
          title={JSON.stringify(meta, null, 2)}
          style={{
            fontSize: "0.78rem",
            color: "var(--muted-foreground)",
            maxWidth: "220px",
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "default",
          }}
        >
          {preview}
        </span>
      );
    },
  }),

  columnHelper.accessor("createdAt", {
    header: "Time",
    cell: (info) => (
      <span
        style={{
          fontSize: "0.85rem",
          color: "var(--muted)",
          whiteSpace: "nowrap",
        }}
      >
        {info.getValue().toLocaleString()}
      </span>
    ),
  }),
];

export default function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
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
    <div className="grid w-full min-w-0  ">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="border-b border-border bg-(--muted-light)"
              >
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left font-medium text-muted whitespace-nowrap select-none"
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown size={13} className="opacity-40" />
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
                  className="py-12 text-center text-muted"
                >
                  No recent activity found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3.5 whitespace-nowrap">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-border text-sm text-muted">
          <span className="whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
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
