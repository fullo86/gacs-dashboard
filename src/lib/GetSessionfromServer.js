// const { authOptions } = require("@/app/api/auth/[...nextauth]/route");
// const { getServerSession } = require("next-auth");

// export const GetSessionFromServer = async () => {
//     const session = await getServerSession(authOptions);
//     return session
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const GetSessionFromServer = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
