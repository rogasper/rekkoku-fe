"use client";
import { Tabs, Tab } from "@heroui/react";
import { MapPinHouseIcon, MapPinIcon, TrendingUpIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

type TabsNavbarProps = React.HTMLAttributes<HTMLDivElement>;

const TabsNavbar: React.FC<TabsNavbarProps> = ({
  className = "",
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSelectionChange = (key: React.Key) => {
    router.push(key as string);
  };
  return (
    <>
      {pathname !== "/search" && pathname !== "/about" && (
        <div
          className={`${className}  backdrop-blur-sm shadow-lg border-b rounded-xl border-gray-200/50 sticky top-0 z-30`}
          {...props}
        >
          <Tabs
            aria-label="Options"
            color="warning"
            variant="bordered"
            classNames={{
              cursor: "w-full bg-[#EA7B26]",
              tabContent: "group-data-[selected=true]:text-white",
            }}
            fullWidth
            size="lg"
            selectedKey={pathname}
            onSelectionChange={handleSelectionChange}
          >
            <Tab
              key="/"
              title={
                <div className="flex items-center space-x-2">
                  <MapPinHouseIcon />
                  <span className="text-sm sm:text-base">Feed</span>
                </div>
              }
            />
            <Tab
              key="/nearby"
              title={
                <div className="flex items-center space-x-2">
                  <MapPinIcon />
                  <span className="text-sm sm:text-base">Nearby</span>
                </div>
              }
            />
            <Tab
              key="/top-places"
              title={
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon />
                  <span className="text-sm sm:text-base">Top Places</span>
                </div>
              }
            />
          </Tabs>
        </div>
      )}
    </>
  );
};

export default TabsNavbar;
