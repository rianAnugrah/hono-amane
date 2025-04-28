import { Bell, LocateIcon, User2 } from "lucide-react";
import Badge from "../badge";
import Logo from "@/components/svg/logo";
import { useUserStore } from "@/stores/store-user-login";

export default function TopBar() {
  const { email, name, role , location} = useUserStore();
  return (
    <nav className=" relative z-20 ">
      <div className="w-full mx-auto px-4 ">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-grow hidden md:flex items-center gap-2 justify-start ">
            <div className="h-[2rem] w-[2rem]">
              <Logo />
            </div>
            <div className="text-white text-2xl">Asset Management</div>
          </div>
          <div className="hidden md:flex mx-4">
            <Notifications />
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-amber-600 w-10 h-10 rounded-full p-2">
              <User2 className=" text-white" />
            </div>
            <div className="flex flex-col gap-0">
              <p className="  h-4 text-white text-lg flex items-center gap-2 mb-1">
                {name} <Badge text={role} color="green" />
              </p>
              <p className="  h-4 text-gray-300 text-xs flex items-center gap-1">
                <LocateIcon className="w-3" /> {location?.description}
                {/* {email} */}
              </p>
            </div>
          </div>

          <div className="flex md:hidden">
            <Notifications />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Notifications() {
  return (
    <button
      //   onClick={() => setMenuOpen(true)}
      className="text-gray-300 hover:text-orange-600 cursor-pointer text-2xl focus:outline-none hover:bg-orange-200 rounded-lg border-none p-2"
      aria-label="Open menu"
    >
      <Bell />
    </button>
  );
}
