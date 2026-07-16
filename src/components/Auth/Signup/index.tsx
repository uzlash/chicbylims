'use client'

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create account");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/signin");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-16 xl:py-20">
        <div className="section-container">
          <div className="mx-auto w-full max-w-[480px] border border-cream-dark bg-white p-6 sm:p-10 xl:p-12">
            <div className="mb-10 text-center">
              <h2 className="heading-serif text-display-3 mb-2">
                Create an Account
              </h2>
              <p className="text-custom-sm text-body">Join Chicbylims — enter your details below</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-cream-dark bg-white py-3 px-4 text-custom-sm text-dark outline-none duration-200 placeholder:text-dark-4 focus:border-dark"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-cream-dark bg-white py-3 px-4 text-custom-sm text-dark outline-none duration-200 placeholder:text-dark-4 focus:border-dark"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
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
                    className="w-full border border-cream-dark bg-white py-3 px-4 text-custom-sm text-dark outline-none duration-200 placeholder:text-dark-4 focus:border-dark"
                  />
                </div>

                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-type your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="on"
                    className="w-full border border-cream-dark bg-white py-3 px-4 text-custom-sm text-dark outline-none duration-200 placeholder:text-dark-4 focus:border-dark"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="mt-6 text-center text-custom-sm text-body">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="pl-2 font-medium text-dark underline-offset-4 duration-200 hover:text-blue hover:underline"
                  >
                    Sign in now
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

export default Signup;
