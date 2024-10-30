"use client";
import { GoLocation } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  eventName: string;
}

function SearchBar() {
  const [eventSearchTerm, setEventSearchTerm] = useState<string>("");
  const [citySearchTerm, setCitySearchTerm] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const debouncedEventSearchTerm = useDebounce(eventSearchTerm, 500);
  const debouncedCitySearchTerm = useDebounce(citySearchTerm, 1000);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cities?name=${debouncedCitySearchTerm}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCities(data.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    if (debouncedCitySearchTerm) {
      fetchCities();
    } else {
      setCities([]);
    }
  }, [debouncedCitySearchTerm]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let endpoint = session ? "/api/events" : "/api/events/public";
        const headers: HeadersInit = {};
        if (session) {
          headers["Authorization"] = `Bearer ${session.user.accessToken}`;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}?eventName=${debouncedEventSearchTerm}`,
          {
            credentials: "include",
            headers,
          }
        );
        const data = await response.json();
        setSuggestions(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (debouncedEventSearchTerm) {
      fetchEvents();
    } else {
      setSuggestions([]);
    }
  }, [debouncedEventSearchTerm]);

  return (
    <div className="w-full max-w-3xl relative">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center px-4 w-full sm:w-auto">
          <AiOutlineSearch className="text-luxtix-1 size-6" />
          <input
            type="text"
            value={eventSearchTerm}
            onChange={(e) => setEventSearchTerm(e.target.value)}
            className="flex-grow py-3 px-4 text-luxtix-1 placeholder-zinc-400 focus:outline-none"
            placeholder="Search Events, ..."
          />
        </div>
        <div className="flex items-center px-4 w-full sm:w-auto">
          <GoLocation className="text-luxtix-1" />
          <input
            type="text"
            value={citySearchTerm}
            onChange={(e) => setCitySearchTerm(e.target.value)}
            className="flex-1 py-3 px-4 text-luxtix-1 placeholder-zinc-400 border-none focus:outline-none"
            placeholder="City"
          />
        </div>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 text-luxtix-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Link href={`/events/${suggestion.id}`}>
                  {suggestion.eventName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cities.length > 0 && (
        <div className="absolute text-luxtix-1 right-0 left-0 sm:left-auto sm:w-1/2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul>
            {cities.map((city) => (
              <li
                key={city.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <a href={`/events?city=${city.name}`}>{city.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
