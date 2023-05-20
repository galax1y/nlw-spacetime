import Image from 'next/image'
import { getUser } from '@/lib/auth'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        className="h-10 w-10 rounded-full"
        height={40}
        width={40}
        alt=""
      />

      <p className="max-w-[140px] text-sm leading-snug">
        {name}
        <a href="" className="block text-red-400 underline hover:text-red-300">
          Quero sair
        </a>
      </p>
    </div>
  )
}
