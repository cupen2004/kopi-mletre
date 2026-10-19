"use client";

import { useState, useRef, useCallback } from "react";
import { useAdminStore } from "@/lib/admin-store";
import QRCode from "qrcode";

export default function TablesPanel() {
  const { tables, addTable, updateTable, deleteTable, shopConfig } =
    useAdminStore();
  const [newTableId, setNewTableId] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [generatingQr, setGeneratingQr] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAddTable = () => {
    if (!newTableId.trim()) return;
    const id = newTableId.trim().padStart(2, "0");
    if (tables.some((t) => t.id === id)) {
      alert("Nomor meja sudah ada!");
      return;
    }
    addTable({
      id,
      name: newTableName.trim() || `Meja ${id}`,
      isActive: true,
    });
    setNewTableId("");
    setNewTableName("");
  };

  const generateQR = useCallback(
    async (tableId: string) => {
      setGeneratingQr(tableId);
      const url = `${shopConfig.baseUrl}/menu?meja=${tableId}`;
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: "#09090b",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR generation error:", err);
      }
    },
    [shopConfig.baseUrl]
  );

  const downloadQR = useCallback(
    async (tableId: string) => {
      const url = `${shopConfig.baseUrl}/menu?meja=${tableId}`;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 600;
      const padding = 60;
      canvas.width = size;
      canvas.height = size + 140;

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
      ctx.fill();

      // Border
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, canvas.width - 8, canvas.height - 8, 18);
      ctx.stroke();

      // QR Code
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, url, {
        width: size - padding * 2,
        margin: 1,
        color: { dark: "#09090b", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      ctx.drawImage(qrCanvas, padding, 40, size - padding * 2, size - padding * 2);

      // Shop name
      ctx.fillStyle = "#09090b";
      ctx.font = "bold 28px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Kopi Mletre", size / 2, size + 20);

      // Table info
      ctx.font = "18px Inter, sans-serif";
      ctx.fillStyle = "#6366f1";
      ctx.fillText(`Meja ${tableId}`, size / 2, size + 55);

      // Scan text
      ctx.font = "14px Inter, sans-serif";
      ctx.fillStyle = "#71717a";
      ctx.fillText("Scan untuk Pesan Menu", size / 2, size + 85);

      const link = document.createElement("a");
      link.download = `qr-meja-${tableId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    },
    [shopConfig.baseUrl]
  );

  const downloadAllQR = async () => {
    for (const table of tables.filter((t) => t.isActive)) {
      await downloadQR(table.id);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  return (
    <div className="space-y-6">
      {/* Add table card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">Tambah Meja Baru</h3>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={newTableId}
            onChange={(e) => setNewTableId(e.target.value)}
            placeholder="Nomor meja (cth: 01)"
            className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Nama meja (opsional)"
            className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddTable}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
          >
            Tambah Meja
          </button>
        </div>
      </div>

      {/* Download all */}
      <button
        onClick={downloadAllQR}
        className="bg-zinc-800 text-zinc-100 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all border border-zinc-700/50 flex items-center gap-2 shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Unduh Semua QR Code Meja
      </button>

      {/* Tables grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 text-center shadow-lg transition-all hover:border-zinc-700 ${
              !table.isActive ? "opacity-50" : ""
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-3">
              <span className="text-white font-extrabold text-lg">{table.id}</span>
            </div>
            <p className="text-white text-sm font-semibold mb-1">{table.name}</p>
            <p
              className={`text-xs font-semibold mb-4 ${
                table.isActive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {table.isActive ? "Aktif" : "Nonaktif"}
            </p>

            <div className="flex gap-1.5 justify-center">
              <button
                onClick={() => generateQR(table.id)}
                className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
                title="Lihat QR"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </button>
              <button
                onClick={() => downloadQR(table.id)}
                className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
                title="Unduh QR"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => updateTable(table.id, { isActive: !table.isActive })}
                className={`p-2.5 rounded-xl transition-all ${
                  table.isActive
                    ? "bg-zinc-800 text-emerald-400 hover:text-red-400"
                    : "bg-zinc-800 text-red-400 hover:text-emerald-400"
                }`}
                title={table.isActive ? "Nonaktifkan" : "Aktifkan"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={table.isActive ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus ${table.name}?`)) {
                    deleteTable(table.id);
                  }
                }}
                className="p-2.5 rounded-xl bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                title="Hapus"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Preview Modal */}
      {generatingQr && qrDataUrl && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => {
              setGeneratingQr(null);
              setQrDataUrl(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <h3 className="text-xl font-bold text-white mb-1">
                QR Code Meja {generatingQr}
              </h3>
              <p className="text-zinc-400 text-xs mb-6 truncate">
                {shopConfig.baseUrl}/menu?meja={generatingQr}
              </p>
              <div className="bg-white rounded-2xl p-5 inline-block mb-6 shadow-xl">
                <img
                  src={qrDataUrl}
                  alt={`QR Code Meja ${generatingQr}`}
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => downloadQR(generatingQr)}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  Unduh QR
                </button>
                <button
                  onClick={() => {
                    setGeneratingQr(null);
                    setQrDataUrl(null);
                  }}
                  className="bg-zinc-800 text-zinc-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
