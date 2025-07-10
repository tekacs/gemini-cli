/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi } from 'vitest';

// Mock child_process
vi.mock('node:child_process', () => ({
  exec: vi.fn(),
  execSync: vi.fn(),
  spawn: vi.fn(() => ({
    on: vi.fn(),
    stdout: { on: vi.fn() },
    stderr: { on: vi.fn() },
  })),
}));

// Mock fs and fs/promises
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    realpathSync: vi.fn((path) => path),
    writeFileSync: vi.fn(),
  },
}));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

// Mock os
vi.mock('node:os', () => ({
  default: {
    platform: vi.fn(),
    homedir: vi.fn(),
    tmpdir: vi.fn(),
  },
}));

import { start_sandbox } from './sandbox';
import { execSync, spawn, ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import { SandboxConfig } from '@google/gemini-cli-core';

describe('sandbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('start_sandbox with sandbox-exec', () => {
    it('should execute sandbox-exec with the correct arguments', async () => {
      const config: SandboxConfig = {
        command: 'sandbox-exec',
        image: '',
      };
      vi.spyOn(os, 'platform').mockReturnValue('darwin');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'realpathSync').mockImplementation((path) => path as string);
      vi.mocked(execSync).mockReturnValue(Buffer.from('/tmp/cache'));

      const spawnOn = vi.fn((event, callback) => {
        if (event === 'close') {
          callback();
        }
      });
      vi.mocked(spawn).mockReturnValue({
        on: spawnOn,
      } as unknown as ChildProcess);

      await start_sandbox(config);

      expect(spawn).toHaveBeenCalledWith('sandbox-exec', expect.any(Array), {
        stdio: 'inherit',
      });
      expect(spawnOn).toHaveBeenCalledWith('close', expect.any(Function));
    });
  });
});
