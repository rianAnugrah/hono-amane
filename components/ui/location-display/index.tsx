import { MapPin } from "lucide-react";
import Badge from "../badge";
import { useUserStore } from "@/stores/store-user-login";

interface LocationDisplayProps {
  size?: number;
  orientation?: "horizontal" | "vertical";
}

interface locInterface {
  description: string;
}

export default function LocationDisplay({ size = 2 , orientation = "horizontal" , }: LocationDisplayProps) {
  const { location } = useUserStore();

  console.log(location)
  
  return location?.length > 0 ? (
    <div className={`flex gap-1  ${orientation === "vertical" ? "flex-col items-start" : "flex-row items-center"}`}>
      {location.slice(0, size).map((loc: locInterface, index: number) => (
        <Badge
          key={index}
          variant="light"
          text={loc?.description}
          icon={<MapPin size={12} />}
          color="blue"
        />
      ))}

      {location.length > size && (
        <div className="">
          <div className="dropdown dropdown-end w-full h-full cursor-pointer hover:font-bold">
            <div tabIndex={0} role="button" className="">
              <span className="bg-gray-50 rounded-full flex gap-2 items-center h-5 text-xs p-1">
              <MapPin size={12} /> +{location.length - size}
              </span>
            </div>
            <div
              tabIndex={0}
              className="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm"
            >
              <div tabIndex={0} className="card-body">
                <h2 className="card-title">Your location access</h2>
                {location
                  .slice(size, location.length)
                  .map((loc: locInterface, index: number) => (
                    <Badge
                      key={index}
                      text={loc?.description}
                      icon={<MapPin size={12} />}
                      color="gray"
                      variant="light"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    ""
  );
} 