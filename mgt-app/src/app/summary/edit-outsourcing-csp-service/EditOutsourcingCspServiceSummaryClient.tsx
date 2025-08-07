"use client"
import React from "react"
import CreatableSelect from "react-select/creatable"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveOutsourcingCspServiceSummary } from "./saveSummaryOutsourcingCsp.server"

type Option = { id: number; name: string }
export type Row = {
  id?: number
  client: string
  partner: string
  service: string
  csp: string
  cspService: string
  partnerAntisocial: string
  partnerCommon: string
  partnerDetail: string
  cspAntisocial: string
  cspCommon: string
  cspDetail: string
  isNew?: boolean
  _action?: "delete"
}
type Props = {
  clientOptions: Option[]
  partnerOptions: Option[]
  serviceOptions: Option[]
  cspOptions: Option[]
  cspServiceOptions: Option[]
  initialRows?: Row[]
}

export default function EditOutsourcingCspServiceSummaryClient({
  clientOptions,
  partnerOptions,
  serviceOptions,
  cspOptions,
  cspServiceOptions,
  initialRows = [],
}: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleChange = (idx: number, field: keyof Row, value: string) => {
    setRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    )
  }
  const handleDelete = (idx: number) => {
    setRows((rows) => rows.filter((_, i) => i !== idx))
  }
  const handleAdd = () => {
    setRows((rows) => [
      ...rows,
      {
        client: "",
        partner: "",
        service: "",
        csp: "",
        cspService: "",
        partnerAntisocial: "unchecked",
        partnerCommon: "not_created",
        partnerDetail: "not_created",
        cspAntisocial: "unchecked",
        cspCommon: "not_created",
        cspDetail: "not_created",
        isNew: true,
      },
    ])
  }
  const handleCancel = () => {
    router.push("/summary")
  }
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    const validRows = rows.filter(
      (row) => row.partner && row.service && row.csp && row.cspService
    )
    formData.append("rows", JSON.stringify(validRows))
    startTransition(() => {
      saveOutsourcingCspServiceSummary(formData)
    })
  }

  return (
    <main className="p-0 flex justify-center items-start min-h-screen bg-[#f8fafc]">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 w-[80vw] max-w-full mt-8">
        <h1 className="text-xl font-bold mb-4">
          Edit Outsourcing Service CSP Summary
        </h1>
        <form onSubmit={handleSave}>
          <table className="w-full border mb-4 text-sm">
            <thead>
              <tr className="bg-slate-50 text-gray-700">
                <th className="border px-2 py-2 w-8 text-center">ID</th>
                <th className="border px-2 py-2 w-14">Client</th>
                <th className="border px-2 py-2 w-52">Partner</th>
                <th className="border px-2 py-2 w-52">Service</th>
                <th className="border px-2 py-2 w-14">Antisocial</th>
                <th className="border px-2 py-2 w-52">CSP</th>
                <th className="border px-2 py-2 w-52">CSP Service</th>
                <th className="border px-2 py-2 w-14">Antisocial</th>
                <th className="border px-2 py-2 w-14">Common</th>
                <th className="border px-2 py-2 w-14">Detail</th>
                <th className="border px-2 py-2 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={idx}>
                    {/* ID */}
                    <td className="border px-2 py-1 w-8 text-center">
                      {row.id ?? ""}
                    </td>
                    {/* Client */}
                    <td className="border px-2 py-1 min-w-[130px]">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[120px]"
                        value={row.client}
                        onChange={(e) =>
                          handleChange(idx, "client", e.target.value)
                        }
                      >
                        <option value="">Select client</option>
                        {clientOptions.map((opt: Option) => (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Partner */}
                    <td className="border px-2 py-1 min-w-[130px]">
                      <CreatableSelect
                        classNamePrefix="react-select"
                        value={
                          row.partner
                            ? { label: row.partner, value: row.partner }
                            : null
                        }
                        options={partnerOptions.map((opt) => ({
                          label: opt.name,
                          value: opt.name,
                        }))}
                        onChange={(opt) =>
                          handleChange(idx, "partner", opt?.value || "")
                        }
                        isClearable
                        styles={{
                          container: (base) => ({ ...base, minWidth: 120 }),
                        }}
                      />
                    </td>
                    {/* Service */}
                    <td className="border px-2 py-1 min-w-[130px]">
                      <CreatableSelect
                        classNamePrefix="react-select"
                        value={
                          row.service
                            ? { label: row.service, value: row.service }
                            : null
                        }
                        options={serviceOptions.map((opt) => ({
                          label: opt.name,
                          value: opt.name,
                        }))}
                        onChange={(opt) =>
                          handleChange(idx, "service", opt?.value || "")
                        }
                        isClearable
                        styles={{
                          container: (base) => ({ ...base, minWidth: 120 }),
                        }}
                      />
                    </td>
                    {/* Partner Antisocial */}
                    <td className="border px-2 py-1 min-w-[110px]">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[100px]"
                        value={row.partnerAntisocial}
                        onChange={(e) =>
                          handleChange(idx, "partnerAntisocial", e.target.value)
                        }
                      >
                        <option value="unchecked">Unchecked</option>
                        <option value="checked">Checked</option>
                        <option value="check_exception">Check Exception</option>
                        <option value="monitor_checked">Monitor Checked</option>
                      </select>
                    </td>
                    {/* CSP */}
                    <td className="border px-2 py-1 min-w-[130px]">
                      <CreatableSelect
                        classNamePrefix="react-select"
                        value={
                          row.csp ? { label: row.csp, value: row.csp } : null
                        }
                        options={cspOptions.map((opt) => ({
                          label: opt.name,
                          value: opt.name,
                        }))}
                        onChange={(opt) =>
                          handleChange(idx, "csp", opt?.value || "")
                        }
                        isClearable
                        styles={{
                          container: (base) => ({ ...base, minWidth: 120 }),
                        }}
                      />
                    </td>
                    {/* CSP Service */}
                    <td className="border px-2 py-1 min-w-[130px]">
                      <CreatableSelect
                        classNamePrefix="react-select"
                        value={
                          row.cspService
                            ? { label: row.cspService, value: row.cspService }
                            : null
                        }
                        options={cspServiceOptions.map((opt) => ({
                          label: opt.name,
                          value: opt.name,
                        }))}
                        onChange={(opt) =>
                          handleChange(idx, "cspService", opt?.value || "")
                        }
                        isClearable
                        styles={{
                          container: (base) => ({ ...base, minWidth: 120 }),
                        }}
                      />
                    </td>
                    {/* CSP Antisocial */}
                    <td className="border px-2 py-1 min-w-[110px]">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[100px]"
                        value={row.cspAntisocial}
                        onChange={(e) =>
                          handleChange(idx, "cspAntisocial", e.target.value)
                        }
                      >
                        <option value="unchecked">Unchecked</option>
                        <option value="checked">Checked</option>
                        <option value="check_exception">Check Exception</option>
                        <option value="monitor_checked">Monitor Checked</option>
                      </select>
                    </td>
                    {/* CSP Common */}
                    <td className="border px-2 py-1 min-w-[110px]">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[100px]"
                        value={row.cspCommon}
                        onChange={(e) =>
                          handleChange(idx, "cspCommon", e.target.value)
                        }
                      >
                        <option value="not_created">Not Created</option>
                        <option value="completed">Completed</option>
                        <option value="not_required">Not Required</option>
                        <option value="is_examined">Is Examined</option>
                      </select>
                    </td>
                    {/* CSP Detail */}
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.cspDetail}
                        onChange={(e) =>
                          handleChange(idx, "cspDetail", e.target.value)
                        }
                      >
                        <option value="not_created">Not Created</option>
                        <option value="completed">Completed</option>
                        <option value="not_required">Not Required</option>
                        <option value="is_examined">Is Examined</option>
                      </select>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        type="button"
                        className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-xs px-2 py-1 rounded"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded"
              onClick={handleAdd}
            >
              Add
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-sm"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                disabled={isPending}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
