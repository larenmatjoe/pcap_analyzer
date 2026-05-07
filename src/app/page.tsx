"use client"

import { useState } from "react"
import { Upload, FileText, BarChart2, Network, Shield, Database, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import FileUploader from "@/components/file-uploader"
import StatsChart from "@/components/stats-chart"
import ProtocolTable from "@/components/protocol-table"
import IpRelationship from "@/components/ip-relationship"
import YaraResults from "@/components/yara-results"
import MlResults from "@/components/ml-results"
import DataExtraction from "@/components/data-extraction"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setActiveTab("upload")
    setResults(null)
  }

  const analyzePcap = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("pcapFile", file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setActiveTab("stats")
      } else {
        console.error("Failed to analyze PCAP file")
      }
    } catch (error) {
      console.error("Error analyzing PCAP file:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white">
            <CardTitle className="text-2xl font-bold">PCAP Analysis Dashboard</CardTitle>
            <CardDescription className="text-gray-100">
              Upload a PCAP file to analyze network traffic and detect potential threats
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload size={16} /> Upload
                </TabsTrigger>
                <TabsTrigger value="stats" disabled={!results} className="flex items-center gap-2">
                  <BarChart2 size={16} /> Stats
                </TabsTrigger>
                <TabsTrigger value="protocol" disabled={!results} className="flex items-center gap-2">
                  <FileText size={16} /> Protocol
                </TabsTrigger>
                <TabsTrigger value="ip" disabled={!results} className="flex items-center gap-2">
                  <Network size={16} /> IP Data
                </TabsTrigger>
                <TabsTrigger value="data" disabled={!results} className="flex items-center gap-2">
                  <Database size={16} /> Data
                </TabsTrigger>
                <TabsTrigger value="yara" disabled={!results} className="flex items-center gap-2">
                  <Shield size={16} /> YARA
                </TabsTrigger>
                <TabsTrigger value="ml" disabled={!results} className="flex items-center gap-2">
                  <Brain size={16} /> ML
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="py-4">
                <FileUploader onFileUpload={handleFileUpload} />

                {file && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Selected file: {file.name}</span>
                      <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    <Button onClick={analyzePcap} disabled={isAnalyzing} className="w-full mt-2">
                      {isAnalyzing ? "Analyzing..." : "Analyze PCAP File"}
                    </Button>

                    {isAnalyzing && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Analysis in progress...</span>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="py-4">
                {results && <StatsChart data={results.stats} />}
              </TabsContent>

              <TabsContent value="protocol" className="py-4">
                {results && <ProtocolTable data={results.protocol} />}
              </TabsContent>

              <TabsContent value="ip" className="py-4">
                {results && <IpRelationship data={results.ip} />}
              </TabsContent>

              <TabsContent value="data" className="py-4">
                {results && <DataExtraction magicHeader={results.magicheader} data={results.data} />}
              </TabsContent>

              <TabsContent value="yara" className="py-4">
                {results && <YaraResults data={results.yara} />}
              </TabsContent>

              <TabsContent value="ml" className="py-4">
                {results && <MlResults data={results.ml} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
