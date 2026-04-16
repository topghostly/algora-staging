"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface TutorRow {
  id: string;
  name: string | null;
  email: string;
  specialties: string[];
  tutorStatus: string | null;
  calendarConnected: boolean;
  resumeLink: string | null;
  createdAt: Date;
  disabled: boolean;
}

interface TutorTableProps {
  tutors: TutorRow[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#fef9c3", text: "#a16207" },
  APPROVED: { bg: "#dcfce7", text: "#15803d" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626" },
};

function StatusBadge({ status }: { status: string | null }) {
  const colors = STATUS_COLORS[status ?? ""] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
  };
  return (
    <span
      style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 500,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {status ?? "—"}
    </span>
  );
}

export default function TutorTable({ tutors }: TutorTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = React.useMemo(() => {
    if (statusFilter === "ALL") return tutors;
    return tutors.filter((t) => t.tutorStatus === statusFilter);
  }, [tutors, statusFilter]);

  const columns: ColumnDef<TutorRow>[] = [
    {
      accessorKey: "name",
      header: "Tutor",
      cell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 500 }}>
            {row.original.name || "No Name"}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "specialties",
      header: "Specialties",
      cell: ({ row }) => (
        <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          {row.original.specialties.slice(0, 2).join(", ") || "—"}
          {row.original.specialties.length > 2 && (
            <span> +{row.original.specialties.length - 2} more</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "tutorStatus",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.tutorStatus} />,
      sortingFn: (a, b) => {
        const order = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
        return (
          (order[a.original.tutorStatus as keyof typeof order] ?? 3) -
          (order[b.original.tutorStatus as keyof typeof order] ?? 3)
        );
      },
    },
    {
      accessorKey: "calendarConnected",
      header: "Calendar",
      cell: ({ row }) => (
        <span
          style={{
            fontSize: "0.8rem",
            color: row.original.calendarConnected ? "#15803d" : "var(--muted)",
          }}
        >
          {row.original.calendarConnected ? "Connected" : "Not connected"}
        </span>
      ),
    },
    {
      accessorKey: "resumeLink",
      header: "Resume",
      cell: ({ row }) =>
        row.original.resumeLink ? (
          <a
            href={row.original.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.85rem", color: "var(--primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            View PDF
          </a>
        ) : (
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>—</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ row }) => (
        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      sorting: [{ id: "tutorStatus", desc: false }],
    },
  });

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 500,
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              borderColor:
                statusFilter === s ? "var(--primary)" : "var(--border)",
              backgroundColor:
                statusFilter === s ? "var(--primary)" : "transparent",
              color:
                statusFilter === s
                  ? "var(--primary-foreground)"
                  : "var(--muted)",
            }}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table
          style={{
            minWidth: "900px",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--muted-light)",
                textAlign: "left",
              }}
            >
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: "1rem",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <span
                          style={{
                            color: "var(--muted)",
                            display: "inline-flex",
                          }}
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp size={14} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                )),
              )}
            </tr>
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
                  No tutors found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() =>
                    router.push(`/admin/tutors/${row.original.id}`)
                  }
                  style={{
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    opacity: row.original.disabled ? 0.5 : 1,
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "var(--muted-light)")
                  }
                  onMouseLeave={(e) =>
                    ((
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "transparent")
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: "1rem" }}>
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
    </div>
  );
}
