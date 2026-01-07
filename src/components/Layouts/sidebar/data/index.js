import { signOut } from "next-auth/react";
import * as Icons from "../icons";

export const getNavData = (active_trx) => {
  let items = [];

  items.push({
    title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
  });

  if (active_trx === 1) {
    items.push(
      {
        title: "Devices",
        url: "/devices",
        icon: Icons.SwitchIcon,
        items: [],
      },
      {
        title: "Maps",
        url: "/maps",
        icon: Icons.MapIcon,
        items: [],
      },
      {
        title: "Configuration",
        icon: Icons.Alphabet,
        items: [
          { title: "ACS Configuration", url: "/acs-configuration" },
          { title: "MikroTik Configuration", url: "/mikrotik-configuration" },
          { title: "BOT Configuration", url: "/bot-configuration" },
        ],
      }
    );
  }else{
      items.push({
      title: "Service",
      url: "/service",
      icon: Icons.DigitalServiceIcon,
      items: [],
    });
  }

  items.push({
    title: "Sign Out",
    icon: Icons.Authentication,
    action: () => signOut({ callbackUrl: "/auth/sign-in" }),
    items: [],
  });

  return [
    {
      label: "MAIN MENU",
      items,
    },
  ];
};
