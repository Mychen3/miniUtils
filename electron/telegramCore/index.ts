import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

const session = new StringSession(''); // You should put your string session here
const client = new TelegramClient(session, import.meta.env.VITE_TG_API_ID, import.meta.env.VITE_TG_API_HASH, {});
