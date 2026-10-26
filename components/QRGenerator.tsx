import React, { useState, useRef } from 'react';
import { onImgError } from '../assets';
import { QRCodeCanvas } from 'qrcode.react';
import { Cafe } from '../types';
import { Printer, Download, Sparkles, Smartphone, Wifi, Coffee } from 'lucide-react';

interface QRGeneratorProps {
  cafe: Cafe;
  baseUrl?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ cafe, baseUrl }) => {
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [accentStyle, setAccentStyle] = useState<'classic' | 'luxury'>('luxury');
  const printRef = useRef<HTMLDivElement>(null);

  const origin = window.location.origin + window.location.pathname;
  const targetUrl = selectedTable === 'all'
    ? `${origin}#/menu/${cafe.slug}`
    : `${origin}#/menu/${cafe.slug}?table=${selectedTable}`;

  const downloadQrPng = () => {
    const canvas = document.getElementById('qr-canvas-element') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${cafe.slug}-stol-${selectedTable}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tables = Array.from({ length: cafe.tablesCount || 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-8">
      {/* Settings bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">QR Kod va Stol Stend Parametrlari</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mijozlar menyuni ko'rishi va stol raqami bilan ofitsiantni chaqirishi uchun stollarga qo'yiladi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Stol tanlang:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">Umumiy menyu (Stolsiz)</option>
              {tables.map(t => (
                <option key={t} value={t}>{t}-stol</option>
              ))}
              <option value="VIP 1">VIP 1 xona</option>
              <option value="VIP 2">VIP 2 xona</option>
              <option value="Terassa 1">Terassa 1</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAccentStyle('luxury')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                accentStyle === 'luxury' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Qora & Oltin (Premium)
            </button>
            <button
              onClick={() => setAccentStyle('classic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                accentStyle === 'classic' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Klassik Oq
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Havola manzili: <span className="font-mono text-slate-700 font-semibold">{targetUrl}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadQrPng}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            QR PNG Yuklab olish
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            Chop etish (Stol Stendini chiqarish)
          </button>
        </div>
      </div>

      {/* Printable Preview Card (What goes on tables) */}
      <div className="flex justify-center p-4 md:p-8 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
        <div
          ref={printRef}
          id="printable-table-tent"
          className={`w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative transition-all ${
            accentStyle === 'luxury'
              ? 'bg-gradient-to-b from-stone-900 via-zinc-900 to-black text-white border border-stone-800'
              : 'bg-white text-slate-900 border border-slate-200'
          }`}
        >
          {/* Top Brand & Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md mb-3">
              <img onError={onImgError} decoding="async"
                src={cafe.logoUrl}
                alt={cafe.name}
                className="w-12 h-12 rounded-xl object-cover shadow-sm"
              />
            </div>
            <h4 className="text-xl font-black tracking-tight">{cafe.name}</h4>
            <p className={`text-[11px] font-medium tracking-widest uppercase mt-0.5 ${
              accentStyle === 'luxury' ? 'text-amber-400/90' : 'text-orange-600'
            }`}>
              Raqamli Smart Menyu
            </p>
          </div>

          {/* Table Badge */}
          <div className="mt-5 mb-5 flex justify-center">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${
              accentStyle === 'luxury'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-orange-50 text-orange-700 border border-orange-200'
            }`}>
              <Coffee className="w-3.5 h-3.5" />
              {selectedTable === 'all' ? 'UMUMIY STOLLAR UCHUN' : `STOL № ${selectedTable}`}
            </div>
          </div>

          {/* QR Code Canvas Frame */}
          <div className="flex justify-center my-6">
            <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center">
              <QRCodeCanvas
                id="qr-canvas-element"
                value={targetUrl}
                size={210}
                level="H"
                includeMargin={false}
                imageSettings={cafe.logoUrl ? {
                  src: cafe.logoUrl,
                  x: undefined,
                  y: undefined,
                  height: 42,
                  width: 42,
                  excavate: true,
                } : undefined}
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2 mt-4">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
              <Smartphone className={`w-4 h-4 ${accentStyle === 'luxury' ? 'text-amber-400' : 'text-orange-600'}`} />
              <span>Telefon kamerasini QR kodga qarating</span>
            </div>
            <p className={`text-[11px] leading-relaxed max-w-xs mx-auto ${
              accentStyle === 'luxury' ? 'text-stone-400' : 'text-slate-500'
            }`}>
              Rasmli taomlar, ingredientlar, to'g'ridan-to'g'ri ofitsiantni chaqirish va buyurtma berish xizmati.
            </p>
          </div>

          {/* WiFi details footer */}
          {(cafe.wifiName || cafe.wifiPassword) && (
            <div className={`mt-6 pt-4 border-t text-center ${
              accentStyle === 'luxury' ? 'border-stone-800/80 text-stone-400' : 'border-slate-100 text-slate-500'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono">
                <Wifi className="w-3.5 h-3.5" />
                <span>Wi-Fi: <strong className={accentStyle === 'luxury' ? 'text-white' : 'text-slate-800'}>{cafe.wifiName}</strong></span>
                {cafe.wifiPassword && (
                  <>
                    <span className="opacity-40">|</span>
                    <span>Parol: <strong className={accentStyle === 'luxury' ? 'text-white' : 'text-slate-800'}>{cafe.wifiPassword}</strong></span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
