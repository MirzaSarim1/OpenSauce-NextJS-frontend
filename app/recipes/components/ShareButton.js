"use client"

import { useState } from "react"

export default function ShareButton({ recipe, url }) {
    const [showMenu, setShowMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    const shareTitle = recipe.title
    const shareDescription = recipe.description || `Check out this ${recipe.difficulty.toLowerCase()} ${recipe.cuisine || ''} recipe!`
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const shareImage = recipe.image || ''

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(shareDescription)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
    }

    const handleShare = (platform) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400')
        setShowMenu(false)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
                setShowMenu(false)
            }, 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-500 transition-all font-medium cursor-pointer"
            >
                <i className="fa-solid fa-share-nodes"></i>
                <span className="hidden sm:inline">Share</span>
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />

                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-50">
                        <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                Share this recipe
                            </p>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                                    <i className="fab fa-facebook-f text-white text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    Facebook
                                </span>
                            </button>

                            <button
                                onClick={() => handleShare('twitter')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                    <i className="fab fa-twitter text-white text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    Twitter
                                </span>
                            </button>

                            <button
                                onClick={() => handleShare('pinterest')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#E60023] flex items-center justify-center">
                                    <i className="fab fa-pinterest-p text-white text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    Pinterest
                                </span>
                            </button>

                            <button
                                onClick={() => handleShare('linkedin')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center">
                                    <i className="fab fa-linkedin-in text-white text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    LinkedIn
                                </span>
                            </button>

                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                                    <i className="fab fa-whatsapp text-white text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    WhatsApp
                                </span>
                            </button>

                            <div className="my-2 border-t border-zinc-200 dark:border-zinc-700"></div>

                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center">
                                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'} text-zinc-700 dark:text-zinc-300 text-sm`}></i>
                                </div>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {copied ? 'Link Copied!' : 'Copy Link'}
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}