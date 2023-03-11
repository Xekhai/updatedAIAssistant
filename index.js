const express = require("express");
const openAI = require("openai");
// Importing the body-parser module to parse incoming request bodies
const bp = require("body-parser");

// Importing the dotenv module to access environment variables
require("dotenv").config();

//chatArray[Acts like a storage]
const chatArray = [{"role": "system", "content": "You are a helpful assistant."}];

// Creating a new Express app
const app = express();

// Using body-parser middleware to parse incoming request bodies as JSON
app.use(bp.json());

// Using body-parser middleware to parse incoming request bodies as URL encoded data
app.use(bp.urlencoded({ extended: true }));

// Importing and setting up the OpenAI API client
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Defining an endpoint to handle incoming requests
app.post("/converse", (req, res) => {
  // Extracting the user's message from the request body
  const message = req.body.message;

  // Calling the OpenAI API to complete the message
  openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: chatArray.concat([{ role: "user", content: message }])
  }).then((response) => {
    // Save the user's message and the AI's response to the chatArray
    chatArray.push({ role: "user", content: message });
    chatArray.push({ role: "assistant", content: response.data.choices[0].message.content });

    // Return the chatArray as a JSON response
    res.json(chatArray);
  });
});

// Starting the Express app and listening on port 3000
app.listen(3000, () => {
  console.log("Conversational AI assistant listening on port 3000!");
});
