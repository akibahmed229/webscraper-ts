import { PriceHistoryItem } from "@/types";

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...eLements: any) {
  for (const element of eLements) {
    const priceText = element.text().trim(); // Extract the price with text

    if (priceText) {
      const cleanPrice = priceText.replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters
      let execPrice;

      if (cleanPrice) execPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0]; // Extract the price

      return execPrice || cleanPrice;
    }
    return "Price not found";
  }
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(eLements: any) {
  const currencyText = eLements.text().trim().slice(0, 1); // Extract the currency symbol

  return currencyText ? currencyText : "Currency not found";
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // there are possible elements that can contain the description
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector); // Select the elements

    // If the elements are found
    if (elements.length > 0) {
      // Extract the text content from the elements
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join(" ");
      return textContent;
    }
  }

  return "Description not found";
}

// Extracts Higet Price from list of PriceHistoryItems array
export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  // Loop through the priceList array to find the highest price
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

// Extracts Lowest Price from list of PriceHistoryItems array
export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  // Loop through the price list and find the lowest price
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

// Extracts Average Price from two possible elements from amazon
export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0); // Sum all the prices in the priceList array
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}
