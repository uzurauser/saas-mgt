"use client"

export default function PrintButton() {
  return (
    <button
      className="px-6 py-2 bg-slate-800 text-white rounded-lg shadow print:hidden"
      onClick={() => window.print()}
    >
      PDF印刷
    </button>
  )
}
