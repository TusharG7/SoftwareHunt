import { auth } from "@/auth"
import Auth from "./Auth"
import { redirect } from "next/navigation"

const page = async () => {
    const session = await auth()
    if(session) redirect('/admin')
  return (
    <Auth/>
  )
}

export default page