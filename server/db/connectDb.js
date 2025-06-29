import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Hardcoded MongoDB URI to fix the connection error permanently
    const mongoURI = "mongodb+srv://dreamwedz:dreamwedz2024@cluster0.bz4fc.mongodb.net/Dream_weds";
    
    await mongoose.connect(mongoURI, {
      // The following options are no longer needed.
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
