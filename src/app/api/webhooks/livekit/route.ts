import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
)

export async function POST(req: Request){
  const body = await req.text()
  const headerPayload = await headers()
  const authorization = headerPayload.get("Authorization")

  if (!authorization) {
    return new Response("No authorization header", { status: 400 })
  }

  const event = receiver.receive(body, authorization)

  try {
    const event = await receiver.receive(body, authorization);

    if (event.event === "ingress_started") {
      await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
      });
      return new Response("Ingress started event handled", { status: 200 });
    }

    if (event.event === "ingress_ended") {
      await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });
      return new Response("Ingress ended event handled", { status: 200 });
    }

    return new Response("Unhandled event type", { status: 400 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }

}