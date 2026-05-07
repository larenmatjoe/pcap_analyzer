"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ProtocolTableProps {
  data: {
    [protocol: string]: number
  }
}

export default function ProtocolTable({ data }: ProtocolTableProps) {
  const protocols = Object.keys(data)
  const counts = Object.values(data)
  const total = counts.reduce((sum, count) => sum + count, 0)

  // Generate colors for the chart
  const generateColors = (count: number) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360 // Golden angle approximation for good distribution
      colors.push(`hsla(${hue}, 70%, 60%, 0.8)`)
    }
    return colors
  }

  const colors = generateColors(protocols.length)

  const chartData = {
    labels: protocols,
    datasets: [
      {
        label: "Packet Count",
        data: counts,
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Protocol Distribution
            </CardTitle>
            <CardDescription>Breakdown of network protocols in the PCAP file</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Packet Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.map((protocol, index) => (
                  <TableRow key={protocol}>
                    <TableCell className="font-medium">{protocol}</TableCell>
                    <TableCell>{data[protocol]}</TableCell>
                    <TableCell className="text-right">{((data[protocol] / total) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Visualization</CardTitle>
            <CardDescription>Visual representation of protocol distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "Protocol Distribution",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
