/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadCliConfig } from './config.js';
import { Settings } from './settings.js';
import { Extension } from './extension.js';

// Mock dependencies
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    statSync: vi.fn(),
  },
  existsSync: vi.fn(),
  statSync: vi.fn(),
}));
vi.mock('node:path');
vi.mock('node:os');
vi.mock('dotenv');
vi.mock('./settings');
vi.mock('./extension');
vi.mock('../utils/version', () => ({
  getCliVersion: vi.fn().mockResolvedValue('1.0.0'),
}));
describe('loadCliConfig --max-turns', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
    vi.spyOn(process, 'cwd').mockReturnValue('/test/dir');
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  it('should set maxTurns from the command line', async () => {
    process.argv = ['node', 'gemini', '--max-turns', '5'];
    const settings: Settings = {};
    const extensions: Extension[] = [];
    const config = await loadCliConfig(settings, extensions, 'test-session');
    expect(config.getMaxTurns()).toBe(5);
  });

  it('should use the default value for maxTurns when not provided', async () => {
    process.argv = ['node', 'gemini'];
    const settings: Settings = {};
    const extensions: Extension[] = [];
    const config = await loadCliConfig(settings, extensions, 'test-session');
    // The default is defined in the yargs setup in config.ts
    expect(config.getMaxTurns()).toBe(50);
  });
});
