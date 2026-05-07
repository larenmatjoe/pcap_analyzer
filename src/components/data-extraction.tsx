"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSearch } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface DataExtractionProps {
  magicHeader: string[]
  data: string[]
}

export default function DataExtraction({ magicHeader, data }: DataExtractionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" />
            Magic Header Detection
          </CardTitle>
          <CardDescription>File signatures detected in the PCAP file</CardDescription>
        </CardHeader>
        <CardContent>
          {magicHeader.length > 0 ? (
            <div className="space-y-2">
              {magicHeader.map((header, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {header}
                </Badge>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>No file signatures detected</AlertTitle>
              <AlertDescription>No magic headers were found in the analyzed PCAP file.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Extraction
          </CardTitle>
          <CardDescription>Data extracted from the PCAP file using regex pattern</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {data.map((item, index) => (
                <div key={index} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <pre className="text-sm whitespace-pre-wrap">{item}</pre>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>No data extracted</AlertTitle>
              <AlertDescription>No data matching the regex pattern was found in the PCAP file.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
