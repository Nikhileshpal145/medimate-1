"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Patient } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{patient.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "lastVisit",
    header: "Last Visit",
    cell: ({ row }) => new Date(row.original.lastVisit).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status
        return (
            <Badge
                className={cn({
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': status === 'Critical',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': status === 'Stable',
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': status === 'Recovered',
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
      const patient = row.original
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(patient.id)}
            >
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit record</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
