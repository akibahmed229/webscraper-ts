"use client";
import { scrapeAandStoreProducts } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const isValidAmazonLink = (link: string) => {
  try {
    const parseURL = new URL(link); // parse url to get the hostname
    const hostname = parseURL.hostname;
    if (
      hostname.includes("amazon.con") ||
      hostname.includes("amazon.") ||
      hostname.includes("amazon")
    ) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

function SearchBar() {
  const [searchPrompt, setsearchPrompt] = useState("");
  const [isLoaing, setisLoaing] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonLink(searchPrompt);

    if (!isValidLink) return alert("Invalid Amazon link");
    try {
      setisLoaing(true);
      // scarpe the product details
      const product = await scrapeAandStoreProducts(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoaing(false);
    }
  };

  return (
    <form className="flex flex-wrap gap4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for products"
        className="searchbar-input"
        onChange={(e) => setsearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn mx-5"
        disabled={searchPrompt === ""}
      >
        {isLoaing ? "Loading..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
