import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
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
