'use server'

import { 
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  TrackSource,
  type CreateIngressOptions,
  IngressVideoOptions,
  IngressAudioOptions,
} from "livekit-server-sdk"

import { db } from "@/lib/db"
import { getSelf } from "@/lib/auth-service"
import { revalidatePath } from "next/cache"

const roomservice = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
)

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!)

export const resetIngresses = async (hostIdentity: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity
  })

  const rooms = await roomservice.listRooms([hostIdentity])

  for (const room of rooms) {
    await roomservice.deleteRoom(room.name)
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId)
    }
  }
}

export const createIngress = async (ingressType: IngressInput) => {
  const self = await getSelf()

  await resetIngresses(self.id)

  const options: CreateIngressOptions = {
    name: self.username,
    roomName: self.id,
    participantIdentity: self.id,
    participantName: self.username
  }

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true
  } else {
      options.video = new IngressVideoOptions({
        source: TrackSource.CAMERA,
        encodingOptions: {
          case: "preset",
          value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
        }
      });

      options.audio = new IngressAudioOptions({
        source: TrackSource.MICROPHONE,
        encodingOptions: {
          case: "preset",
          value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
        }
      })
  }

  const ingress = await ingressClient.createIngress(
    ingressType,
    options
  )

  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress")
  }

  const sanitizedIngress = {
    ingressId: ingress.ingressId,
    name: ingress.name,
    streamKey: ingress.streamKey,
    url: ingress.url,
    inputType: ingress.inputType,
    bypassTranscoding: ingress.bypassTranscoding,
    roomName: ingress.roomName,
    participantIdentity: ingress.participantIdentity,
    participantName: ingress.participantName,
    participantMetadata: ingress.participantMetadata,
    reusable: ingress.reusable,
    enableTranscoding: ingress.enableTranscoding,
    audio: ingress.audio ? { ...ingress.audio } : null,
    video: ingress.video ? { ...ingress.video } : null,
    state: ingress.state
      ? {
          status: ingress.state.status,
          error: ingress.state.error,
          roomId: ingress.state.roomId,
          startedAt: ingress.state.startedAt?.toString(),
          endedAt: ingress.state.endedAt?.toString(),
          updatedAt: ingress.state.updatedAt?.toString(),
          resourceId: ingress.state.resourceId,
          tracks: ingress.state.tracks || [],
        }
      : null,
  };

  await db.stream.update({
    where: { userId: self.id },
    data: {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey
    }
  })

  revalidatePath(`/u/${self.username}/keys`)

  return sanitizedIngress
}
