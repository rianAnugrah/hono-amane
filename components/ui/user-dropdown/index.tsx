import { User2, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/stores/store-user-login";

export default function UserDropDown() {
  const {  name, role } = useUserStore();

  return (
    <div className="dropdown dropdown-end dropdown-hover cursor-pointer h-full w-full">
      <div
        tabIndex={0}
        role="button"
        className="flex flex-col gap-4 items-center justify-start py-4 rounded-lg w-full p-2"
      >
        <div className="bg-amber-600 w-16 h-16 rounded-full p-2 flex items-center justify-center overflow-hidden">
          {name ? (
            <div className="flex items-center justify-center text-white text-2xl font-bold w-full h-full">
              {name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User2 className="text-white w-full h-full" />
          )}
        </div>

        <div className="flex flex-col gap-1 items-center text-center w-full">
          <p className="text-gray-700 text-lg text-center truncate w-full px-1">
            {name}
          </p>
          <div className="text-xs flex items-center justify-center">
            <div className="flex rounded-full items-center bg-green-100 text-green-500 py-[2px] px-2 gap-1">
              {role === "admin" && <ShieldCheck size={16} />}
              <span className="truncate">
                {role === 'admin' ? 'Admin' : role === 'pic' ? 'PIC' : role === 'read_only' ? 'Read only' : role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
