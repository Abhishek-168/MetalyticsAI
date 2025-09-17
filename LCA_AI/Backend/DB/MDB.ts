import mongoose from "mongoose";

// MongoDB connection
const MDB_URI = process.env.MONGO_URL || "mongodb+srv://misterfreefire33:PJPAfmmjuprxvGhZ@cluster0.xpbj1af.mongodb.net/Metalystics?retryWrites=true&w=majority";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MDB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    
  }
};

// Export the model and schemas from the modular schema files
export { LCAProject } from "./schemas/project";
export * from "./schemas/index";

