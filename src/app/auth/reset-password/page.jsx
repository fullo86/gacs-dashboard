import { redirect } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";
import { validateResetToken } from "@/lib/helper";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token;
  console.log("token:", token);

  if (!token) {
    redirect("/auth/sign-in"); // jika query param tidak ada
  }

  const isValid = await validateResetToken(token);

  if (!isValid) {
    redirect("/auth/sign-in"); // jika token tidak valid
  }

  return <ResetPasswordForm token={token} />;
}
