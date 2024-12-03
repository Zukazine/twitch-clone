"use client"

import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { ElementRef, useRef, useState, useTransition } from "react"
import { Input } from "../ui/input"
import { updateStream } from "@/actions/stream"
import { toast } from "sonner"
import { UploadDropzone } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"
import Hint from "../hint"
import { Trash } from "lucide-react"
import Image from "next/image"

interface InfoModalProps {
  initialName: string
  initialThumbnailUrl: string | null
}

export const InfoModal = ({
  initialName,
  initialThumbnailUrl
}: InfoModalProps) => {
  const router = useRouter()
  const closeRef = useRef<ElementRef<"button">>(null)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(initialName)
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onRemove = () => [
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Thumbnail removed")
          setThumbnailUrl("")
          closeRef?.current?.click()
        })
        .catch(() => toast.error("Something went wrong"))
    })
  ]

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    startTransition(() => {
      updateStream({
        name: name,

      })
      .then(() => {
        toast.success("Stream updated")
        closeRef?.current?.click()
      })
      .catch(() => toast.error("Something went wrong"))
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={"link"}
          size={"sm"}
          className="ml-auto"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Stream Info
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>
              Name
            </Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Thumbnail
            </Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hint
                    label="Remove Thumbnail"
                    asChild
                    side="left"
                  >
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemove}
                      className="h-auto w-auto p-1.5"
                    >
                      <Trash className="size-4"/>
                    </Button>
                  </Hint>
                </div>
                <Image 
                  src={thumbnailUrl}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ): (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone 
                  endpoint={"thumbnailUploader"}
                  appearance={{
                    label: {
                      color: "#FFFFFF"
                    },
                    allowedContent: {
                      color: "#FFFFFF"
                    }
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url)
                    router.refresh()
                    closeRef?.current?.click()
                  }}     
                />
              </div>
            )
          }
          </div>
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant={'ghost'}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              variant="primary"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
