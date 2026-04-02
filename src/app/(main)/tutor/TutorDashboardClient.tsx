"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ExternalLink,
  Layers,
} from "lucide-react";
import ConnectCalendarButton from "@/components/ConnectCalendarButton";
import DisconnectCalendarButton from "@/components/DisconnectCalendarButton";
import { Button } from "@/components/ui/button";

type SessionStatus = "PENDING" | "COMPLETED" | "CANCELLED";
type SessionType = "GROUP" | "ONE_ON_ONE";

interface TutorSession {
  id: string;
  title: string;
  type: SessionType;
  status: SessionStatus;
  startTime: string;
  endTime: string;
  meetingLink: string | null;
  _count: { bookings: number };
}

const statusStyles: Record<
  SessionStatus,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "rgba(234,179,8,0.1)", color: "#92400e", label: "Pending" },
  COMPLETED: {
    bg: "rgba(34,197,94,0.1)",
    color: "#166534",
    label: "Completed",
  },
  CANCELLED: {
    bg: "rgba(239,68,68,0.1)",
    color: "#991b1b",
    label: "Cancelled",
  },
};

const typeLabel: Record<SessionType, string> = {
  GROUP: "Group",
  ONE_ON_ONE: "1-on-1",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const duration = (start: string, end: string) => {
  const mins = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
};

const columnHelper = createColumnHelper<TutorSession>();

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => typeLabel[info.getValue()],
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const s = statusStyles[info.getValue()];
      return (
        <span
          style={{
            backgroundColor: s.bg,
            color: s.color,
            padding: "0.2rem 0.6rem",
            borderRadius: "99px",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          {s.label}
        </span>
      );
    },
  }),
  columnHelper.accessor("startTime", {
    header: "Start",
    cell: (info) => fmt(info.getValue()),
  }),
  columnHelper.display({
    id: "duration",
    header: "Duration",
    cell: (info) =>
      duration(info.row.original.startTime, info.row.original.endTime),
  }),
  columnHelper.accessor((row) => row._count.bookings, {
    id: "bookings",
    header: "Bookings",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("meetingLink", {
    header: "Link",
    enableSorting: false,
    cell: (info) =>
      info.getValue() ? (
        <a
          href={info.getValue()!}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--primary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.85rem",
          }}
          className="btn btn-outline rounded-md"
        >
          Join <ExternalLink size={12} />
        </a>
      ) : (
        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>—</span>
      ),
  }),
];

const Stats = ({ value, name }: { value: string; name: string }) => {
  return (
    <div className="flex gap-2 items-end">
      <p className="text-7xl text-input p-0">{value}</p>
      <p className="pb-2 text-[#004d40] font-medium tracking-tighter text-sm">
        {name}
      </p>
    </div>
  );
};

export default function TutorDashboardClient({
  initialSessions,
  user,
}: {
  initialSessions: TutorSession[];
  user: any;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startTime", desc: true },
  ]);

  const table = useReactTable({
    data: initialSessions,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-col gap-10">
      <p className="text-muted mb-0 md:mb-6">Tutor Dashboard </p>
      <div className="flex gap-2 flex-col md:flex-row md:justify-between justify-start items-start md:items-end">
        <h1
          style={{
            marginBottom: "0.5rem",
          }}
          className="font-light"
        >
          Hello, <br />{" "}
          <span className="font-medium">{user.name}!</span>
        </h1>
        <div className="flex gap-2">
          {user.calendarConnected ? (
            <DisconnectCalendarButton />
          ) : (
            <ConnectCalendarButton email={user.email!} />
          )}
          <Link href={"tutor/sessions"}>
            <Button variant={"outline"} className="flex items-center gap-2">
              Manage Session
              <Layers size={16} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 justify-between bg-primary p-10 rounded-3xl">
        <Stats value="0" name="Upcoming Sessions" />

        <Stats value="0" name="Total Students" />

        <Stats value="0h:0m" name="Hours Taught" />
      </div>

      {/* Sessions Table */}
      <div className="mt-10">
        <h3 className="mb-4">Your Sessions</h3>
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            boxShadow: "none",
            border: "none",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "1rem 0.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Search sessions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9 px-3 bg-background rounded-lg text-sm border-2 border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ width: 260 }}
            />
          </div>

          {/* Table */}
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
                        padding: "2rem 0rem",
                        textAlign: "center",
                        color: "var(--muted)",
                      }}
                    >
                      {globalFilter
                        ? "No sessions match your search."
                        : "No sessions yet."}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.15s",
                      }}
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

          {/* Pagination */}
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
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="btn btn-outline"
                  style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="btn btn-outline"
                  style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
