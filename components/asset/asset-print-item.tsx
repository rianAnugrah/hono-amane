import { QRCodeCanvas } from "qrcode.react";
import { Asset } from "../../pages/(protected)/asset/types";
import { Circle } from "lucide-react";
import { formatDate } from "@/components/utils/formatting";

export default function AssetPrintItem({
  asset,
}: {
  asset: Asset;
}) {
  return (
    <div className="grid grid-cols-10  grid-rows-5  w-[800px]">
      <div className="border-y border-l row-span-4 col-span-2 flex items-center justify-center">
        <img src="/img/skk-migas-logo.png" className="w-24" />
      </div>
      <div className="border bg-[#c0d736] col-span-6 row-span-4 grid grid-cols-6 grid-rows-3">
        <div className="border-b border-r col-span-5 text-xl font-bold flex items-center justify-center">
          <p>BARANG MILIK NEGARA</p>
        </div>
        <div className=" border-b col-span-1 flex items-center justify-evenly flex-col">
          <p className="w-full text-center">Type</p>
          <p className="font-bold">{asset.projectCode?.code}</p>
        </div>
        <div className="border-b border-r col-span-3 flex items-center justify-evenly flex-col">
          <p>Nomor Sinas</p>
          <p className="font-bold">{asset.assetNo}</p>
        </div>
        <div className="border-b border-r col-span-2 flex items-center justify-evenly flex-col">
          <p className="w-full text-center">Tahun Ip</p>
          <p className="font-bold">{formatDate(asset.pisDate)}</p>
        </div>
        <div className=" col-span-1  row-span-2 flex flex-col items-center justify-evenly">
          <p>Ket :</p>

         
          <p><Circle /></p>
        </div>
        <div className="border-r col-span-5 flex items-center justify-evenly flex-col">
          <p>Deskripsi</p>
          <p className="font-bold">{asset.assetName}</p>
        </div>
      </div>
      <div className="border-y border-r row-span-2  col-span-2 flex items-center justify-center">
        <img src="/img/hcml-logo.png" className="w-24" />
      </div>
      <div className="border-b border-r row-span-2  col-span-2 flex items-center justify-center p-4">
        <QRCodeCanvas value={asset.assetNo} size={100} className="rounded-lg" />
      </div>
      <div className="border-x border-b border-black col-span-10 font-bold text-center text-xl flex items-center justify-center bg-orange-300 text-red-600">
        DILARANG MELEPAS / MENGECAT LABEL INI
      </div>
    </div>
  );
}
