type UiComponentTask = {
  component: string;
  description: string;
  steps: { name: string, description: string }[];
};

const API_KEY = process ? process.env["OPENAI_API_KEY"] : "";

// const fs = require('fs');

async function createUiComponentTasks(mimeType: string, base64png: string): Promise<UiComponentTask[]> {
  const body = JSON.stringify({
         model: "gpt-4-vision-preview",
         messages: [
           {
             role: "user",
             content: [
               { type: "text", text: "What components do I need to create to recreate this view? Output JSON and only JSON, example: [{\"component\": \"AppBar\", \"description\": \"...\", \"steps\": [{\"name\": \"...\", \"description\": \"...\"}]}, ...]" },
               { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64png}` } }
             ]
           }
         ],
         max_tokens: 4096,
       });

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );

  const data = await response.json();
  const msg = data.choices[0].message.content as string;
  const json = msg.substring(8, msg.length - 4);
  return JSON.parse(json);
}


// const img = fs.readFileSync("/home/joonatanb/stuff/junction23/gpt-test/img.b64", { encoding: "ascii" });
// createUiComponentTasks("image/png", img);
