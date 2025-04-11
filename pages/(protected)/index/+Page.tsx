import DashboardCharts from "@/components/blocks/dashboard-charts";
import { Link } from "@/renderer/Link";
import {
  Archive,
  BookCopy,
  Box,
  DollarSign,
  MapPin,
  PlusCircle,
  ScanQrCode,
} from "lucide-react";
import React from "react";

export function Page() {
  return (
    <div className="w-full flex flex-col p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 w-full gap-4">
        <Link
          href="/asset/create"
          className="relative shadow-md group bg-[#fdfdfd] items-center overflow-hidden from-gray-200 text-2xl rounded-xl to-white p-6 flex text-black gap-2"
        >
          <img
            src="/img/add-new-asset.jpg"
            alt="Scan Asset"
            className="h-[10rem] absolute top-0 right-0 z-0 opacity-100 group-hover:opacity-70 group-hover:scale-125 group-hover:-rotate-12 transition-all"
          />
          <div className="z-10 w-[20rem] flex flex-col group-hover:text-gray-600 transition-all">
            <PlusCircle className="w-[2rem] h-[2rem] mb-2" />
            <p className="text-xl font-bold  text-left">Add new asset</p>
            <p className="text-sm text-left">Register new asset</p>
          </div>
        </Link>
        <Link href="/qr-scanner" className="relative shadow-md cursor-pointer bg-[#ada5e9] group items-center overflow-hidden from-gray-200 text-2xl rounded-xl to-white p-6 flex text-white gap-2 transition-all">
          <img
            src="/img/scan-asset.jpg"
            alt="Scan Asset"
           className="h-[10rem] absolute top-0 right-0 z-0 opacity-100 group-hover:opacity-70 group-hover:scale-125 group-hover:-rotate-12 transition-all"
          />
          <div className="z-10 w-[20rem] flex flex-col group-hover:text-gray-200 transition-all">
            <ScanQrCode className="w-[2rem] h-[2rem] mb-2" />
            <p className="text-xl font-bold  text-left">Scan asset</p>
            <p className="text-sm text-left">View and search asset detail</p>
          </div>
        </Link>
      </div>

      <h3 className="font-bold text-left mt-8 mb-4 text-2xl text-gray-800">
        Overview
      </h3>

      <div className="grid grid-cols-2 xl:grid-cols-4 w-full  gap-4">
        <DashboardItem
          title="Assets"
          value={2348}
          href="/asset"
          buttonLabel="View all asset"
          icon={<Archive />}
        />

        <DashboardItem
          title="Categories"
          value={18}
          href="/category"
          buttonLabel="Manage category"
          icon={<BookCopy />}
        />

        <DashboardItem
          title="Locations"
          value={8}
          href="/location"
          buttonLabel="Manage location"
          icon={<MapPin />}
        />

        <DashboardItem
          title="Total Acquisition value (Rp)"
          value={<p className=" font-normal"><span className="font-bold">271</span>B</p>}
          href="/report"
          buttonLabel="Generate report"
          icon={<DollarSign />}
        />
      </div>

      <DashboardCharts />
    </div>
  );
}

function DashboardItem({
  title,
  value,
  href,
  buttonLabel,
  icon,
}: {
  title: string;
  value: string | number |  React.ReactElement;
  href: string;
  buttonLabel: string;
  icon?: React.ReactElement;
}) {
  return (
    <div className="w-full group shadow-md rounded-xl bg-gray-200 border border-gray-300 p-2 flex flex-col items-end gap-2">
      <div className="flex relative flex-col rounded-lg border border-gray-300 overflow-hidden bg-white p-4 w-full">
        <h4 className="text-sm text-gray-500 mb-2 z-10">{title}</h4>
        <p className="font-bold text-5xl text-gray-700 z-10">{value}</p>
        {icon ? (
          React.cloneElement(icon, {
            className: `absolute z-0 transition-all ease-out duration-200  top-0 -right-5 -rotate-12 text-gray-100 w-[8rem] h-[8rem] group-hover:text-orange-200 group-hover:scale-110 group-hover:-rotate-25 ${
              icon.props.className || ""
            }`,
          })
        ) : (
          <Box className="absolute top-0 -right-5 -rotate-12 text-gray-100 w-[8rem] h-[8rem]" />
        )}
      </div>

      <a className="btn btn-primary btn-ghost" href={href}>
        {buttonLabel}
      </a>
    </div>
  );
}
