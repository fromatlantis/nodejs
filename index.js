const express = require("express");
const bodyParser = require("body-parser");
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

app.post("/v1/chat/completions", async (req, res) => {
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
