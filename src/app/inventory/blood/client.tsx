"use client"

import { DataTable } from "@/components/ui/data-table"
import { BloodUnit } from "@/lib/types"
import { columns } from "./columns"

interface BloodClientPageProps {
  data: BloodUnit[]
}

export function BloodClientPage({ data }: BloodClientPageProps) {
  return <DataTable columns={columns} data={data} />
}
