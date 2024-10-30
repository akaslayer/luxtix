"use client";
import profileItems from "@/utils/profileItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ProfileSideMenu() {
  const profile = profileItems[0];
  const pathname = usePathname();

  return (
    <div className="w-2/5 sm:w-1/4 bg-luxtix-1 text-white p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
        Account Settings
      </h2>
      <ul className="space-y-2">
        <li>
          <Link
            href={`/profile/`}
            className={`block hover:text-luxtix-8 transition duration-300 ${
              pathname === `/profile` ? "border-b-2 border-luxtix-6" : ""
            } p-1`}
          >
            Account Info
          </Link>
        </li>
        <li>
          <Link
            href={`/profile/password`}
            className={`block hover:text-luxtix-8 ${
              pathname === `/profile/password`
                ? "border-b-2 border-luxtix-6"
                : ""
            } p-1`}
          >
            Password
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileSideMenu;
