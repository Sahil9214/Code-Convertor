const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const { ConversionRouter } = require("./router/conversionRoute");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const apiKey = process.env.OPENAI_API_KEY;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/convert", async (req, res) => {
  try {
    const { code, language } = req.body;

    const apiUrl =
      "https://api.openai.com/v1/engines/text-davinci-002/completions";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const requestData = {
      prompt: `Convert the following ${language} code:\n\n${code}\n\nTo:\n\n`,
      max_tokens: 1000,
    };

    const response = await axios.post(apiUrl, requestData, { headers });

    const convertedCode = response.data.choices[0].text;

    res.status(200).send({ convertedCode });
  } catch (error) {
    console.error("Error converting code:", error);
    res.status(400).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  try {
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
