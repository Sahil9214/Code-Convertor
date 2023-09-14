const express = require("express");
const axios = require("axios");
require("dotenv").config();
var cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const CHATGPT_API_KEY = process.env.OPENAI_API_KEY;

// API endpoint for code conversion
app.post("/convert", async (req, res) => {
  const { code, targetLanguage } = req.body;
  try {
    // Call ChatGPT API for code conversion

    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `##### Translate this code snippet to ${targetLanguage}\n### \n    \n    ${code}    \n### ${targetLanguage}",`,
        max_tokens: 150,
        temperature: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const convertedCode = response.data.choices[0].text.trim();
    console.log(convertedCode);
    res.json({ convertedCode });
  } catch (error) {
    console.error("Error converting code:", error);
    res.status(500).json({ error: "Error converting code" });
  }
});

// Debug route
app.post("/debug", async (req, res) => {
  // Get the debug information from the request body
  const { debugInfo } = req.body;

  try {
    // Call ChatGPT API  for debugging the information
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Debug the following code:- ${debugInfo} \n  check if there is any error and  correct it. also if it's correct provide steps what code is doing and how we can improve it`,
        max_tokens: 500,
        temperature: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data.choices[0].text.trim();
    res.send({ output }); // Send the ChatGPT output as a JSON response
  } catch (error) {
    console.error("Error in debug:", error);
    res.status(500).json({ error: "Error in debug" });
  }
});

app.post("/quality", async (req, res) => {
  // Get the debug information from the request body
  const { code } = req.body;

  try {
    // Call ChatGPT API  for debugging the information
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Check the quality of the following code:-  ${code} \n ### \n please provide detailed info \n and also provide some tips to improve. provide in points `,
        max_tokens: 500,
        temperature: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data.choices[0].text.trim();
    res.send({ output }); // Send the ChatGPT output as a JSON response
  } catch (error) {
    console.error("Error in debug:", error);
    res.status(500).json({ error: "Error in debug" });
  }
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
