import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        isSeller: { type: Boolean, default: false, required: true },
        followers: [{ type: mongoose.Schema.Types.ObjectID, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectID, ref: "User" }],
        likes: [{ type: mongoose.Schema.Types.ObjectID, ref: "Product" }],
        saved: [{ type: mongoose.Schema.Types.ObjectID, ref: "Product" }],

        seller: {
            name: String,
            logo: String,
            description: String,
            rating: { type: Number, default: 0, required: true },
            numReviews: { type: Number, default: 0, required: true },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;
