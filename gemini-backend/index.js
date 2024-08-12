// //NEW CODE
// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const cors = require("cors");
// const twilio = require('twilio');
// require("dotenv").config();

// const app = express();
// const port = 3001;

// app.use(cors()); // Allow requests from the frontend
// app.use(express.json()); // Parse JSON request bodies
// const bodyParser = require('body-parser');

// // Use body-parser to parse URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());



// // Initialize Google Generative AI
// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 0.1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Initialize Twilio
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// // Endpoint for generating questions and answers
// app.post("/generate-qa", async (req, res) => {
//   const { description } = req.body;

//   if (!description) {
//     return res.status(400).json({ error: "Description is required" });
//   }

//   try {
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: "You are \"Telecall\", you are designed to generate question and answers based upon the text that is provided to you regarding a product/service. So for example if you get a textual description related to a real estate consisting of all the information about a particular house, make sure to create 5-10 different questions and answers related to each textual description. Make sure both the questions and answers are human-like meaning as if any human was asking a question regarding the product, similarly answer the question in a human-like manner only. Create questions and answers for a textual description related to a product/service only. Don't exceed 10 question and answers limit and make sure that you generate question and answers from the textual prompt provided to you in a human-like manner. Don't mention anything that is not mentioned in the description that has been provided to you.",
//             },
//           ],
//         },
//         {
//           role: "model",
//           parts: [
//             {
//               text: "Okay, I'm ready! Please provide me with the textual description of the product/service. I'll then generate 5-10 human-like questions and answers based on the information you give me.",
//             },
//           ],
//         },
//         {
//             role: "user",
//             parts: [
//             {
//                 text: "The language of the question is good, but make sure that they are created from the textual description provided only. Don't create questions from outside if its not mentioned in the description",
//             }
//             ],
//           },
//           {
//             role: "model",
//             parts: [
//             {
//                 text: "You are absolutely right! I apologize for going beyond the provided text. I'm still learning to stay within the boundaries of the information given. \n\nHere are some questions based *only* on the text you provided:\n\n**Question 1:**  How much does the house in Gurgaon East cost?\n\n**Answer:**  The house is priced at 55 Lacs INR.\n\n**Question 2:**  What kind of layout does the house have?\n\n**Answer:**  It's a 3BHK, meaning it has 3 bedrooms.\n\n**Question 3:**  How many bathrooms are there in the house?\n\n**Answer:**  There are 2 attached bathrooms.\n\n**Question 4:**  Where is the house located in Gurgaon East?\n\n**Answer:**  It's located in Engineering Colony.\n\n**Question 5:**  What floor is the house on?\n\n**Answer:**  It's on the seventh floor.\n\n**Question 6:**  Which tower is the house in?\n\n**Answer:**  It's in Tower 2. \n", 
//             }
//             ],
//           },
//           {
//             role: "user",
//             parts: [{
//                 text: "make the answers more human-like", 
//             }
//             ],
//           },
//       ],
//     });

//     const result = await chatSession.sendMessage(description);
//     const questionsAndAnswers = result.response.text().split("\n").filter(line => line.trim() !== "");

//     res.json({ questionsAndAnswers });
//   } catch (error) {
//     console.error("Error generating Q&A:", error);
//     res.status(500).json({ error: "Failed to generate questions and answers." });
//   }
// });

// // Endpoint to make a call using Twilio
// app.post("/make-call", async (req, res) => {
//     const { customerName, customerNumber, productDescription } = req.body;
  
//     if (!customerName || !customerNumber || !productDescription) {
//       console.error("Missing required customer details");
//       return res.status(400).json({ error: "Missing required customer details" });
//     }
  
//     try {
//       const call = await client.calls.create({
//         url: `https://af06-103-25-231-126.ngrok-free.app/voice-response?customerName=${encodeURIComponent(customerName)}&productDescription=${encodeURIComponent(productDescription)}`,  // Pass customer name and product description as query parameters
//         to: customerNumber,
//         from: "+19383481182",  // Your Twilio phone number
//       });
  
//       console.log(`Call initiated with SID: ${call.sid}`);
//       res.json({ message: "Call initiated", callSid: call.sid });
//     } catch (error) {
//       console.error("Error initiating call:", error);
//       res.status(500).json({ error: "Failed to initiate call." });
//     }
//   });
  

// // Endpoint to handle Twilio's request for the voice response
// app.post('/voice-response', (req, res) => {
//     const customerName = req.query.customerName || 'Customer';
//     const productDescription = req.query.productDescription || 'our product';
  
//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say(`Hi ${customerName}, is it the right time to speak to you?`);
  
//     twiml.gather({
//       input: 'speech',
//       action: `/handle-response?productDescription=${encodeURIComponent(productDescription)}`,
//       timeout: 5,
//       method: 'POST'
//     });
  
//     res.type('text/xml');
//     res.send(twiml.toString());
//   });
  
//   app.post('/handle-response', (req, res) => {
//     console.log('Request body:', req.body); // Log the entire request body
  
//     const speechResult = req.body.SpeechResult ? req.body.SpeechResult.toLowerCase() : '';
//     const productDescription = req.query.productDescription || 'our product';
  
//     const twiml = new twilio.twiml.VoiceResponse();
  
//     // Log the processed speech result for debugging
//     console.log('Processed Speech Result:', speechResult);
  
//     // Update the condition to check if the response contains "yes" or "go ahead" as keywords
//     if (speechResult.includes('yes') || speechResult.includes('go ahead')) {
//       twiml.say(`Great! Let me tell you about our product: ${productDescription}`);
//     } else {
//       twiml.say('Thank you for your time. We will call you back later.');
//     }
  
//     twiml.hangup();
//     res.type('text/xml');
//     res.send(twiml.toString());
//   });
  
  
// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });







const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const twilio = require('twilio');
require("dotenv").config();

const app = express();
const port = 3001;

app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON request bodies
const bodyParser = require('body-parser');

// Use body-parser to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Endpoint for generating questions and answers
app.post("/generate-qa", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are \"Telecall\", you are designed to generate question and answers based upon the text that is provided to you regarding a product/service. So for example if you get a textual description related to a real estate consisting of all the information about a particular house, make sure to create 5-10 different questions and answers related to each textual description. Make sure both the questions and answers are human-like meaning as if any human was asking a question regarding the product, similarly answer the question in a human-like manner only. Create questions and answers for a textual description related to a product/service only. Don't exceed 10 question and answers limit and make sure that you generate question and answers from the textual prompt provided to you in a human-like manner. Don't mention anything that is not mentioned in the description that has been provided to you.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Okay, I'm ready! Please provide me with the textual description of the product/service. I'll then generate 5-10 human-like questions and answers based on the information you give me.",
            },
          ],
        },
        {
            role: "user",
            parts: [
            {
                text: "The language of the question is good, but make sure that they are created from the textual description provided only. Don't create questions from outside if its not mentioned in the description",
            }
            ],
          },
          {
            role: "model",
            parts: [
            {
                text: "You are absolutely right! I apologize for going beyond the provided text. I'm still learning to stay within the boundaries of the information given. \n\nHere are some questions based *only* on the text you provided:\n\n**Question 1:**  How much does the house in Gurgaon East cost?\n\n**Answer:**  The house is priced at 55 Lacs INR.\n\n**Question 2:**  What kind of layout does the house have?\n\n**Answer:**  It's a 3BHK, meaning it has 3 bedrooms.\n\n**Question 3:**  How many bathrooms are there in the house?\n\n**Answer:**  There are 2 attached bathrooms.\n\n**Question 4:**  Where is the house located in Gurgaon East?\n\n**Answer:**  It's located in Engineering Colony.\n\n**Question 5:**  What floor is the house on?\n\n**Answer:**  It's on the seventh floor.\n\n**Question 6:**  Which tower is the house in?\n\n**Answer:**  It's in Tower 2. \n", 
            }
            ],
          },
          {
            role: "user",
            parts: [{
                text: "make the answers more human-like", 
            }
            ],
          },
      ],
    });

    const result = await chatSession.sendMessage(description);
    const questionsAndAnswers = result.response.text().split("\n").filter(line => line.trim() !== "");

    res.json({ questionsAndAnswers });
  } catch (error) {
    console.error("Error generating Q&A:", error);
    res.status(500).json({ error: "Failed to generate questions and answers." });
  }
});

// Endpoint to make a call using Twilio
app.post("/make-call", async (req, res) => {
    const { customerName, customerNumber, productDescription } = req.body;
  
    if (!customerName || !customerNumber || !productDescription) {
      console.error("Missing required customer details");
      return res.status(400).json({ error: "Missing required customer details" });
    }
  
    try {
      const call = await client.calls.create({
        url: ` https://af06-103-25-231-126.ngrok-free.app/voice-response?customerName=${encodeURIComponent(customerName)}&productDescription=${encodeURIComponent(productDescription)}`,  // Pass customer name and product description as query parameters
        to: customerNumber,
        from: "+19383481182",  // Your Twilio phone number
      });
  
      console.log(`Call initiated with SID: ${call.sid}`);
      res.json({ message: "Call initiated", callSid: call.sid });
    } catch (error) {
      console.error("Error initiating call:", error);
      res.status(500).json({ error: "Failed to initiate call." });
    }
  });
  

// Endpoint to handle Twilio's request for the voice response
app.post('/voice-response', (req, res) => {
    const customerName = req.query.customerName || 'Customer';
    const productDescription = req.query.productDescription || 'our product';
  
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(`Hi ${customerName}, is it the right time to speak to you?`);
  
    twiml.gather({
      input: 'speech',
      action: `/handle-response?productDescription=${encodeURIComponent(productDescription)}`,
      timeout: 5,
      method: 'POST'
    });
  
    res.type('text/xml');
    res.send(twiml.toString());
  });
  
  // Handle customer's response by generating an AI response from Gemini
  app.post('/handle-response', async (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body
  
    const speechResult = req.body.SpeechResult ? req.body.SpeechResult.toLowerCase() : '';
    const productDescription = req.query.productDescription || 'our product';
  
    const twiml = new twilio.twiml.VoiceResponse();
  
    // Log the processed speech result for debugging
    console.log('Processed Speech Result:', speechResult);
  
    // if (speechResult.includes('yes') || speechResult.includes('go ahead')) {
    //   twiml.say(`Great! Let me tell you about our product: ${productDescription}`);
    // } else 
    if (speechResult) {
      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `The customer asked: "${speechResult}". Respond in a human-like manner based on the provided product description: "${productDescription}".`,
                },
              ],
            },
          ],
        });
  
        const aiResponse = await chatSession.sendMessage(speechResult);
        const aiAnswer = aiResponse.response.text();
  
        twiml.say(aiAnswer);
        
        // Continue gathering input from the user
        twiml.gather({
          input: 'speech',
          action: `/handle-response?productDescription=${encodeURIComponent(productDescription)}`,
          timeout: 5,
          method: 'POST'
        });
      } catch (error) {
        console.error("Error generating AI response:", error);
        twiml.say("I'm sorry, I didn't understand that. Could you please repeat?");
        
        // Continue gathering input from the user
        twiml.gather({
          input: 'speech',
          action: `/handle-response?productDescription=${encodeURIComponent(productDescription)}`,
          timeout: 5,
          method: 'POST'
        });
      }
    } else {
      twiml.say('Thank you for your time. We will call you back later.');
      twiml.hangup();
    }
  
    res.type('text/xml');
    res.send(twiml.toString());
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
