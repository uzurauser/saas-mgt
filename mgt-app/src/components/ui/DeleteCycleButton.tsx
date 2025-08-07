"use client"

import { Button } from "@/components/ui/button"

export default function DeleteCycleButton({
  cycleId,
  action,
}: {
  cycleId: number
  action: (formData: FormData) => void
}) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirm("本当に削除しますか？")) {
          e.preventDefault()
        }
      }}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="targetId" value={cycleId} />
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
