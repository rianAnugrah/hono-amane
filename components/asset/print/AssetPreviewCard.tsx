import React, { useState, useEffect } from 'react';
import { formatDate } from "@/components/utils/formatting";
import { generateQRCode } from './qr-utils';
import { AssetPreviewCardProps } from './types';

// HTML Preview component (for the modal view)
export const AssetPreviewCard: React.FC<AssetPreviewCardProps> = ({ asset, scale }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (asset.assetNo) {
      generateQRCode(asset.assetNo).then(setQrUrl);
    }
  }, [asset.assetNo]);

  return (
    <div 
      className="border border-gray-800 bg-white overflow-hidden flex flex-col"
      style={{ 
        width: `${400 * scale}px`, 
        height: `${250 * scale}px`
      }}
    >
      <div className="flex flex-row h-4/5 border-b border-gray-800">
        {/* Logo Left */}
        <div className="w-1/5 border-r border-gray-800 flex flex-col items-center justify-center p-1">
          <img src="/img/skk-migas-logo.png" className="w-10 h-10 mb-0.5" alt="SKK Logo" />
          <div className="text-[10px] text-center font-bold leading-tight">SKK MIGAS</div>
        </div>
        
        {/* Main Section */}
        <div className="w-3/5 bg-[#c0d736] border-r border-gray-800">
          <div className="border-b border-gray-800 font-bold text-center p-1 text-xs">
            BARANG MILIK NEGARA
          </div>
          
          <div className="flex border-b border-gray-800 h-7">
            <div className="w-1/6 border-r border-gray-800 p-0.5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] leading-tight">Type</span>
              <span className="text-[11px] font-bold leading-tight">{asset.projectCode?.code || ''}</span>
            </div>
            <div className="w-1/2 border-r border-gray-800 p-0.5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] leading-tight">Nomor Sinas</span>
              <span className="text-[11px] font-bold leading-tight">{asset.assetNo}</span>
            </div>
            <div className="w-1/3 p-0.5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] leading-tight">Tahun IP</span>
              <span className="text-[11px] font-bold leading-tight">{formatDate(asset.pisDate)}</span>
            </div>
          </div>
          
          <div className="flex flex-1">
            <div className="w-1/6 border-r border-gray-800 p-0.5 text-center flex flex-col items-center justify-start">
              <span className="text-[10px]">Ket :</span>
            </div>
            <div className="w-5/6 p-0.5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] mb-0.5">Deskripsi</span>
              <span className="text-[10px] font-bold leading-tight">{asset.assetName}</span>
            </div>
          </div>
        </div>
        
        {/* Logo Right */}
        <div className="w-1/5 flex flex-col items-center justify-center p-1">
          <img src="/img/hcml-logo.png" className="w-10 h-10 mb-0.5" alt="HCML Logo" />
          <div className="text-[10px] text-center font-bold mb-1 leading-tight">HCML</div>
          {qrUrl && (
            <img src={qrUrl} className="w-[50px] h-[50px]" alt="QR Code" />
          )}
        </div>
      </div>
      
      {/* Warning */}
      <div className="bg-orange-400 text-red-600 font-bold text-center text-[11px] py-0.5 flex-grow flex items-center justify-center leading-tight">
        DILARANG MELEPAS / MENGECAT LABEL INI
      </div>
    </div>
  );
}; 