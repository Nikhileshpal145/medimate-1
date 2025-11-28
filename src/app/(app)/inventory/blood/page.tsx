import { getBloodStock } from "@/lib/data"
import { BloodClientPage } from "./client"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function BloodInventoryPage() {
  const data = await getBloodStock()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Blood Bank Inventory"
          description="Manage blood unit availability, status, and expiry."
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Batch
        </Button>
      </div>
      <BloodClientPage data={data} />
    </div>
  )
}
