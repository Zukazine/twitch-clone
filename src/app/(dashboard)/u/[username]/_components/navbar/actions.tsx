import { Button } from "@/components/ui/button"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Clapperboard, LogOut } from "lucide-react"
import Link from "next/link"

const Actions = () => {
  
  return (
    <div className="flex items-center justify-end gap-x-2">
      <Button
        size={'sm'}
        variant={'ghost'}
        asChild
        className="text-muted-foreground hover:text-primary"
      >
        <Link href={'/'}>
          <LogOut className="size-5 mr-2"/>
          Exit
        </Link>
      </Button>
      <UserButton 
        afterSignOutUrl="/"
      />
    </div>
  )
}

export default Actions
