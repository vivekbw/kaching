import {
  ChatBubbleIcon,
  BarChartIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      name: "Line Chart",
      icon: <BarChartIcon className="w-4 h-4" />,
    },
    {
      name: "Categories",
      icon: <PieChartIcon className="w-4 h-4" />,
    },
    {
      name: "Chatbot",
      icon: <ChatBubbleIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.name
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}>
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
