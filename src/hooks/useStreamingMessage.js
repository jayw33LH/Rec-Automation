import { useState, useCallback, useRef } from 'react';
import { createClient, MODEL, MAX_TOKENS } from '../anthropic';

export function useStreamingMessage(maxTokens = MAX_TOKENS, initialValue = '') {
  const [output, setOutput] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const streamRef = useRef(null);

  const generate = useCallback(
    async (messages, { onChunk, onDone } = {}) => {
      isMountedRef.current = true;
      setIsLoading(true);
      setOutput('');
      setError(null);

      try {
        const stream = createClient().messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          messages,
        });
        streamRef.current = stream;

        for await (const chunk of stream) {
          if (!isMountedRef.current) break;
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const text = chunk.delta.text;
            setOutput(prev => prev + text);
            onChunk?.(text);
          }
        }

        if (isMountedRef.current) {
          const final = await stream.finalMessage();
          onDone?.(final.content[0]?.text ?? '');
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [maxTokens]
  );

  const stop = useCallback(() => {
    isMountedRef.current = false;
    streamRef.current?.abort?.();
    setIsLoading(false);
  }, []);

  return { output, setOutput, isLoading, error, generate, stop };
}
