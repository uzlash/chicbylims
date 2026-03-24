'use client'

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        const message = result.error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : result.error;
        setError(message);
        toast.error(message);
      } else {
        toast.success("Signed in successfully!");
        router.push("/my-account");
        router.refresh();
      }
    } catch (err) {
      const message = "An error occurred. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signin"} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Sign In to Your Account
              </h2>
              <p>Enter your detail below</p>
            </div>

            <div>
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-lg border border-red-light-4 bg-red-light-6 px-4 py-3 text-red text-custom-sm"
                >
                  <svg
                    className="mt-0.5 flex-shrink-0"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="flex-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="flex-shrink-0 rounded p-1 hover:bg-red-light-4 focus:outline-none focus:ring-2 focus:ring-red"
                    aria-label="Dismiss error"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                    </svg>
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign in to account"}
                </button>

                <p className="text-center mt-6">
                  Don&apos;t have an account?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign Up Now!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
