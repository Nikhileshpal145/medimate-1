import { getMedicineInventory } from "@/lib/data"
import { MedicineClientPage } from "./client"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function MedicineInventoryPage() {
  const data = await getMedicineInventory()

  return (
    <div className="flex flex-col gap-6">
       <div className="flex justify-between items-start">
        <PageHeader 
          title="Medicine Inventory"
          description="Track stock levels, reorder points, and expiry dates for medicines."
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Medicine
        </Button>
      </div>
      <MedicineClientPage data={data} />
    </div>
  )
}
