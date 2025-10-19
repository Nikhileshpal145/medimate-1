import { getPatients } from "@/lib/data"
import { PatientClientPage } from "./client"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Patient Records"
          description="Manage all patient information and medical histories."
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>
      <PatientClientPage data={patients} />
    </div>
  )
}
