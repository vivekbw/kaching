import React from "react";
import Image from "next/image";

export function Watermark() {
  return (
    <div className="fixed bottom-4 left-4 opacity-30 z-50 group">
      <Image
        src="/palantir.svg"
        alt="Palantir Logo"
        width={24}
        height={24}
        className="text-black"
      />
      <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Powered by Foundry AIP
      </div>
    </div>
  );
}
