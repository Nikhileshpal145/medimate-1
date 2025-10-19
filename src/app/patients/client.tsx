"use client"

import { DataTable } from "@/components/ui/data-table"
import { Patient } from "@/lib/types"
import { columns } from "./columns"

interface PatientClientPageProps {
  data: Patient[]
}

export function PatientClientPage({ data }: PatientClientPageProps) {
  return <DataTable columns={columns} data={data} />
}
