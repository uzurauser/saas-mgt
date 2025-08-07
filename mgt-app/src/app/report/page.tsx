"use client";
import React from "react";

export default function ReportPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 mt-24">
        <h1 className="text-2xl font-bold mb-6">コンプライアンスチェック帳票</h1>
        <p className="mb-6 text-gray-700">帳票のPDF印刷は、下記ボタンから印刷専用画面を開いてください。</p>
        <button
          className="px-6 py-3 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition print:hidden"
          onClick={() => window.open("/print-view", "_blank", "noopener,width=1200,height=900")}
        >
          帳票を別ウィンドウで開く（PDF印刷）
        </button>

      </div>
    </div>
  );
}
