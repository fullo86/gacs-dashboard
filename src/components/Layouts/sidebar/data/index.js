import { signOut } from "next-auth/react";
import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      // {
      //   title: "Dashboard",
      //   icon: Icons.HomeIcon,
      //   items: [
      //     {
      //       title: "eCommerce",
      //       url: "/",
      //     },
      //   ],
      // },
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
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
          {
            title: "ACS Configuration",
            url: "/acs-configuration",
          },
          {
            title: "MikroTik Configuration",
            url: "/mikrotik-configuration",
          },
          {
            title: "BOT Configuration",
            url: "/bot-configuration",
          },
        ],
      },
      {
        title: "Sign Out",
        icon: Icons.Authentication,
        action: () => signOut({ callbackUrl: "/auth/sign-in" }),
        // onClick: () => signOut(),
        items: [],
      },
    ],
  },
];

