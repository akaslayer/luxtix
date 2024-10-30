import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface UserProfile {
  email: string;
  displayName: string;
  phoneNumber: string;
  avatar: string;
  referralCode: string;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers: HeadersInit = {};
        if (session) {
          headers["Authorization"] = `Bearer ${session.user.accessToken}`;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            credentials: "include",
            headers,
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserProfile(data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  return { userProfile, loading };
}
