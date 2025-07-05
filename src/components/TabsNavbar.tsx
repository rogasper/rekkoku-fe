"use client";
import { Tabs, Tab } from "@heroui/react";
import { MapPinIcon, TrendingUpIcon, UtensilsCrossedIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
    <div className={`${className}`} {...props}>
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
              <UtensilsCrossedIcon />
              <span>Feed</span>
            </div>
          }
        />
        <Tab
          key="/nearby"
          title={
            <div className="flex items-center space-x-2">
              <MapPinIcon />
              <span>Nearby</span>
            </div>
          }
        />
        <Tab
          key="/top-places"
          title={
            <div className="flex items-center space-x-2">
              <TrendingUpIcon />
              <span>Top Places</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default TabsNavbar;
