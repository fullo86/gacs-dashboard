import { initModels } from "@/models/initModel/InitModel";
import connectDB from "./db";

let initialized = false;

export const initDB = async () => {
  if (!initialized) {
    initModels();
    await connectDB.authenticate();
    initialized = true;
  }
};
