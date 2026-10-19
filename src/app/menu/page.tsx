"use client";

import { Suspense } from "react";
import MenuPageContent from "@/components/MenuPageContent";

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-coffee-600 to-coffee-800 flex items-center justify-center shadow-lg mb-4 animate-pulse-soft">
              <span className="text-xl font-bold text-white">KM</span>
            </div>
            <p className="text-coffee-600 font-medium">Memuat menu...</p>
          </div>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
