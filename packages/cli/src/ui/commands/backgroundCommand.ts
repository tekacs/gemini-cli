/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SlashCommand,
  SlashCommandActionReturn,
  CommandContext,
} from './types.js';

export const backgroundCommand: SlashCommand = {
  name: 'background',
  altName: 'bg',
  description: 'Commands for managing background agents.',
  action: unimplementedAction,
  subCommands: [
    {
      name: 'start',
      description: 'Start a new agent with the provided prompt.',
      action: unimplementedAction,
    },
    {
      name: 'stop',
      description: 'Stops a running agent.',
      action: unimplementedAction,
    },
    {
      name: 'delete',
      description: 'Deletes an agent.',
      action: unimplementedAction,
    },
    {
      name: 'list',
      description: 'List all agents.',
      action: unimplementedAction,
    },
    {
      name: 'status',
      description: 'Displays the status of an agent.',
      action: unimplementedAction,
    },
    {
      name: 'workspace',
      description: 'Returns the workspace of an agent.',
      action: unimplementedAction,
    },
    {
      name: 'logs',
      description: 'Returns the recent logs of an agent.',
      action: unimplementedAction,
    },
  ],
};

async function unimplementedAction(
  context: CommandContext,
  args: string,
): Promise<SlashCommandActionReturn | void> {
  return {
    type: 'message',
    messageType: 'error',
    content: `This command is not yet implemented. Args: ${args}`,
  };
}
