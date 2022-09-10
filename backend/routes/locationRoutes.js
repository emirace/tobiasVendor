import express from "express";
import expressAsyncHandler from "express-async-handler";

const locationRouter = express.Router();

locationRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    console.log(req.headers);
    const data = req.headers["cloudfront-viewer-country"];
    res.status(200).send("ZA");
  })
);

export default locationRouter;
