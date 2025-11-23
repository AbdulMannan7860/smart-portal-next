import React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const DataTable = ({ columns, data, border }) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-center border-0 overflow-auto">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className={`bg-[#6C0404] text-white`}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-2">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b  border-gray-200">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className={`px-4 py-3 ${(cell.column.id === border) ? "border border-gray-200" : ""}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
