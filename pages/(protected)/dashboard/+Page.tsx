import DashboardCharts from "@/components/blocks/dashboard-charts";
import { formatUSDHuman } from "@/components/utils/formatting";
import { Link } from "@/renderer/Link";
import { useUserStore } from "@/stores/store-user-login";
import axios from "axios";
import {
  Archive,
  BookCopy,
  Box,
  DollarSign,
  MapPin,
  PlusCircle,
  ScanQrCode,
} from "lucide-react";
import React, { useState, useEffect } from "react";

export function Page() {
  interface DashboardStats {
    overview?: {
      totalAssets?: number;
      totalAcqValueIdr?: number;
      totalBookValue?: number;
    };
    categories: {
      totalCategories: number;
      data: Array<{ category: string; count: number }>;
    };
    locations: {
      totalLocations: number;
      data: Array<{ location: string; count: number }>;
    };
    conditions: {
      totalConditions: number;
      data: Array<{ condition: string; count: number }>;
    };
  }

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { role } = useUserStore();

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`/api/stats/all`);

      //console.log("Data", data);

      if (data.data) {
        setStats(data.data);
      } else {
        // Handle direct array response
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  ////console.log("STATS",stats)

  return (
    <div className="w-full flex flex-col p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 w-full gap-4">
        {role === "admin" && (
          <Link
            href="/asset/create"
            className="relative border border-gray-300 group bg-[#fdfdfd] items-center overflow-hidden from-gray-200 text-2xl rounded-xl to-white p-6 flex text-black gap-2"
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
        )}
        <Link
          href="/qr-scanner"
          className="relative border border-gray-300 cursor-pointer bg-[#ada5e9] group items-center overflow-hidden from-gray-200 text-2xl rounded-xl to-white p-6 flex text-white gap-2 transition-all"
        >
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

      <div className="grid grid-cols-2 xl:grid-cols-6 w-full  gap-4">
        <DashboardItem
          title="Assets"
          value={stats?.overview?.totalAssets || 0}
          href="/asset"
          buttonLabel="View all asset"
          icon={<Archive />}
        />

        <DashboardItem
          title="Categories"
          value={stats?.categories?.totalCategories || 0}
          href="/category"
          buttonLabel="Manage category"
          icon={<BookCopy />}
        />

        <DashboardItem
          title="Locations"
          value={stats?.locations?.totalLocations || 0}
          href="/location"
          buttonLabel="Manage location"
          icon={<MapPin />}
        />

        {stats?.types?.data?.map((type) => {
          return (
            <DashboardItem
              title={type.type}
              value={type.count}
              href="/asset"
              buttonLabel="Manage asset"
              icon={<MapPin />}
            />
          );
        })}

        <DashboardItem
          title="Total Acquisition value (USD)"
          value={
            stats?.overview?.totalBookValue
              ? formatUSDHuman(stats?.overview?.totalBookValue)
              : 0
          }
          href="/report"
          buttonLabel="Generate report"
          icon={<DollarSign />}
        />
      </div>

      <DashboardCharts stats={stats} />
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
  value: string | number | React.ReactElement;
  href: string;
  buttonLabel: string;
  icon?: React.ReactElement;
}) {
  const { role } = useUserStore();
  return (
    <div className="w-full group border border-gray-300 rounded-xl bg-gray-200 border border-gray-300 p-2 flex flex-col items-end gap-2">
      <div className="flex relative flex-col rounded-lg border border-gray-300 overflow-hidden bg-white p-4 w-full">
        <h4 className="text-sm text-gray-500 mb-2 z-10">{title}</h4>
        <div className="font-bold text-5xl text-gray-700 z-10">{value}</div>
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

      {role === "admin" && (
        <a className="btn btn-primary btn-ghost" href={href}>
          {buttonLabel}
        </a>
      )}
    </div>
  );
}
