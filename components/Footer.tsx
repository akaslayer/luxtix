import logo from "../public/logo.svg";
import footerItems from "@/utils/footerItems";
import Image from "next/image";
import Link from "next/link";

const footerParagraph = [
  "Luxtix is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.",
];

function Footer() {
  return (
    <div className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between gap-x-8">
          <div className="mb-6 sm:mb-0">
            <Image src={logo} alt="Luxtix Logo" className="mb-4 h-20 w-20" />
            <div className="text-zinc-400 mb-4 leading-relaxed">
              <div className="max-w-md text-sm">{footerParagraph}</div>
            </div>
            <p className="text-zinc-400">©2024 Luxtix. All rights reserved.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-16">
            {footerItems.map((item, index) => (
              <div key={index}>
                <h3 className="text-white font-bold mb-4">{item.title}</h3>
                <ul className="text-zinc-400 space-y-2 text-sm lg:text-base">
                  {item.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
