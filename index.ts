/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import bodyParser from 'body-parser';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';


// configure genkit

const ai = genkit({
  plugins: [googleAI()],
});

const prompt = ai.definePrompt({
  name: 'Character Prompt',
  model: gemini15Flash,
  input: {
    schema: z.object({
      inspiration: z.string(),
    }),
  },
  output: {
    format: 'json',
    schema: z.object({
      name: z.string(),
      strength: z.number(),
      intelligence: z.number(),
      description: z.string(),
    }),
  },
  prompt: `You're a expert DnD designer, create a new character.
    Base the character on {{inspiration}} but don't make it
    an exact match.`,
});


// configure express server

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.get('/', async (req, res) => {
  return res.json({result: "Welcome to character Gen"})

})
app.get('/generate-character', async (req, res) => {
  const promptRes = await prompt({ inspiration: 'Yogi Berra' })
  return res.json({result: promptRes.output});

})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







  