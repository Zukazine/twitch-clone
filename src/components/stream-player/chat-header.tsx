'use client'

import { Skeleton } from "../ui/skeleton"

export const ChatHeader = () => {
  return (
    <div className="relative p-3 border-b">
      <p className="font-semibold text-primary text-center">
        Stream Chat
      </p>
    </div>
  )
}

export const ChatHeaderSkeleton = () => {
  return (
    <div className="relative p-3 border-b hidden md:block">
      <Skeleton className="absolute size-6 left-3 top-3"/>
      <Skeleton className="w-28 h-6 mx-auto"/>
    </div>
  )
}
