"use client";

import logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
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
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface formValues {
  email: string;
  password: string;
}
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: any) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Error",
          description: "Invalid email or password. Please try again.",
          duration: 2000,
          variant: "destructive",
        });
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred. Please try again.");
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
            <span className="text-luxtix-6 font-bold">Sign in</span> for
            personalized recommendations today!
          </p>
        </div>
      </div>
      <div className="w-full bg-white p-10 sm:p-24 flex flex-col justify-center sm:rounded-l-3xl">
        <div className="">
          <div className="hidden sm:flex justify-end mb-4">
            <Link href="/" className="btn-anim text-luxtix-8 font-bold">
              <AiOutlineArrowLeft size={25} />
            </Link>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">
            Login
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail Address</FormLabel>
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

              <Button
                type="submit"
                className="w-full bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2"
              >
                Login
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-luxtix-7">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-luxtix-8 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
