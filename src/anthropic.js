import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-sonnet-4-6';
export const MAX_TOKENS = 2000;
export const MAX_TOKENS_LONG = 4000;

const ENV_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function getApiKey() {
  return ENV_KEY || sessionStorage.getItem('rec_anthropic_key') || '';
}

export function saveApiKey(key) {
  sessionStorage.setItem('rec_anthropic_key', key.trim());
}

export function clearApiKey() {
  sessionStorage.removeItem('rec_anthropic_key');
}

export function createClient() {
  return new Anthropic({
    apiKey: getApiKey(),
    dangerouslyAllowBrowser: true,
  });
}
