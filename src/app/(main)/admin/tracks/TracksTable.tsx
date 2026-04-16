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
import Link from "next/link";
import { Eye, Edit } from "lucide-react";
import { TrackDeleteButton } from "@/components/admin/TrackDeleteButton";

export type TrackRow = {
  id: string;
  title: string;
  published: boolean;
  createdAt: Date;
  _count: {
    modules: number;
    enrollments: number;
  };
};

const columnHelper = createColumnHelper<TrackRow>();

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),

  columnHelper.accessor("published", {
    header: "Status",
    cell: (info) => {
      const published = info.getValue();
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: 500,
            backgroundColor: published ? "#dcfce7" : "#f3f4f6",
            color: published ? "#16a34a" : "#6b7280",
          }}
        >
          {published ? "Published" : "Draft"}
        </span>
      );
    },
  }),

  columnHelper.accessor((row) => row._count.modules, {
    id: "modules",
    header: "Modules",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row._count.enrollments, {
    id: "enrollments",
    header: "Students",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span
        style={{
          fontSize: "0.9rem",
          color: "var(--muted)",
          whiteSpace: "nowrap",
        }}
      >
        {new Date(info.getValue()).toLocaleDateString()}
      </span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: () => (
      <span style={{ display: "block", textAlign: "right" }}>Actions</span>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        <Link
          href={`/tracks/${row.original.id}`}
          target="_blank"
          className="btn btn-outline rounded-lg"
          style={{ padding: "0.6rem", height: "auto" }}
          title="View Public Page"
        >
          <Eye size={16} />
        </Link>
        <Link
          href={`/admin/tracks/${row.original.id}`}
          className="btn btn-outline rounded-lg"
          style={{ padding: "0.6rem", height: "auto" }}
          title="Edit Content"
        >
          <Edit size={16} />
        </Link>
        <TrackDeleteButton trackId={row.original.id} />
      </div>
    ),
  }),
];

export default function TracksTable({ tracks }: { tracks: TrackRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data: tracks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="grid w-full min-w-0">
      <div className="w-full overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          style={{ minWidth: "800px" }}
        >
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
                    className="px-4 py-3 text-left font-medium whitespace-nowrap select-none"
                    style={{
                      fontSize: "0.9rem",
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
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No tracks found. Create your first one!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-border text-sm text-muted">
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
