"use client"

import { DataTable } from "@/components/ui/data-table"
import { Medicine } from "@/lib/types"
import { columns } from "./columns"

interface MedicineClientPageProps {
  data: Medicine[]
}

export function MedicineClientPage({ data }: MedicineClientPageProps) {
  return <DataTable columns={columns} data={data} />
}
