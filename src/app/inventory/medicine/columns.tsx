"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Medicine } from "@/lib/types"
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
import { Progress } from "@/components/ui/progress"

export const columns: ColumnDef<Medicine>[] = [
  {
    accessorKey: "name",
    header: "Medicine Name",
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.name}</div>
    }
  },
  {
    accessorKey: "stock",
    header: "Stock Level",
    cell: ({ row }) => {
        const medicine = row.original
        const stockPercentage = (medicine.stock / (medicine.reorderPoint * 2)) * 100
        return (
            <div className="flex items-center gap-2">
                <Progress value={stockPercentage} className="w-24 h-2" />
                <span>{medicine.stock}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
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
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': status === 'In Stock',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': status === 'Low Stock',
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': status === 'Out of Stock',
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
            <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
