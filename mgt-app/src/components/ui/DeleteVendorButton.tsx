"use client"

import { Button } from "@/components/ui/button"

export default function DeleteVendorButton({
  vendorId,
  action,
}: {
  vendorId: number
  action: (formData: FormData) => void
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("本当に削除しますか？")) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="targetId" value={vendorId} />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
      >
        Delete
      </Button>
    </form>
  )
}
