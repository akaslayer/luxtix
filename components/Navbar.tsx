'use client'

import logo from "@/public/logo.svg";
import navItems from "@/utils/navItems";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import handleLogout from "./SignOut";
import { useSession } from "next-auth/react";
import { Session } from "inspector";


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const pathname = usePathname();
  const { data } = useSession();

  useEffect(() => {
    if (data?.user.role == "USER") {
      setIsLoggedIn(true)
      setIsOrganizer(false)
    } else {
      if (data?.user.role == "ORGANIZER") {
        setIsLoggedIn(true)
        setIsOrganizer(true)
      }
    }
  }, [data]);



  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <nav className="bg-black text-white px-4 py-2 flex items-center justify-between sm:px-28">
      <div className="flex items-center">
        <Link href="/">
          <Image src={logo} alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14" />
        </Link>
      </div>
      <div className="flex justify-center flex-1 pb-0">
        <div className="flex space-x-2 sm:space-x-4">
          {navItems.navItemsLeft.map(
            (item, index) =>
              (!isOrganizer ||
                (item.text !== "Home" && item.text !== "Events")) && (
                <Link
                  key={index}
                  href={item.path}
                  className={`text-white text-sm sm:text-base hover:text-luxtix-6 ${pathname === item.path ? "border-b-2 border-luxtix-6" : ""
                    }`}
                >
                  {item.text}
                </Link>
              )
          )}
        </div>
      </div>
      <div className="flex space-x-2 sm:space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <div className="relative sm:hidden">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white text-sm sm:text-base hover:text-luxtix-6"
              >
                <FaUserCircle className="text-xl sm:text-2xl" />
                <FaCaretDown className="ml-1" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                  {isOrganizer
                    ? navItems.organizerNavItemsIcon.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className={`block px-4 py-2 ${pathname === item.path ? "bg-luxtix-6" : ""
                          }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.text}
                      </Link>
                    ))
                    : navItems.navItemsIcon.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className={`block px-4 py-2 ${pathname === item.path ? "bg-luxtix-6" : ""
                          }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.text}
                      </Link>
                    ))}
                  <button
                    onClick={() => handleLogout()}
                    className="px-4 py-2 hover:bg-gray-200 w-full text-left flex flex-row items-center gap-2"
                  >
                    <CiLogout />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="hidden sm:flex space-x-2 sm:space-x-4 items-center">
              {isOrganizer
                ? navItems.organizerNavItemsIcon.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="text-white hover:text-luxtix-6 flex flex-col items-center"
                  >
                    <item.icon className="text-xl" />
                    <span className="text-xs">{item.text}</span>
                  </Link>
                ))
                : navItems.navItemsIcon.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="text-white hover:text-luxtix-6 flex flex-col items-center"
                  >
                    <item.icon className="text-xl" />
                    <span className="text-xs">{item.text}</span>
                  </Link>
                ))}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-white text-sm sm:text-base hover:text-luxtix-6">
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will end your current session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleLogout()}
                      className="bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2"
                    >
                      Log out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <>
            {navItems.navItemsRight.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="text-white text-sm sm:text-base hover:text-luxtix-6 hidden sm:block"
              >
                {item.text}
              </Link>
            ))}
            <div>
              <Link
                href="/sign-in"
                className="bg-luxtix-6 text-black px-4 py-2 rounded-lg hover:bg-luxtix-2"
              >
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
