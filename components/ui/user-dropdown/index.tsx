import { User2, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/stores/store-user-login";

export default function UserDropDown({isCompact = false} : {isCompact?: boolean}) {
  const { email, name, role } = useUserStore();
  
  return (
    <div className="dropdown dropdown-end dropdown-hover cursor-pointer h-full w-full">
      <div
        tabIndex={0}
        role="button"
        className="flex flex-col gap-6 items-center justify-start py-8 rounded-lg w-full p-2"
      >
        <div className="bg-amber-600 w-10 h-10 rounded-full p-2">
          {name ? (
            <div className="flex items-center justify-center text-white text-lg font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User2 className="text-white" />
          )}
        </div>

        {!isCompact && 
        <div className="flex flex-col gap-1 items-center">
          <p className="h-4 text-gray-700 text-lg flex items-center gap-2 mb-1">
            {name}
          </p>
          <div className="h-4 text-xs flex items-center gap-1">
            <div className="flex rounded-full items-center bg-green-100 text-green-500 py-[2px] px-2">
              <ShieldCheck size={16} /> {role}
            </div>
          </div>
        </div>}
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
  );
}