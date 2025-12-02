import Link from "next/link";
import SignUproot from "../Signuproot";

export default function Signup() {
  return (
    <>
      <div className="mt-6 min-w-full text-center">
        <SignUproot />

        <p>
          Have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
