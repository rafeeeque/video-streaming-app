import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    googleId: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
