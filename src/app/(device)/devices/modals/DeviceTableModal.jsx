"use client";

import Modal from "@/components/Modals/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function safeValue(val) {
  if (val === null || val === undefined) return "-";
  if (typeof val === "object") return JSON.stringify(val);
  return val;
}

export default function DeviceTableModal({ open, onClose, title, columns, data = [], renderRow }) {
  if (!data) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title={title} size="xl">
      <div className="rounded border border-stroke dark:border-dark-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {renderRow(row, idx)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Modal>
  );
}
