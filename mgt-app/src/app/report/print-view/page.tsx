import { prisma } from "@/lib/prisma"
import PrintButton from "../PrintButton"
import { format } from "date-fns"
import React from "react"

const LABELS = {
  client: "部署",
  vendor: "ベンダー",
  vendorService: "ベンダーサービス",
  antisocial: "反社チェック",
  common: "共通チェックリスト",
  detail: "個人情報あり板チェックリスト",
  csp: "プロバイダ",
  cspService: "プロバイダサービス",
  outsourcingPartner: "外部委託先",
  outsourcingService: "委託業務",
}
const STATUS_LABELS: Record<string, string> = {
  unchecked: "未完了",
  checked: "完了",
  check_exception: "省略先",
  monitor_checked: "外部モニタリングにてチェック済",
  not_created: "未作成",
  completed: "作成済",
  not_required: "作成不要",
  is_examined: "精査済",
}

function nowJST() {
  const now = new Date()
  return format(
    new Date(now.getTime() + 9 * 60 * 60 * 1000),
    "yyyy-MM-dd HH:mm"
  )
}

export default async function ReportPrintViewPage() {
  // 1. ベンダーサービス
  const vendorRows = await prisma.v_summary_vendor_service.findMany({
    select: {
      id: true,
      client_name: true,
      vendor_name: true,
      vendor_service_name: true,
      vendorAntisocialCheckStatus: true,
      vendorCommonChecklistStatus: true,
      vendorDetailChecklistStatus: true,
    },
    orderBy: { id: "asc" },
  })
  // 2. プロバイダサービス
  const cspRows = await prisma.v_summary_vendor_service_csp_service.findMany({
    select: {
      id: true,
      client_name: true,
      vendor_name: true,
      vendor_service_name: true,
      csp_name: true,
      csp_service_name: true,
      vendorAntisocialCheckStatus: true,
      vendorCommonChecklistStatus: true,
      vendorDetailChecklistStatus: true,
      cspAntisocialCheckStatus: true,
      cspCommonChecklistStatus: true,
      cspDetailChecklistStatus: true,
    },
    orderBy: { id: "asc" },
  })
  // 3. 外部委託サービス
  const outsourcingRows =
    await prisma.v_summary_outsourcing_service_csp_service.findMany({
      select: {
        id: true,
        client_name: true,
        outsourcing_partner_name: true,
        outsourcing_service_name: true,
        csp_name: true,
        csp_service_name: true,
        outsourcingPartnerAntisocialCheckStatus: true,
        cspAntisocialCheckStatus: true,
        cspServiceCommonChecklistStatus: true,
        cspServiceDetailChecklistStatus: true,
      },
      orderBy: { id: "asc" },
    })

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 pt-8 px-8 print:pt-4 print:px-4">
        <h1 className="text-2xl font-bold tracking-wide mb-1 print:text-xl">
          クラウドサービス モニタリング報告書
        </h1>
        <div className="text-gray-500 text-sm print:text-xs">
          出力日時：{nowJST()}
        </div>
        <PrintButton />
      </div>
      <div className="p-0 print:p-0 max-w-none w-full mx-auto">
        {/* 1. ベンダーサービス */}
        <section className="mb-16 page-break">
          <h2 className="text-lg font-bold mb-2 print:text-base px-8 print:px-4">
            ベンダーサービス一覧
          </h2>
          <div className="overflow-x-auto">
            <table className="w-[60%] min-w-[600px] text-sm print:text-xs border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-3 py-2 w-20 text-left">
                    {LABELS.client}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.vendor}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.vendorService}
                  </th>
                  <th className="border px-3 py-2 w-24 text-left">
                    {LABELS.antisocial}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.common}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.detail}
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendorRows.map((row) => (
                  <tr key={row.id} className="break-words">
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.client_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.vendor_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.vendor_service_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorAntisocialCheckStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorCommonChecklistStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorDetailChecklistStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. プロバイダサービス */}
        <section className="mb-16 page-break">
          <h2 className="text-lg font-bold mb-2 print:text-base px-8 print:px-4">
            プロバイダサービス一覧
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm print:text-xs border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-3 py-2 w-20 text-left">
                    {LABELS.client}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.vendor}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.vendorService}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.csp}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.cspService}
                  </th>
                  <th className="border px-3 py-2 w-24 text-left">
                    {LABELS.antisocial}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.common}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.detail}
                  </th>
                  <th className="border px-3 py-2 w-24 text-left">
                    プロバイダ{LABELS.antisocial}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    プロバイダ{LABELS.common}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    プロバイダ{LABELS.detail}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cspRows.map((row) => (
                  <tr key={row.id} className="break-words">
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.client_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.vendor_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.vendor_service_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.csp_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.csp_service_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorAntisocialCheckStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorCommonChecklistStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.vendorDetailChecklistStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspAntisocialCheckStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspCommonChecklistStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspDetailChecklistStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. 外部委託サービス */}
        <section className="mb-16 page-break">
          <h2 className="text-lg font-bold mb-2 print:text-base px-8 print:px-4">
            外部委託サービス一覧
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm print:text-xs border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-3 py-2 w-20 text-left">
                    {LABELS.client}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.outsourcingPartner}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.outsourcingService}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    {LABELS.csp}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    {LABELS.cspService}
                  </th>
                  <th className="border px-3 py-2 w-24 text-left">
                    外部委託先{LABELS.antisocial}
                  </th>
                  <th className="border px-3 py-2 w-24 text-left">
                    プロバイダ{LABELS.antisocial}
                  </th>
                  <th className="border px-3 py-2 w-32 text-left">
                    プロバイダ{LABELS.common}
                  </th>
                  <th className="border px-3 py-2 w-36 text-left">
                    プロバイダ{LABELS.detail}
                  </th>
                </tr>
              </thead>
              <tbody>
                {outsourcingRows.map((row) => (
                  <tr key={row.id} className="break-words">
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.client_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.outsourcing_partner_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.outsourcing_service_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.csp_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {row.csp_service_name}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {
                        STATUS_LABELS[
                          row.outsourcingPartnerAntisocialCheckStatus
                        ]
                      }
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspAntisocialCheckStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspServiceCommonChecklistStatus]}
                    </td>
                    <td className="border px-3 py-2 align-top break-words whitespace-pre-line">
                      {STATUS_LABELS[row.cspServiceDetailChecklistStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {/* ページ区切りCSS・A3 landscape指定 */}
      <style>{`
        html, body, #__next, #__next > div { background: #fff !important; }
        @media print {
          .page-break { page-break-after: always; }
          @page { size: A3 landscape; margin: 0; }
          body { margin: 0 !important; }
        }
      `}</style>
    </div>
  )
}
