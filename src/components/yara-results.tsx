"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface YaraResultsProps {
  data: [string, string][]
}

export default function YaraResults({ data }: YaraResultsProps) {
  // Group results by IP address
  const groupedResults = data.reduce(
    (acc, [ip, rule]) => {
      if (!acc[ip]) {
        acc[ip] = []
      }
      acc[ip].push(rule)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            YARA Rule Matches
          </CardTitle>
          <CardDescription>Potential threats detected using YARA rules</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Potential threats detected</AlertTitle>
                <AlertDescription>
                  YARA rules have identified potential security threats in the PCAP file.
                </AlertDescription>
              </Alert>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Detected Threats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedResults).map(([ip, rules]) => (
                    <TableRow key={ip}>
                      <TableCell className="font-medium">{ip}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {rules.map((rule, index) => (
                            <Badge key={index} variant="destructive">
                              {rule}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Alert>
              <AlertTitle>No threats detected</AlertTitle>
              <AlertDescription>No YARA rule matches were found in the analyzed PCAP file.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
