"use client"
import React from "react"
import CreatableSelect from "react-select/creatable"
import { AntisocialCheckStatus, ChecklistStatusEnum } from "@/types/checklist"

type Option = { id: number; name: string }
type Row = {
  id?: number
  client: string
  vendor: string
  service: string
  csp: string
  cspService: string
  vendorAntisocial: AntisocialCheckStatus
  vendorCommon: ChecklistStatusEnum
  vendorDetail: ChecklistStatusEnum
  cspAntisocial: AntisocialCheckStatus
  cspCommon: ChecklistStatusEnum
  cspDetail: ChecklistStatusEnum
  isNew?: boolean
  _action?: "delete"
}
type Props = {
  clientOptions: Option[]
  vendorOptions: Option[]
  serviceOptions: Option[]
  cspOptions: Option[]
  cspServiceOptions: Option[]
  initialRows?: Row[]
}

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { saveVendorCspServiceSummary } from "./saveSummaryCsp.server"
import { Button } from "@/components/ui/button"

export default function EditVendorCspServiceSummaryClient({
  clientOptions,
  vendorOptions,
  serviceOptions,
  cspOptions,
  cspServiceOptions,
  initialRows = [],
}: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // 編集
  const handleChange = (
    idx: number,
    field: keyof Row,
    value: string | AntisocialCheckStatus | ChecklistStatusEnum
  ) => {
    setRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    )
  }

  // セレクトボックスの変更を処理（型安全な変換）
  const handleSelectChange = (
    idx: number,
    field:
      | "vendorAntisocial"
      | "vendorCommon"
      | "vendorDetail"
      | "cspAntisocial"
      | "cspCommon"
      | "cspDetail",
    value: string
  ) => {
    if (field.endsWith("Antisocial")) {
      handleChange(idx, field, value as AntisocialCheckStatus)
    } else {
      handleChange(idx, field, value as ChecklistStatusEnum)
    }
  }
  // 削除
  const handleDelete = (idx: number) => {
    setRows((rows) => rows.filter((_, i) => i !== idx))
  }
  // 追加
  const handleAdd = () => {
    setRows((rows) => [
      ...rows,
      {
        client: "",
        vendor: "",
        service: "",
        csp: "",
        cspService: "",
        vendorAntisocial: AntisocialCheckStatus.unchecked,
        vendorCommon: ChecklistStatusEnum.not_created,
        vendorDetail: ChecklistStatusEnum.not_created,
        cspAntisocial: AntisocialCheckStatus.unchecked,
        cspCommon: ChecklistStatusEnum.not_created,
        cspDetail: ChecklistStatusEnum.not_created,
        isNew: true,
      } as Row,
    ])
  }
  // キャンセル
  const handleCancel = () => {
    router.push("/summary")
  }
  // 保存
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    // 必須項目がすべて埋まっている行のみ送信
    const validRows = rows.filter(
      (row) =>
        row.client && row.vendor && row.service && row.csp && row.cspService
    )
    formData.append("rows", JSON.stringify(validRows))
    startTransition(() => {
      saveVendorCspServiceSummary(formData)
    })
  }

  return (
    <main className="p-0 flex justify-center items-start min-h-screen bg-[#f8fafc]">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 w-full max-w-full mt-8">
        <h1 className="text-xl font-bold mb-4">
          Edit Vendor Service CSP Summary
        </h1>
        <form onSubmit={handleSave}>
          <table className="w-full border mb-4 text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-700">
                <th className="border px-2 py-2 w-8 text-center">ID</th>
                <th className="border px-2 py-2 w-14">Client</th>
                <th className="border px-2 py-2 w-48">Vendor</th>
                <th className="border px-2 py-2 w-48">Vendor Service</th>
                <th className="border px-2 py-2 w-20">Antisocial</th>
                <th className="border px-2 py-2 w-20">Common</th>
                <th className="border px-2 py-2 w-20">Detail</th>
                <th className="border px-2 py-2 w-48">CSP</th>
                <th className="border px-2 py-2 w-48">CSP Service</th>
                <th className="border px-2 py-2 w-24">Antisocial</th>
                <th className="border px-2 py-2 w-24">Common</th>
                <th className="border px-2 py-2 w-24">Detail</th>
                <th className="border px-2 py-2 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-4 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row.id ?? `new-${idx}`}>
                    <td className="border px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[120px]"
                        value={row.client}
                        onChange={(e) =>
                          handleChange(idx, "client", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {clientOptions.map((opt) => (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-1 min-w-[160px]">
                      <CreatableSelect
                        isClearable
                        options={vendorOptions.map((opt) => ({
                          value: opt.name,
                          label: opt.name,
                        }))}
                        value={
                          row.vendor
                            ? { value: row.vendor, label: row.vendor }
                            : null
                        }
                        onChange={(opt) =>
                          handleChange(idx, "vendor", opt ? opt.value : "")
                        }
                        onCreateOption={(inputValue) =>
                          handleChange(idx, "vendor", inputValue)
                        }
                        placeholder="Vendor"
                        styles={{
                          container: (base) => ({ ...base, minWidth: 0 }),
                          control: (base) => ({
                            ...base,
                            minHeight: 32,
                            fontSize: "0.875rem",
                          }),
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 min-w-[160px]">
                      <CreatableSelect
                        isClearable
                        options={serviceOptions.map((opt) => ({
                          value: opt.name,
                          label: opt.name,
                        }))}
                        value={
                          row.service
                            ? { value: row.service, label: row.service }
                            : null
                        }
                        onChange={(opt) =>
                          handleChange(idx, "service", opt ? opt.value : "")
                        }
                        onCreateOption={(inputValue) =>
                          handleChange(idx, "service", inputValue)
                        }
                        placeholder="Vendor Service"
                        styles={{
                          container: (base) => ({ ...base, minWidth: 0 }),
                          control: (base) => ({
                            ...base,
                            minHeight: 32,
                            fontSize: "0.875rem",
                          }),
                        }}
                      />
                    </td>
                    {/* Vendor Enum Columns */}
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.vendorAntisocial}
                        onChange={(e) =>
                          handleSelectChange(
                            idx,
                            "vendorAntisocial",
                            e.target.value
                          )
                        }
                      >
                        <option value={AntisocialCheckStatus.unchecked}>
                          未確認
                        </option>
                        <option value={AntisocialCheckStatus.checked}>
                          確認済
                        </option>
                        <option value={AntisocialCheckStatus.check_exception}>
                          省略先
                        </option>
                        <option value={AntisocialCheckStatus.monitor_checked}>
                          モニター済
                        </option>
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.vendorCommon}
                        onChange={(e) =>
                          handleSelectChange(
                            idx,
                            "vendorCommon",
                            e.target.value
                          )
                        }
                      >
                        <option value={ChecklistStatusEnum.not_created}>
                          未作成
                        </option>
                        <option value={ChecklistStatusEnum.completed}>
                          完了
                        </option>
                        <option value={ChecklistStatusEnum.not_required}>
                          不要
                        </option>
                        <option value={ChecklistStatusEnum.is_examined}>
                          精査済
                        </option>
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.vendorDetail}
                        onChange={(e) =>
                          handleSelectChange(
                            idx,
                            "vendorDetail",
                            e.target.value
                          )
                        }
                      >
                        <option value={ChecklistStatusEnum.not_created}>
                          未作成
                        </option>
                        <option value={ChecklistStatusEnum.completed}>
                          完了
                        </option>
                        <option value={ChecklistStatusEnum.not_required}>
                          不要
                        </option>
                        <option value={ChecklistStatusEnum.is_examined}>
                          精査済
                        </option>
                      </select>
                    </td>
                    {/* CSP Columns */}
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[120px]"
                        value={row.csp}
                        onChange={(e) =>
                          handleChange(idx, "csp", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {cspOptions.map((opt) => (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[120px]"
                        value={row.cspService}
                        onChange={(e) =>
                          handleChange(idx, "cspService", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {cspServiceOptions.map((opt) => (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* CSP Enum Columns */}
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.cspAntisocial}
                        onChange={(e) =>
                          handleSelectChange(
                            idx,
                            "cspAntisocial",
                            e.target.value
                          )
                        }
                      >
                        <option value={AntisocialCheckStatus.unchecked}>
                          未確認
                        </option>
                        <option value={AntisocialCheckStatus.checked}>
                          確認済
                        </option>
                        <option value={AntisocialCheckStatus.check_exception}>
                          省略先
                        </option>
                        <option value={AntisocialCheckStatus.monitor_checked}>
                          モニター済
                        </option>
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.cspCommon}
                        onChange={(e) =>
                          handleChange(idx, "cspCommon", e.target.value)
                        }
                      >
                        <option value="not_created">未作成</option>
                        <option value="completed">完了</option>
                        <option value="not_required">不要</option>
                        <option value="is_examined">精査済</option>
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="border rounded px-2 py-1 w-full min-w-[90px]"
                        value={row.cspDetail}
                        onChange={(e) =>
                          handleChange(idx, "cspDetail", e.target.value)
                        }
                      >
                        <option value="not_created">未作成</option>
                        <option value="completed">完了</option>
                        <option value="not_required">不要</option>
                        <option value="is_examined">精査済</option>
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
            <Button
              type="button"
              variant="default"
              // className="bg-slate-700 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded"
              onClick={handleAdd}
            >
              Add
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                // className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-sm"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                // type="submit"
                variant="orange"
                // className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
