"use client";
import SearchBar from "@/components/SearchBar";
import heroImg from "@/public/heroimg.png";
import Image from "next/image";

function Hero() {
  return (
    <div className="relative bg-cover bg-center h-screen sm:h-auto sm:p-24">
      <div className="absolute inset-0 w-full">
        <Image
          src={heroImg}
          alt="hero image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 pb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Don&apos;t miss out!
        </h2>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          Explore the <span className="text-luxtix-6">vibrant events</span>{" "}
          happening locally and globally.
        </h2>

        <div className="w-full max-w-3xl mt-8">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Hero;
