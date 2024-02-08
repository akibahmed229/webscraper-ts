"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

// Scrape and store products from a given URL in the database.
export async function scrapeAandStoreProducts(productURL: string) {
  if (!productURL) return;

  try {
    // connect to the database
    connectToDB();

    const scrapedProduct: any = await scrapeAmazonProduct(productURL);

    if (!scrapedProduct) return;

    // store the new product
    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      // Update the price history array (Obj) of the existing product
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      // Update the product with the new price history
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    console.log("Product: ", product);

    // Save the product to the database
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true },
    );

    revalidatePath(`/products/${newProduct._id}`); // will rerun the getServerSideProps function for the product page with the new data from the database and update the cache
  } catch (error: any) {
    throw new Error(`Error scraping and storing products: ${error}`);
  }
}

// Get all products from the database
export async function getProductByID(productID: string) {
  try {
    // connect to the database
    connectToDB();

    // get the product by ID
    const product = await Product.findOne({ _id: productID });

    if (!product) return;
    // return the product if it exists
    return product;
  } catch (error) {
    console.error("Error getting product by ID: ", error);
  }
}

export async function getAllProducts() {
  try {
    // connect to the database
    connectToDB();

    // get all the products
    const products = await Product.find();

    if (!products) return;
    // return the products if they exist
    return products;
  } catch (error) {
    console.error("Error getting all products: ", error);
  }
}
