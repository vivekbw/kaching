"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Theme, Button, Flex } from "@radix-ui/themes";
import { ExitIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import { BiDollar } from "react-icons/bi";
import { getAuth } from "@/lib/client";
import { useRouter } from "next/navigation";
import "./styles.css";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await getAuth().signOut();
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex w-full justify-center bg-white shadow-sm z-10">
      <Theme>
        <NavigationMenu.Root className="NavigationMenuRoot">
          <NavigationMenu.List className="NavigationMenuList">
            <NavigationMenu.Item>
              <NavigationMenu.Link className="NavigationMenuLink" href="/">
                <div className="flex items-center gap-2">
                  <BiDollar className="w-6 h-6 text-black-500" />
                  <span className="text-xl text-black text-transparent bg-clip-text">
                    kaching
                  </span>
                </div>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </Theme>
    </div>
  );
} 