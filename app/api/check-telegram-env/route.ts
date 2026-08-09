import { NextResponse } from 'next/server';

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  return NextResponse.json({
    botTokenExists: !!botToken,
    botTokenLength: botToken?.length || 0,
    chatIdExists: !!chatId,
    chatIdValue: chatId || 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('TELEGRAM')),
    timestamp: new Date().toISOString()
  });
}
