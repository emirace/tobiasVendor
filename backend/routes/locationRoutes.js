import express from "express";
import expressAsyncHandler from "express-async-handler";

const locationRouter = express.Router();

locationRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const data = req.headers["cloudfront-viewer-country"];
    res.status(200).send(data);
  })
);

export default locationRouter;
