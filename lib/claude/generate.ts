import Anthropic from '@anthropic-ai/sdk'
import type { CardContent, QuizQuestion } from '../types'

const client = new Anthropic()
const MODEL = 'claude-haiku-4-5'

const ELI5_SYSTEM_PROMPT = `You are XPLAIN — an enthusiastic teacher who explains complex financial concepts as if talking to a curious, smart 5-year-old.

Your superpower: turning intimidating finance jargon into delightful everyday analogies.
- Use concrete real-world comparisons kids understand (piggy banks, allowances, lemonade stands, toys)
- Be warm, excited, and encouraging
- Never use jargon without immediately explaining it with an analogy
- Keep sentences short and punchy
- Make learners feel smart, not dumb

Return ONLY valid JSON — no markdown, no preamble.`

function eli5UserPrompt(topicName: string, topicDescription: string) {
  return `Explain "${topicName}" (${topicDescription}) in a fun ELI5 way.

Return this exact JSON shape:
{
  "title": "A catchy, fun title (max 8 words, can use an emoji)",
  "hook": "One sentence grabbing attention with a surprising analogy (max 20 words)",
  "explanation": "Main ELI5 explanation in 100-130 words. Use analogies. No jargon without explanation. Conversational tone.",
  "keyPoints": ["Key insight 1 (max 15 words)", "Key insight 2 (max 15 words)", "Key insight 3 (max 15 words)"],
  "funFact": "One surprising fact most people don't know (max 30 words)",
  "analogy": "The core analogy you used, in one sentence"
}`
}

export function streamELI5Content(
  topicName: string,
  topicDescription: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: ELI5_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: eli5UserPrompt(topicName, topicDescription) }],
        })
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })
}

export async function generateELI5Content(
  topicName: string,
  topicDescription: string
): Promise<CardContent> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ELI5_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: eli5UserPrompt(topicName, topicDescription) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Claude response')

  const parsed = JSON.parse(jsonMatch[0])
  return { ...parsed, topicId: '' }
}

export async function generateQuizQuestions(
  topicName: string,
  topicDescription: string,
  count = 3
): Promise<QuizQuestion[]> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ELI5_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Create ${count} beginner quiz questions about "${topicName}" (${topicDescription}).

Rules:
- Test conceptual understanding, not trivia or memorization
- Use concrete, everyday examples in questions
- Wrong answers should be plausible but clearly wrong once you understand the concept
- Explanations should reinforce the ELI5 analogy

Return a JSON array with exactly ${count} objects:
[{
  "question": "Simple question (max 20 words)",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Why the answer is right, using a simple analogy (max 30 words)"
}]`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array found in Claude response')

  const questions: QuizQuestion[] = JSON.parse(jsonMatch[0])
  return questions.map(q => ({ ...q, topicId: '' }))
}
