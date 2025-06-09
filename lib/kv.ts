"use server";

import { kv } from "@vercel/kv";
import { Analysis } from "@/app/analyzer/analyze";
import { RevnetTerms } from "@/lib/schemas";

// Type for chat messages
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

// Type for chat metadata
export interface ChatMetadata {
  analysis: Analysis;
  terms?: RevnetTerms;
  createdAt: number;
  updatedAt: number;
}

// Check if KV is configured
const isKVConfigured = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

/** Store chat metadata (analysis, terms, etc.) */
export async function setChatMetadata(chatId: string, metadata: ChatMetadata) {
  if (!isKVConfigured()) {
    console.warn("Vercel KV not configured - metadata won't be persisted");
    return;
  }

  try {
    const key = `chat-meta:${chatId}`;
    // Set with same TTL as messages (60 days)
    await kv.set(key, JSON.stringify(metadata), { ex: 60 * 24 * 60 * 60 });
  } catch (error) {
    console.error("Error storing chat metadata:", error);
  }
}

/** Get chat metadata */
export async function getChatMetadata(
  chatId: string
): Promise<ChatMetadata | null> {
  if (!isKVConfigured()) {
    console.warn("Vercel KV not configured - returning null metadata");
    return null;
  }

  try {
    const key = `chat-meta:${chatId}`;
    const raw = await kv.get(key);
    if (!raw) return null;

    // Handle both string and object responses
    if (typeof raw === "string") {
      return JSON.parse(raw) as ChatMetadata;
    } else {
      return raw as ChatMetadata;
    }
  } catch (error) {
    console.error("Error getting chat metadata:", error);
    return null;
  }
}

/** Update terms in chat metadata */
export async function updateChatTerms(chatId: string, terms: RevnetTerms) {
  const metadata = await getChatMetadata(chatId);
  if (metadata) {
    metadata.terms = terms;
    metadata.updatedAt = Date.now();
    await setChatMetadata(chatId, metadata);
  }
}

/** Append a message object to the chat */
export async function appendToChat(chatId: string, message: ChatMessage) {
  if (!isKVConfigured()) {
    console.warn("Vercel KV not configured - messages won't be persisted");
    return;
  }

  try {
    const key = `chat:${chatId}`;

    // Add timestamp if not present
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || Date.now(),
    };

    // Check if this is the first message
    const exists = await kv.exists(key);

    // Append the message
    await kv.rpush(key, JSON.stringify(messageWithTimestamp));

    // Set TTL only on first message (60 days)
    if (!exists) {
      await kv.expire(key, 60 * 24 * 60 * 60);
    }
  } catch (error) {
    console.error("Error appending to chat:", error);
    // Don't throw - allow the app to continue working
  }
}

/** Get full transcript (oldest→newest) */
export async function getTranscript(chatId: string): Promise<ChatMessage[]> {
  if (!isKVConfigured()) {
    console.warn("Vercel KV not configured - returning empty transcript");
    return [];
  }

  try {
    const raw = await kv.lrange(`chat:${chatId}`, 0, -1);
    return raw.map((item) => {
      // Handle both cases: item might be a JSON string or already an object
      if (typeof item === "string") {
        return JSON.parse(item) as ChatMessage;
      } else {
        // Item is already an object
        return item as ChatMessage;
      }
    });
  } catch (error) {
    console.error("Error getting transcript:", error);
    return [];
  }
}
