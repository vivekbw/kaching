"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Theme, Button, Flex } from "@radix-ui/themes";
import {
  ExitIcon,
  UploadIcon,
  ReloadIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  HamburgerMenuIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuItemClick = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const handleUploadClick = () => {
    setIsOpen(false);
    window.open(
      "https://vivek.usw-18.palantirfoundry.com/workspace/module/view/latest/ri.workshop.main.module.39d5ca71-4863-4cfe-8eb2-036312131bcd",
      "_blank"
    );
  };

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

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <HamburgerMenuIcon className="w-5 h-5" />
          </button>
        </Dialog.Trigger>

        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-lg z-50"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}>
                  <div className="p-3 flex justify-between items-center border-b">
                    <Dialog.Title className="text-base font-semibold">
                      Menu
                    </Dialog.Title>
                    <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                      <Cross2Icon className="w-4 h-4" />
                    </Dialog.Close>
                  </div>

                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-500 px-2 mb-2 uppercase tracking-wider">
                      Manage Transactions
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleMenuItemClick(onSearchClick)}
                        className="flex items-center gap-2 w-full p-2 text-sm text-left rounded-lg hover:bg-gray-100 transition-colors">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>Search Transactions</span>
                      </button>

                      <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 w-full p-2 text-sm text-left rounded-lg hover:bg-gray-100 transition-colors">
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload Transactions</span>
                      </button>

                      <button
                        onClick={() => handleMenuItemClick(onReloadClick)}
                        className="flex items-center gap-2 w-full p-2 text-sm text-left rounded-lg hover:bg-gray-100 transition-colors">
                        <ReloadIcon className="w-4 h-4" />
                        <span>Reload Transactions</span>
                      </button>

                      <button
                        onClick={() => handleMenuItemClick(onCreateClick)}
                        className="flex items-center gap-2 w-full p-2 text-sm text-left rounded-lg hover:bg-gray-100 transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        <span>Create Transaction</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
} 