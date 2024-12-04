import { isFollowingUSer } from "@/lib/follow-service"
import { getUserByUsername } from "@/lib/user-service"
import { notFound } from "next/navigation"
import { isBlockedByUser } from "@/lib/block-service"
import { StreamPlayer } from "@/components/stream-player"

type Params = Promise<{ username: string }>

const UserPage = async (props: { params: Params}) => {
  const resolvedParams = await props.params
  const user = await getUserByUsername(resolvedParams.username);

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
