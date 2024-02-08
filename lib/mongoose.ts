import mongoose, { Mongoose } from "mongoose";

let isConnected: boolean = false; // Database connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // Enable strict mode for queries (strict means that you can't query a field that is not defined in the schema)

  if (!process.env.MONGODB_URI)
    return console.log("=> no MongoDB URI provided");

  if (isConnected) return console.log("=> using existing database connection");

  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("=> new database connection");
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
};
