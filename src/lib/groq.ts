import Groq from "groq";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default groq;
