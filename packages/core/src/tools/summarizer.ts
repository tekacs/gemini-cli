/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolResult } from './tools.js';

/**
 * A function that summarizes the result of a tool execution.
 *
 * @param result The result of the tool execution.
 * @returns The summary of the result.
 */
export type Summarizer = (result: ToolResult) => string;

/**
 * The default summarizer for tool results.
 *
 * @param result The result of the tool execution.
 * @returns The summary of the result.
 */
export const defaultSummarizer: Summarizer = (result) => {
  if (typeof result.llmContent === 'string') {
    return result.llmContent.slice(0, 100);
  }
  return JSON.stringify(result.llmContent).slice(0, 100);
};
