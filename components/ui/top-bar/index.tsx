import { Menu } from "lucide-react";
import UserDropDown from "@/components/ui/user-dropdown";
import LocationDisplay from "@/components/ui/location-display";

export default function TopBar() {
  return (
    <nav className="w-full relative z-[2]">
      <div className="mx-auto px-4 hidden md:flex justify-between h-20 items-center w-full border-gray-200">
        <div className="flex-grow items-center gap-2 justify-start">
          {/* <div className="h-[2rem] w-[2rem]">
            <Logo />
          </div> */}
          <div>
            <div className="text-gray-700 text-2xl">Asset Management</div>
          </div>
        </div>
        
        <div className="flex flex-grow"></div>
        <UserDropDown />
      </div>
      
      <div className="hidden md:flex border-gray-200 py-0 px-4">
        <LocationDisplay size={3} />
      </div>

      <div className="flex md:hidden text-gray-700 px-4 py-6">
        <p className="text-lg">Asset Management</p>
        <div className="flex flex-grow">&nbsp;</div>
        <Menu />
      </div>
    </nav>
  );
}
