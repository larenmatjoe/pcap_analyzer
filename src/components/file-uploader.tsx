"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".pcap") || file.name.endsWith(".pcapng")) {
        onFileUpload(file)
      } else {
        alert("Please upload a valid PCAP file (.pcap or .pcapng)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.name.endsWith(".pcap") || file.name.endsWith(".pcapng")) {
        onFileUpload(file)
      } else {
        alert("Please upload a valid PCAP file (.pcap or .pcapng)")
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center ${
        isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <File className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium">Upload PCAP File</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Drag and drop your .pcap file here, or click the button below to select a file
        </p>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pcap,.pcapng" className="hidden" />
        <Button onClick={handleButtonClick} className="flex items-center gap-2">
          <Upload size={16} /> Select PCAP File
        </Button>
      </div>
    </div>
  )
}
