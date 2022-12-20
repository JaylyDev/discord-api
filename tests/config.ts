import { Client } from 'minecraft-extra/discord';
import { variables } from '@minecraft/server-admin';

const BOT_TOKEN = variables.get('BOT_TOKEN');

export const client = new Client(BOT_TOKEN);
export const TEST_GUILD = variables.get('TEST_GUILD');
export const TEST_USER = variables.get('TEST_USER');
export const TEST_CHANNEL = variables.get('TEST_CHANNEL');