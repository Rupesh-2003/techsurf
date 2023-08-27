import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Home() {
  const Router = useRouter()
  useEffect(() => {
    Router.push("/MyFiles")
  }, [])

  return (
    <>
      Hello World!
    </>
  )
}
