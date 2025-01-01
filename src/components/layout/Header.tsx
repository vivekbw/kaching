"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Theme, Button, Flex } from "@radix-ui/themes";
import {
  ExitIcon,
  UploadIcon,
  ReloadIcon,	
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./styles.css";

interface HeaderProps {
  onSearchClick: () => void;
  onReloadClick: () => void;
  onCreateClick: () => void;
}

export function Header({
  onSearchClick,
  onReloadClick,
  onCreateClick,
}: HeaderProps) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 flex w-full justify-between items-center bg-white/85 backdrop-blur-sm shadow-sm z-10 px-4">
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link className="NavigationMenuLink" href="/">
              <div className="flex items-center gap-2 py-4">
                <Image
                  src="/money_face.svg"
                  alt="Money Face"
                  width={24}
                  height={24}
                />
                <span className="text-xl font-bold text-black">kaching</span>
              </div>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <Flex gap="4" align="center">
        <Button
          onClick={onSearchClick}
          className="bg-white text-black hover:bg-gray-100 transition-colors"
          style={{
            transition: "transform 0.2s ease-in-out",
            boxShadow: "0.2s ease-in-out",
          }}>
          <MagnifyingGlassIcon />
          Search Transactions
        </Button>
        <Button
          onClick={() =>
            window.open(
              "https://vivek.usw-18.palantirfoundry.com/workspace/module/view/latest/ri.workshop.main.module.39d5ca71-4863-4cfe-8eb2-036312131bcd",
              "_blank"
            )
          }
          className="bg-white text-black hover:bg-gray-100 transition-colors"
          style={{
            transition: "transform 0.2s ease-in-out",
            boxShadow: "0.2s ease-in-out",
          }}>
          <UploadIcon />
          Upload Transactions
        </Button>
        <Button
          onClick={onReloadClick}
          className="bg-white text-black hover:bg-gray-100 transition-colors"
          style={{
            transition: "transform 0.2s ease-in-out",
            boxShadow: "0.2s ease-in-out",
          }}>
          <ReloadIcon />
          Reload Transactions
        </Button>
        <Button
          onClick={onCreateClick}
          className="bg-white text-black hover:bg-gray-100 transition-colors"
          style={{
            transition: "transform 0.2s ease-in-out",
            boxShadow: "0.2s ease-in-out",
          }}>
          <PlusIcon />
          Create Transaction
        </Button>
      </Flex>
    </div>
  );
} 