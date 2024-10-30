"use client";

import logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaUserTie } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const userSchema = z.object({
  displayName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referral: z.string().optional().default(""),
});

const organizerSchema = z.object({
  displayName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referral: z.string().optional().default(""),
});

function SignUp() {
  const [registrationType, setRegistrationType] = useState<
    "USER" | "ORGANIZER"
  >("USER");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(
      registrationType === "USER" ? userSchema : organizerSchema
    ),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      referral: "",
    },
  });

  const handleTypeChange = (type: "USER" | "ORGANIZER") => {
    setRegistrationType(type);
    form.reset();
  };

  const onSubmit = async (
    data: z.infer<typeof userSchema> | z.infer<typeof organizerSchema>
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            role: registrationType === "USER" ? "USER" : "ORGANIZER",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      router.push("/sign-in");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-black">
      <div className="w-full sm:w-1/3 bg-black text-white p-8 flex flex-col justify-center sm:justify-center items-center sm:items-center">
        <div className="mb-8 text-center sm:text-left">
          <Image
            src={logo}
            alt="Luxtix Logo"
            className="mb-4 mx-auto sm:mx-0 size-24"
          />
          <h1 className="text-3xl font-bold">Discover tailored events.</h1>
          <p className="text-xl mt-2">
            <span className="text-luxtix-6 font-bold">Sign up</span> for
            personalized recommendations today!
          </p>
        </div>
      </div>

      <div className="w-full bg-white p-10 sm:p-24 flex flex-col justify-center sm:rounded-l-3xl">
        <div>
          <div className="hidden sm:flex justify-end mb-4">
            <Link href="/" className="btn-anim text-luxtix-8 font-bold">
              <AiOutlineArrowLeft size={25} />
            </Link>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">
            Create Account
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-6">
                <FormLabel>Register As:</FormLabel>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("USER")}
                    className={`flex-1 p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center ${
                      registrationType === "USER"
                        ? "border-luxtix-5"
                        : "border-luxtix-7"
                    }`}
                  >
                    <FaUser size={30} className="mb-2" />
                    <span className="text-luxtix-1">User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("ORGANIZER")}
                    className={`flex-1 p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center ${
                      registrationType === "ORGANIZER"
                        ? "border-luxtix-5"
                        : "border-luxtix-7"
                    }`}
                  >
                    <FaUserTie size={30} className="mb-2" />
                    <span className="text-luxtix-1">Organizer</span>
                  </button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {registrationType === "USER"
                        ? "Full Name"
                        : "Company Name"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          registrationType === "USER"
                            ? "Enter your name"
                            : "Enter your company name"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {registrationType === "USER"
                        ? "E-mail Address"
                        : "Company E-mail Address"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {registrationType === "USER" && (
                <FormField
                  control={form.control}
                  name="referral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter referral" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-luxtix-7">
            Already have an account?{" "}
            <Link href="./sign-in" className="text-luxtix-8 font-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
