const express = require("express");
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiClient = new OpenAIApi(openaiConfig);

app.get("/hello", (req, res) => {
  console.log("first hello");
  res.send("world");
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
      console.log(req.body);
    const openaiRes = await openaiClient.createChatCompletion(
      req.body,
      { responseType: "stream" }
    );
    // res.setHeader("content-type", "text/event-stream");
    openaiRes.data.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
