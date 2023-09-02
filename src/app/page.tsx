import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home</h1>
      <Link className={buttonVariants()} href="/dashboard">Dashboard</Link>
    </div>
  )
}
