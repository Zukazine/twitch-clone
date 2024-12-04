import { isFollowingUSer } from "@/lib/follow-service"
import { getUserByUsername } from "@/lib/user-service"
import { notFound } from "next/navigation"
import { isBlockedByUser } from "@/lib/block-service"
import { StreamPlayer } from "@/components/stream-player"

interface UserPageProps {
  params: {
    username: string
  }
}

const UserPage = async ({
  params
}: UserPageProps) => {
  const resolvedParams = await params
  const user = await getUserByUsername(resolvedParams.username)

  if (!user || !user.stream){
    notFound()
  }

  const isFollowing = await isFollowingUSer(user.id)
  const isBlocked = await isBlockedByUser(user.id)

  if (isBlocked) {
    notFound()
  }

  return (
    <StreamPlayer 
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
    />
  )
}

export default UserPage
