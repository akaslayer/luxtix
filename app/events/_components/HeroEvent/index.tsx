"use client";
import SearchBar from "@/components/SearchBar";
import heroImg2 from "@/public/heroimg2.png";
import Image from "next/image";

function HeroEvent() {
  return (
    <div className="relative bg-cover bg-center h-screen sm:h-auto sm:p-24">
      <div className="absolute inset-0 w-full">
        <Image
          src={heroImg2}
          alt="hero image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          Explore a world of events. Find what excites you!
        </h2>
        <div className="w-full max-w-3xl mt-8">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default HeroEvent;
