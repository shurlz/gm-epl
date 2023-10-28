import mongoose, { ConnectOptions } from "mongoose";
import { MONGO_URL } from "../constants/env.constants";


const ConnectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  } catch (err) {
    console.log(err);
  }
};

export default ConnectToMongoDB;