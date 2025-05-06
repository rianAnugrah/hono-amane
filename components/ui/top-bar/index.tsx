import {
  Bell,
  ChevronDown,
  LocateIcon,
  Pin,
  User2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Badge from "../badge";
import Logo from "@/components/svg/logo";
import { useUserStore } from "@/stores/store-user-login";

export default function TopBar() {
  const { email, name, role, location } = useUserStore();
  return (
    <nav className=" relative z-20 ">
      <div className="w-full mx-auto px-4 ">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-grow hidden md:flex items-center gap-2 justify-start ">
            {/* <div className="h-[2rem] w-[2rem]">
              <Logo />
            </div> */}
            <div>
              <div className="text-white text-2xl">Asset Management</div>
              {location?.length > 0 ? (
                <LocationDisplay size={3} location={location} />
              ) : (
                ""
              )}
            </div>
          </div>
          {/* <div className="hidden md:flex mx-4">
            <Notifications />
          </div> */}

          <div className="dropdown dropdown-end dropdown-hover cursor-pointer">
            <div
              tabIndex={0}
              role="button"
              className="flex gap-4 items-center   rounded-lg hover:bg-gray-700 w-[18rem] p-2"
            >
             
              <div className="flex flex-grow flex-col gap-1 items-end">
                <p className="  h-4 text-white text-lg flex items-center gap-2 mb-1">
                  {name}
                </p>
                <p className="  h-4  text-xs flex items-center gap-1">
                  <div className="flex rounded-full items-center bg-green-100 text-green-500 py-[2px] px-2">

                  <ShieldCheck size={16}/> {role}
                  </div>
                </p>
              </div>
              <div className="bg-amber-600 w-10 h-10 rounded-full p-2">
                <User2 className=" text-white" />
              </div>

              <div>
                <ChevronDown className="text-white" />
              </div>
            </div>
            {/* <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>Location Access</li>
              <li>
                <p>Item 1</p>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul> */}
          </div>

          {/* <div className="flex md:hidden">
            <Notifications />
          </div> */}
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

const LocationDisplay = ({
  location,
  size = 2,
}: {
  location: any;
  size: number;
}) => {
  return (
    <div className="flex gap-1 items-center">
      {location.slice(0, size).map((loc: any, index: number) => (
        <Badge
          key={index}
          text={
            <span className="flex gap-1 items-center">
              <MapPin size={12} />
              {loc?.location?.description}
            </span>
          }
          color="gray"
        />
      ))}

      {location.length > size && (
        <div className="">
          <div className="dropdown dropdown-end w-full h-full cursor-pointer hover:font-bold">
            <div tabIndex={0} role="button" className="">
              <span className="bg-gray-50 rounded-full w-5 h-5 text-xs p-1">+{location.length - size}</span>
            </div>
            <div
              tabIndex={0}
              className="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm"
            >
              <div tabIndex={0} className="card-body">
                <h2 className="card-title">Your location access</h2>
                {location
                  .slice(size, location.length)
                  .map((loc: any, index: number) => (
                    <Badge
                      key={index}
                      text={
                        <span className="flex gap-1 items-center">
                          <MapPin size={12} />
                          {loc?.location?.description}
                        </span>
                      }
                      color="gray"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
