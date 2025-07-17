"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export const HomeView = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession();

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen p-4">
      <div>
        <p>Logged in as {session?.user?.name || "guest"}</p>
      </div>
      <Button className="w-full hover:cursor-pointer" variant={"default"} onClick={() => authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
          }
        }
      })}>Sign out</Button>
    </div>
  )
}
