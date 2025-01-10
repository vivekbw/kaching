import { HiOutlineSparkles } from "react-icons/hi2";
import {
  BarChartIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { PiChatTeardropTextLight } from "react-icons/pi";
import { HiOutlineWallet } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TbLayoutDashboard } from "react-icons/tb";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0 });
  const tabRefs = {
    Dashboard: useRef<HTMLButtonElement>(null),
    Accounts: useRef<HTMLButtonElement>(null),
    "Line Chart": useRef<HTMLButtonElement>(null),
    Categories: useRef<HTMLButtonElement>(null),
    Budget: useRef<HTMLButtonElement>(null),
    Chatbot: useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    const activeTabElement =
      tabRefs[activeTab as keyof typeof tabRefs]?.current;
    if (activeTabElement) {
      const { offsetWidth, offsetLeft } = activeTabElement;
      setIndicatorStyle({ width: offsetWidth, x: offsetLeft });
    }
  }, [activeTab]);

  return (
    <div className="mb-8 mt-6">
      <div className="flex gap-8 border-b border-gray-200 relative">
        <button
          ref={tabRefs["Dashboard"]}
          onClick={() => onTabChange("Dashboard")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Dashboard"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <TbLayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          ref={tabRefs["Line Chart"]}
          onClick={() => onTabChange("Line Chart")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Line Chart"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <BarChartIcon />
          Overview
        </button>
        <button
          ref={tabRefs["Accounts"]}
          onClick={() => onTabChange("Accounts")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Accounts"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <HiOutlineBuildingLibrary className="w-4 h-4" />
          Accounts
        </button>
        <button
          ref={tabRefs["Budget"]}
          onClick={() => onTabChange("Budget")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Budget"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <HiOutlineWallet className="w-4 h-4" />
          Budget
        </button>
        <button
          ref={tabRefs["Categories"]}
          onClick={() => onTabChange("Categories")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Categories"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <HiOutlineSparkles className="w-4 h-4" />
          Spending Categories
        </button>
        <button
          ref={tabRefs["Chatbot"]}
          onClick={() => onTabChange("Chatbot")}
          className={`px-4 py-2 flex items-center gap-2 relative ${
            activeTab === "Chatbot"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          <PiChatTeardropTextLight className="w-4 h-4" />
          AI Chatbot
        </button>
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-black"
          layoutId="activeTab"
          initial={false}
          animate={{
            width: indicatorStyle.width,
            x: indicatorStyle.x,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
}
