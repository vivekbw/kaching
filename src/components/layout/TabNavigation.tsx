import { HiOutlineSparkles } from "react-icons/hi2";
import { BarChartIcon } from "@radix-ui/react-icons";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-8 mt-8">
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => onTabChange("overview")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "overview"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <BarChartIcon />
          Overview
          {activeTab === "overview" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => onTabChange("insights")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "insights"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <HiOutlineSparkles className="w-4 h-4" />
          AI Insights
          {activeTab === "insights" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
      </div>
    </div>
  );
}
