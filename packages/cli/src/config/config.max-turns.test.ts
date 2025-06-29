/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadCliConfig } from './config';
import { Settings } from './settings';
import { Extension } from './extension';
import yargs from 'yargs/yargs';

// Mock the yargs instance
const mockYargs = {
  option: vi.fn().mockReturnThis(),
  version: vi.fn().mockReturnThis(),
  alias: vi.fn().mockReturnThis(),
  help: vi.fn().mockReturnThis(),
  strict: vi.fn().mockReturnThis(),
  argv: {} as { [key: string]: unknown },
};

vi.mock('yargs', () => ({
  __esModule: true,
  default: vi.fn(() => mockYargs),
}));

// Mock other dependencies
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
vi.mock('yargs/helpers', () => ({
  hideBin: vi.fn((x) => x),
}));

vi.mock('@google/gemini-cli-core', async () => {
  const actual = await vi.importActual('@google/gemini-cli-core');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(actual as any),
    loadServerHierarchicalMemory: vi.fn().mockResolvedValue({
      memoryContent: '',
      fileCount: 0,
    }),
    setGeminiMdFilename: vi.fn(),
    getCurrentGeminiMdFilename: vi.fn(),
  };
});

describe('loadCliConfig --max-turns', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
    vi.spyOn(process, 'cwd').mockReturnValue('/test/dir');
    // Reset argv mock before each test
    mockYargs.argv = {};
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  it('should set maxTurns from the command line', async () => {
    mockYargs.argv['max-turns'] = 5;
    const settings: Settings = {};
    const extensions: Extension[] = [];
    const config = await loadCliConfig(settings, extensions, 'test-session');
    expect(config.getMaxTurns()).toBe(5);
  });

  it('should use the default value for maxTurns when not provided', async () => {
    // No max-turns in argv, so it should be undefined
    mockYargs.argv['max-turns'] = undefined;
    const settings: Settings = {};
    const extensions: Extension[] = [];
    const config = await loadCliConfig(settings, extensions, 'test-session');
    // The constructor in core/config.ts sets it to -1 if undefined
    expect(config.getMaxTurns()).toBe(-1);
  });
});
