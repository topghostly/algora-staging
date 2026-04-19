"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface Transaction {
  id: string;
  reference: string;
  paystackTransactionId: string | null;
  amount: number;
  currency: string;
  status: string;
  planCode: string | null;
  channel: string | null;
  cardType: string | null;
  last4: string | null;
  bank: string | null;
  paidAt: Date | null;
  createdAt: Date;
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  success: { bg: "rgba(34,197,94,0.1)", color: "#166534" },
  failed: { bg: "rgba(239,68,68,0.1)", color: "#991b1b" },
  pending: { bg: "rgba(234,179,8,0.1)", color: "#92400e" },
  pending_verification: { bg: "rgba(234,179,8,0.1)", color: "#92400e" },
};

const channelLabels: Record<string, string> = {
  card: "Card",
  bank_transfer: "Bank Transfer",
  ussd: "USSD",
  mobile_money: "Mobile Money",
  qr: "QR",
  bank: "Bank",
};

const fmt = (date: Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function PaymentMethod({ row }: { row: Transaction }) {
  if (!row.channel) return <span style={{ color: "var(--muted)" }}>—</span>;

  if (row.channel === "card" && row.last4) {
    return (
      <span style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
        <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
          {row.cardType ?? "Card"} ••••{row.last4}
        </span>
        {row.bank && (
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            {row.bank}
          </span>
        )}
      </span>
    );
  }

  return (
    <span>
      {channelLabels[row.channel] ?? row.channel}
      {row.bank && (
        <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
          {row.bank}
        </span>
      )}
    </span>
  );
}

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor((row) => row.paidAt ?? row.createdAt, {
    id: "date",
    header: "Date",
    cell: (info) => fmt(info.getValue()),
  }),
  columnHelper.accessor("reference", {
    header: "Reference",
    enableSorting: false,
    cell: (info) => {
      const val = info.getValue();
      return (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "var(--muted)",
          }}
          title={val}
        >
          {val.length > 20 ? `${val.slice(0, 10)}…${val.slice(-6)}` : val}
        </span>
      );
    },
  }),
  columnHelper.accessor("planCode", {
    header: "Plan",
    enableSorting: false,
    cell: (info) =>
      info.getValue() ? (
        <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
          {info.getValue()}
        </span>
      ) : (
        <span style={{ color: "var(--muted)" }}>—</span>
      ),
  }),
  columnHelper.display({
    id: "paymentMethod",
    header: "Payment Method",
    enableSorting: false,
    cell: (info) => <PaymentMethod row={info.row.original} />,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => {
      const row = info.row.original;
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: row.currency,
        minimumFractionDigits: 2,
      }).format(info.getValue());
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const val = info.getValue().toLowerCase();
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
          {val.replace(/_/g, " ")}
        </span>
      );
    },
  }),
];

interface Props {
  transactions: Transaction[];
}

export default function SubscriptionHistory({ transactions }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium">Subscription History</h3>
      </div>

      <div style={{ padding: 0, overflow: "hidden", boxShadow: "none" }}>
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
                        cursor: header.column.getCanSort() ? "pointer" : "default",
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                      padding: "1.5rem 0",
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                  >
                    No transactions yet.
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
                        style={{ padding: "0.875rem 1.5rem", whiteSpace: "nowrap" }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </div>
  );
}
