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
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productURL);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    //const newProduct = await Product.findOneAndUpdate(
    //  { url: scrapedProduct.url },
    //  product,
    //  { upsert: true, new: true },
    //);
    //

    // if the product exists, update it
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true },
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      console.error(
        `Failed to create/update product: Duplicate key error, ${error.message}`,
      );
      // Handle the duplicate key error here
    } else {
      // Other errors
      console.error(`Failed to create/update product: ${error.message}`);
    }
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

export async function getSimilarProducts(productID: string) {
  try {
    // connect to the database
    connectToDB();

    // get the current product
    const currentProduct = await Product.findById(productID);

    if (!currentProduct) return null;

    // get similar products
    const similarProducts = await Product.find({
      _id: { $ne: productID },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.error("Error getting all products: ", error);
  }
}
