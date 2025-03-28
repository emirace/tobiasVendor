import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const redirectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, expires: 3600, default: Date.now() },
});

// redirectSchema.pre("save", async function (next) {
//   if (this.isModified("token")) {
//     const hash = await bcrypt.hash(this.token, 8);
//     this.token = hash;
//   }
//   next();
// });

// redirectSchema.methods.compareToken = async function (token) {
//   const result = await bcrypt.compareSync(token, this.token);
//   return result;
// };

const Redirect = mongoose.model("Redirect", redirectSchema);
export default Redirect;
