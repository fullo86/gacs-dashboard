import bcrypt from "bcryptjs";
import User from "@/models/users/User";
import { ResetPasswordSchema } from "@/lib/validation";
import { Op } from "sequelize";
import PasswordReset from "@/models/reset_password/ResetPassword";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = ResetPasswordSchema.parse(body);

    // Cari token yang valid
    const reset = await PasswordReset.findOne({
      where: {
        token,
        used: false,
        expires: { [Op.gt]: new Date() },
      },
      include: User,
    });

    if (!reset) {
      return new Response(
        JSON.stringify({ message: "Token Expired" }),
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    reset.User.password = hashed;
    await reset.User.save();

    reset.used = true;
    await reset.save();

    return new Response(
      JSON.stringify({ status: true, message: "Password Successfully Changed" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { status: 400 });
    }
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
