import express from "express";
import Article from "../models/articlesModel.js";
import { isAuth, isAdmin } from "../utils.js";

const articleRouter = express.Router();

// Create an article
articleRouter.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const { content, topic, question } = req.body;
    const article = await new Article({
      content,
      topic,
      question,
    });
    const savedArticles = await article.save();
    res.status(201).json(savedArticles);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the article" });
  }
});

// Read all articles or search articles
articleRouter.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let articles;
    if (search) {
      // If a search query is provided, perform the search
      articles = await Article.find({
        $or: [
          { topic: { $regex: search, $options: "i" } },
          { question: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      // If no search query is provided, retrieve all articles
      articles = await Article.find().sort({ createdAt: -1 });
    }
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

// Read all topics
articleRouter.get("/topics", async (req, res) => {
  try {
    const topics = await Article.distinct("topic");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve topics" });
  }
});

// Read a single article
articleRouter.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the article" });
  }
});

// Read articles by topic
articleRouter.get("/topic/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const articles = await Article.find({
      topic: { $regex: topic, $options: "i" },
    });

    if (articles.length === 0) {
      return res
        .status(404)
        .json({ error: "No articles found with the specified topic" });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve articles by topic" });
  }
});

// Update an article
articleRouter.put("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { content, topic, question } = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        content,
        topic,
        question,
      },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update the article" });
  }
});

// Delete an article
articleRouter.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the article" });
  }
});

export default articleRouter;
