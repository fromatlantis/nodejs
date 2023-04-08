const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const PORT = 3000;

const app = express();

app.get("/hello", (req, res) => {
  console.log("first hello");
  res.send("world");
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const options = {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      proxyRes.on("data", (chunk) => {
        chunk.pipe(res);
      });
      proxyRes.on("end", () => {
        console.log("No more data in response.");
      });
    });

    proxyReq.on("error", (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });

    req.pipe(proxyReq);

    //res.send('hello')
    //       const stream = await OpenAI(
    //         "completions",
    //         {
    //           model: "text-davinci-003",
    //           prompt: "Write a happy sentence.\n\n",
    //           max_tokens: 25
    //         }
    //       );

    //   stream.pipe(res);
    //       const openaiRes = await openaiClient.createChatCompletion(req.body, { responseType: 'stream' });
    //       const stream = new PassThrough();
    //       res.set({
    //         'Connection': 'keep-alive',
    //         'Cache-Control': 'no-cache',
    //         'Content-Type': 'text/event-stream',
    //       });

    //       res.status(200);
    //       stream.pipe(res);
    //const writable = new require('stream').Writable();
    //       openaiRes.data.on('data', (data) => {
    //         //console.log(data.toString());
    //         //res.send(data);
    //           try {
    //              // 对每次推送的数据进行格式化, 得到的是 JSON 字符串、或者 [DONE] 表示流结束
    //              const message = data
    //               .toString()
    //               .trim()
    //               .replace(/^data: /, '');
    //               console.log(message);
    //             // 流结束
    //             if (message === '[DONE]') {
    //               stream.write('data: [DONE]\n\n');
    //               return;
    //             }

    // //             解析数据
    //             const parsed = JSON.parse(message);

    //             // 写入流
    //             stream.write(`data: ${parsed || ''}\n\n`);
    //           } catch (e) {
    //             // 出现错误, 结束流
    //             stream.write('data: [DONE]\n\n');
    //           }
    // });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
