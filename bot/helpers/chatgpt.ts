import { ChatGPTAPI } from 'chatgpt'
import env from './env'

export default new ChatGPTAPI({
  apiKey: env.OPENAI_API_KEY,
  completionParams: { model: 'gpt-3.5-turbo' },
  debug: true,
  maxModelTokens: 8100,
  systemMessage:
    'You are GPT-4, a large language model trained by OpenAI. Answer as concisely as possible. Keep all the replies shorter than 320 characters. Do not use hashtags.',
})
