import Anthropic from '@anthropic-ai/sdk';

export const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const MODEL = 'claude-sonnet-4-20250514';
export const MAX_TOKENS = 2000;
export const MAX_TOKENS_LONG = 4000;
