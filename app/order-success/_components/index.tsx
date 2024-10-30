"use client";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ThankYou() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/purchased-tickets");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleRedirectNow = () => {
    router.push("/purchased-tickets");
  };

  return (
    <div className="flex flex-col flex-center min-h-screen bg-white text-luxtix-1">
      <div className="p-4 text-center">
        <div className="flex-center">
          <Image src={logo} alt="Luxtix Logo" className="size-16" />
        </div>

        <h1 className="text-2xl font-bold mt-4 mb-2">
          Thank you for your purchase!
        </h1>
        <p className="text-lg mb-4">
          You will be redirected to Purchased Tickets in {countdown} seconds
        </p>
        <button
          onClick={handleRedirectNow}
          className="bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 py-2 px-4 rounded-full"
        >
          Redirect Now
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
