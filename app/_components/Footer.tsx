"use client"
import React from 'react'
import { CopyButton } from "@/components/copy-button/CopyButton"

export default function Footer() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900">
      <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6">
        <div className="flex-none md:flex text-center items-baseline justify-center space-x-6">
          For inspiration: <span className="text-slate-700 ms-1">UQBw...o5FI</span> <CopyButton text="UQBwJX9X7no3RSaiHM9dke-3sI-tS37IK_zUmvhOrzU8o5FI" /> <span className="ms-3">| &hearts; Toncoin</span>
        </div>
      </footer>
    </div>
  )
}
