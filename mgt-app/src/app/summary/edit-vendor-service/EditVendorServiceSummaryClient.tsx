"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreatableSelect from "react-select/creatable"
import React, { useState, useRef } from "react"
import { saveVendorServiceSummary } from "./saveSummary.server"
import { useRouter } from "next/navigation"

import {
  ChecklistStatusEnum,
  AntisocialCheckStatus,
  checklistStatusOptions,
  antisocialStatusOptions,
} from "@/types/checklist"

type VendorAutocompleteInputProps = {
  value: string
  onChange: (value: string) => void
  options: { id: number; name: string }[]
}
function VendorAutocompleteInput({
  value,
  onChange,
  options,
}: VendorAutocompleteInputProps) {
  const selectOptions = options.map((opt) => ({
    value: opt.name,
    label: opt.name,
  }))
  const current = value ? { value, label: value } : null
  return (
    <CreatableSelect
      isClearable
      options={selectOptions}
      value={current}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      onCreateOption={(inputValue) => onChange(inputValue)}
      placeholder="Vendor"
      styles={{
        container: (base) => ({ ...base, minWidth: 0 }),
        control: (base) => ({
          ...base,
          minHeight: 36,
          borderColor: "#d1d5db",
          fontSize: 14,
        }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      menuPortalTarget={
        typeof window !== "undefined" ? document.body : undefined
      }
      menuPosition="fixed"
      menuShouldBlockScroll={true}
      classNamePrefix="react-select"
    />
  )
}

type Option = { id: number; name: string }
type Row = {
  id?: number
  client: string
  vendor: string
  service: string
  antisocial: AntisocialCheckStatus
  common: ChecklistStatusEnum
  detail: ChecklistStatusEnum
  isNew?: boolean // 新規行フラグ
  _action?: "delete"
}
type Props = {
  vendorOptions: Option[]
  clientOptions: Option[]
  serviceOptions: Option[]
  initialRows?: Row[]
}

export default function EditVendorServiceSummaryClient({
  vendorOptions,
  clientOptions,
  initialRows = [],
}: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [isPending, setIsPending] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string>
  >({})
  const router = useRouter()
  const initialRowsRef = useRef(initialRows)

  // 初回のみrowsを初期化
  React.useEffect(() => {
    if (rows.length === 0 && initialRows.length > 0) {
      setRows(initialRows)
      initialRowsRef.current = initialRows
    }
    // eslint-disable-next-line
  }, [])

  // 行追加
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        client: "",
        vendor: "",
        service: "",
        antisocial: AntisocialCheckStatus.unchecked,
        common: ChecklistStatusEnum.not_created,
        detail: ChecklistStatusEnum.not_created,
        isNew: true,
      } as Row, // 型アサーションを追加
    ])
  }
  // 行削除
  const handleDelete = (id?: number) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, _action: "delete" } : row))
    )
    setValidationErrors((prev) => {
      const copy = { ...prev }
      if (id) delete copy[id]
      return copy
    })
  }
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
    field: "antisocial" | "common" | "detail",
    value: string
  ) => {
    if (field === "antisocial") {
      handleChange(idx, field, value as AntisocialCheckStatus)
    } else {
      handleChange(idx, field, value as ChecklistStatusEnum)
    }
  }

  // バリデーション
  const validate = (row: Row) => {
    if (row._action === "delete") return ""
    if (!row.client) return "Client is required."
    if (!row.vendor) return "Vendor is required."
    if (!row.service) return "Service is required."
    return ""
  }
  // 保存
  const handleSave = async (formData: FormData) => {
    setIsPending(true)
    setValidationErrors({})
    // クライアント側バリデーション
    const errors: Record<number, string> = {}
    rows.forEach((row) => {
      const err = validate(row)
      if (err) errors[row.id ?? 0] = err
    })
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsPending(false)
      return
    }
    try {
      // isNewフラグは送信時には除外
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rowsForSave = rows.map(({ isNew, ...rest }) => rest)
      formData.set("rows", JSON.stringify(rowsForSave))
      await saveVendorServiceSummary(formData)
      router.push("/summary")
    } catch (e: unknown) {
      // エラー時のみ表示
      alert((e as Error).message || "Save error")
    } finally {
      setIsPending(false)
    }
  }
  // キャンセル
  const handleCancel = () => {
    router.push("/summary")
  }

  return (
    <main className="p-0 flex justify-center items-start min-h-screen bg-[#f8fafc]">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 w-full max-w-[1800px] mt-8">
        <h1 className="text-xl font-bold mb-4">Edit Vendor Service Summary</h1>
        <form action={handleSave}>
          <table className="w-full border mb-4 text-sm">
            <thead>
              <tr className="bg-slate-50 text-gray-700">
                <th className="border px-2 py-2 w-12 text-center">ID</th>
                <th className="border px-2 py-2 w-40">Client</th>
                <th className="border px-2 py-2 w-[300px]">Vendor</th>
                <th className="border px-2 py-2 w-[300px]">Service</th>
                <th className="border px-2 py-2 w-32">Antisocial</th>
                <th className="border px-2 py-2 w-32">Common</th>
                <th className="border px-2 py-2 w-32">Detail</th>
                <th className="border px-2 py-2 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) =>
                  row._action === "delete" ? null : (
                    <tr
                      key={row.id}
                      className={`hover:bg-blue-50 transition ${
                        row.isNew ? "bg-yellow-100" : ""
                      }`}
                    >
                      <td className="border px-2 py-1 text-center">
                        {idx + 1}
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded px-2 py-1 w-full min-w-[120px]"
                          value={
                            clientOptions.some((opt) => opt.name === row.client)
                              ? row.client
                              : ""
                          }
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
                        {validationErrors[row.id ?? 0] && (
                          <div className="text-xs text-red-600 mt-1">
                            {validationErrors[row.id ?? 0]}
                          </div>
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        <VendorAutocompleteInput
                          value={row.vendor}
                          onChange={(val) => handleChange(idx, "vendor", val)}
                          options={vendorOptions}
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          value={row.service}
                          onChange={(e) =>
                            handleChange(idx, "service", e.target.value)
                          }
                          placeholder="Service"
                          className="w-full min-w-[120px]"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded px-2 py-1 w-full min-w-[90px]"
                          value={row.antisocial}
                          onChange={(e) =>
                            handleSelectChange(
                              idx,
                              "antisocial",
                              e.target.value
                            )
                          }
                        >
                          {antisocialStatusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded px-2 py-1 w-full min-w-[90px]"
                          value={row.common || ChecklistStatusEnum.not_created}
                          onChange={(e) =>
                            handleSelectChange(idx, "common", e.target.value)
                          }
                        >
                          {checklistStatusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded px-2 py-1 w-full min-w-[90px]"
                          value={row.detail || ChecklistStatusEnum.not_created}
                          onChange={(e) =>
                            handleSelectChange(idx, "detail", e.target.value)
                          }
                        >
                          {checklistStatusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="default"
              onClick={handleAdd}
              // className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded"
            >
              Add
            </Button>
            <div className="flex-1" />
            <Button
              // type="button"
              variant="outline"
              // className="px-6 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              // type="submit"
              variant="orange"
              disabled={isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
