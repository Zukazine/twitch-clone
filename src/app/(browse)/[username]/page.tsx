import { isFollowingUSer } from "@/lib/follow-service"
import { getUserByUsername } from "@/lib/user-service"
import { notFound } from "next/navigation"
import { Actions } from "./_components/actions"

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

  if(!user) {
    notFound()
  }

  const isFollowing = await isFollowingUSer(user.id)

  return (
    <div className="flex flex-col gap-y-4">
      <p>username: {user.username}</p>
      <p>id: {user.id}</p>
      <p>is Following: {`${isFollowing}`}</p>
      <Actions userId={user.id} isFollowing={isFollowing}/>
    </div>
  )
}

export default UserPage
