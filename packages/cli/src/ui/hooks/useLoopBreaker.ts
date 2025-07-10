/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useCallback, useEffect } from 'react';
import crypto from 'crypto';
import { HistoryItem, StreamingState } from '../types.js';

const LOOP_THRESHOLD = 5;

/**
 * A hook to detect and break potential loops of repetitive tool calls.
 *
 * This hook monitors the history of tool calls within a single turn. If it
 * detects the same tool call (based on its name, description, and result)
 * being repeated multiple times, it triggers a cancellation of the current
 * request to prevent infinite loops.
 *
 * @param streamingState The current streaming state of the application.
 * @param cancelRequest A function to call to cancel the ongoing request.
 * @returns An object containing the `checkForLoop` function.
 */
export const useLoopBreaker = (
  streamingState: StreamingState,
  cancelRequest: (reason: string) => void,
) => {
  const prevToolCalls = useRef(new Map<string, number>());

  useEffect(() => {
    if (streamingState === StreamingState.Idle) {
      prevToolCalls.current.clear();
    }
  }, [streamingState]);

  /**
   * Checks the given history item for potential loops.
   * This should be called whenever a new item is added to the history.
   */
  const checkForLoop = useCallback(
    (item: HistoryItem) => {
      if (item.type === 'tool_group') {
        for (const toolCall of item.tools) {
          // Create a unique signature for the tool call result.
          const signature = crypto
            .createHash('sha256')
            .update(
              [
                toolCall.name,
                toolCall.description,
                toolCall.resultDisplay,
              ].join('-'),
            )
            .digest('hex');
          console.log(signature);
          const currentCount = prevToolCalls.current.get(signature) || 0;
          prevToolCalls.current.set(signature, currentCount + 1);
        }
      }

      // Check if any tool call has been repeated too many times.
      if (
        streamingState === StreamingState.Responding &&
        Array.from(prevToolCalls.current.values()).some(
          (value) => value >= LOOP_THRESHOLD,
        )
      ) {
        cancelRequest(
          'A potential loop was detected due to repetitive tool calls. The request has been cancelled. Please try again with a more specific prompt.',
        );
      }
    },
    [streamingState, cancelRequest],
  );

  return { checkForLoop };
};
