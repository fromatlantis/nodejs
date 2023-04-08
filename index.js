const bodyParser = require("body-parser");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { Configuration, OpenAIApi } = require("openai");

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiClient = new OpenAIApi(openaiConfig);

app.get("/hello", (req, res) => {
  res.send("world");
});

const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2,
  message: "Too many accounts created from this IP, please try again after an hour.",
});

app.post("/v1/chat/completions", chatLimiter, async (req, res) => {
  try {
    const openaiRes = await openaiClient.createChatCompletion(req.body, {
      responseType: "stream",
    });
    openaiRes.data.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/v1/images/generations", async (req, res) => {
  try {
    const openaiRes = await openaiClient.createImage(req.body);
    res.send(openaiRes.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
