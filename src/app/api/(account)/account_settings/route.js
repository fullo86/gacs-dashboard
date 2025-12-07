import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/users/User";
import { compare } from "bcrypt";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { first_name, last_name, email, phone, password } = body;

    const user = await User.findOne({ where: { id: session.user.id } });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cmprepswd = await compare(password, user.password)
    if (!password || !cmprepswd) {
      return new Response(JSON.stringify({ error: "Please check the password" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });      
    }

    await user.update({
      first_name,
      last_name,
      email,
      phone,
    });

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
