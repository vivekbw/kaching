import { HiOutlineSparkles } from "react-icons/hi2";
import { BarChartIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { PiChatTeardropTextLight } from "react-icons/pi";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-8 mt-8">
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => onTabChange("Line Chart")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Line Chart"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <BarChartIcon />
          Overview
          {activeTab === "Line Chart" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => onTabChange("Categories")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Categories"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <HiOutlineSparkles className="w-4 h-4" />
          Spending Categories
          {activeTab === "Categories" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => onTabChange("Chatbot")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Chatbot"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <PiChatTeardropTextLight className="w-4 h-4" />
          AI Chatbot
          {activeTab === "Chatbot" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
      </div>
    </div>
  );
}
