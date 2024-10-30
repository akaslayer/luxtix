import profileItems from "./profileItems";
import { AiFillStar } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaChartBar } from "react-icons/fa";
import { GiTicket } from "react-icons/gi";

const navItemsLeft = [
  { text: "Home", path: "/" },
  { text: "Events", path: "/events" },
];

const navItemsRight = [{ text: "Sign Up", path: "/sign-up" }];

const profile = profileItems[0];

const navItemsIcon = [
  { icon: GiTicket, text: "Tickets", path: "/purchased-tickets" },
  { icon: AiFillStar, text: "Interested", path: "/interested" },
  { icon: CgProfile, text: "Profile", path: `/profile` },
];

const organizerNavItemsIcon = [
  { icon: FaChartBar, text: "Dashboard", path: "/dashboard" },
  { icon: CgProfile, text: "Profile", path: `/profile` },
];

export default {
  navItemsLeft,
  navItemsRight,
  navItemsIcon,
  organizerNavItemsIcon,
};
