import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

// Scrapes the product page of an Amazon product and returns the product data.
export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // Bright Data proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);

  const port = 22225;
  const session_id = (Math.random() * 1000000) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: "brd.superproxy.io",
    port: port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      // $(".apexPriceToPay .a-offscreen"),
      $(".a-price-whole"),
      $(".a-price.a-text-price.a-size-medium.apexPriceToPay span.a-offscreen"),
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price"),
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(
      ".a-color-price span.a-price.a-text-price.a-size-base span.a-offscreen",
    )
      .text()
      .trim()
      .replace(/[-%]/g, "");

    const description = extractDescription($);

    // construct data object from scraped data
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title: title || "Title not found",
      currentPrice: Number(currentPrice) || Number(originalPrice) || 0,
      originalPrice: Number(originalPrice) || Number(currentPrice) || 0,
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: "Electronics",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description: description || "Description not found",
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    // return the scraped data
    return data;
  } catch (error: any) {
    throw new Error(`Error scraping Amazon product: ${error.message}`);
  }
}
