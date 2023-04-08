const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const PORT = 3000;

const app = express();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiClient = new OpenAIApi(openaiConfig);

app.get("/hello", (req, res) => {
  console.log("first hello");
  res.send("world");
});

app.get("/v1/chat/completions", async (req, res) => {
  try {
    console.log(process.env.OPENAI_API_KEY);
    const openaiRes = await openaiClient.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello world" }],
        stream: true
      },
      { responseType: "stream" }
    );
    res.setHeader("content-type", "text/event-stream");
    openaiRes.data.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
