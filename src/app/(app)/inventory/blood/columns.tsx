"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BloodUnit } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<BloodUnit>[] = [
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => {
        return <div className="font-mono font-bold text-lg text-primary">{row.original.bloodGroup}</div>
    }
  },
  {
    accessorKey: "units",
    header: "Units (Available)",
  },
  {
    accessorKey: "collectionDate",
    header: "Collection Date",
    cell: ({ row }) => new Date(row.original.collectionDate).toLocaleDateString(),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status
        return (
            <Badge
                className={cn({
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': status === 'Usable',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': status === 'Quarantined',
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300': status === 'Expired',
                })}
                variant="secondary"
            >
                {status}
            </Badge>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Discard Unit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
