"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { AiFillCamera } from "react-icons/ai";
import ProfileSideMenu from "../ProfileSideMenu";
import { useUserProfile } from "@/hooks/useUserProfile";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const formSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  email: z.string().email(),
  referralCode: z.string(),
});

function Profile() {
  const { userProfile } = useUserProfile();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState(
    session?.user?.image || DEFAULT_AVATAR
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  console.log(userProfile);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: session?.user?.name || "",
      phoneNumber: "",
      email: session?.user?.email || "",
      referralCode: userProfile?.referralCode || "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.setValue(
        "displayName",
        userProfile.displayName || session?.user?.name || ""
      );
      form.setValue("phoneNumber", userProfile.phoneNumber || "");
      form.setValue("email", userProfile.email || session?.user?.email || "");
      form.setValue("referralCode", userProfile.referralCode || "");
      setAvatarPreview(
        userProfile.avatar || session?.user?.image || DEFAULT_AVATAR
      );
    }
  }, [userProfile, session, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("displayName", values.displayName);
      formData.append("phoneNumber", values.phoneNumber);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
          headers,
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ProfileSideMenu />
      <main className="w-3/4 p-2 sm:p-10">
        <h1 className="text-2xl font-bold mb-8">Account Information</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer"
              >
                <AiFillCamera />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="">
              Referral Code
              <div>{userProfile && userProfile.referralCode}</div>
            </div>

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-luxtix-6 text-luxtix-1 py-2 px-4 rounded hover:bg-luxtix-2"
            >
              Save My Profile
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}

export default Profile;
