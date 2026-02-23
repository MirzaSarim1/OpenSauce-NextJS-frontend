"use client"

import { useState, useTransition } from "react"
import { toggleFollow } from "@/lib/actions/follow"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons"

export default function FollowButton({ userId, initialIsFollowing }) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        startTransition(async () => {
            const result = await toggleFollow(userId)
            if (result.success) {
                setIsFollowing(result.isFollowing)
            } else {
                console.error(result.error)
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors cursor-pointer ${isFollowing
                ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                : 'bg-orange-600 text-white hover:bg-orange-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} className="w-4 h-4" />
            {isPending ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    )
}
