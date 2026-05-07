"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, Network, Activity } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
)

interface StatsChartProps {
  data: {
    0: { [ip: string]: number }
    1: number
    2: { [port: string]: number }
    3: { [port: string]: string[] }
  }
}

export default function StatsChart({ data }: StatsChartProps) {
  const [chartType, setChartType] = useState("ip")

  // Extract IP addresses and their byte counts
  const ipData = data[0] || {}
  const ipAddresses = Object.keys(ipData)
  const byteValues = Object.values(ipData)

  // Extract ports and their counts
  const portData = data[2] || {}
  const ports = Object.keys(portData).map((port) => `Port ${port}`)
  const portCounts = Object.values(portData)

  // Generate colors for charts
  const generateColors = (count: number) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360 // Golden angle approximation for good distribution
      colors.push(`hsla(${hue}, 70%, 60%, 0.8)`)
    }
    return colors
  }

  const ipColors = generateColors(ipAddresses.length)
  const portColors = generateColors(ports.length)

  // Chart data for IP traffic
  const ipChartData = {
    labels: ipAddresses,
    datasets: [
      {
        label: "Traffic (bytes)",
        data: byteValues,
        backgroundColor: ipColors,
        borderColor: ipColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  }

  // Chart data for port usage
  const portChartData = {
    labels: ports,
    datasets: [
      {
        label: "Packet Count",
        data: portCounts,
        backgroundColor: portColors,
        borderColor: portColors.map((color) => color.replace("0.8", "1")),
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
              <Activity className="h-5 w-5" />
              Traffic Overview
            </CardTitle>
            <CardDescription>Summary of network traffic analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Packets:</span>
                <span className="font-bold">{data[1]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unique IP Addresses:</span>
                <span className="font-bold">{ipAddresses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Ports:</span>
                <span className="font-bold">{Object.keys(portData).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Port to IP Mapping
            </CardTitle>
            <CardDescription>IP addresses associated with each port</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[200px] overflow-y-auto">
            <div className="space-y-4">
              {Object.entries(data[3] || {}).map(([port, ips]) => (
                <div key={port} className="space-y-2">
                  <div className="font-medium">Port {port}</div>
                  <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                    {ips.map((ip, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        {ip}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Traffic Visualization</CardTitle>
            <Tabs value={chartType} onValueChange={setChartType} className="w-auto">
              <TabsList>
                <TabsTrigger value="ip" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" /> IP Traffic
                </TabsTrigger>
                <TabsTrigger value="port" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" /> Port Usage
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* IP Traffic Chart */}
            {chartType === "ip" && (
              <div className="h-[400px] flex flex-col">
                <h3 className="text-sm font-medium mb-2">IP Address Traffic Distribution (bytes)</h3>
                <div className="flex-1 w-full">
                  <Bar
                    data={ipChartData}
                    options={{
                      indexAxis: "y", // Horizontal bar chart
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const value = context.raw as number
                              return `${value.toLocaleString()} bytes`
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Bytes",
                          },
                          ticks: {
                            callback: (value) => Number(value).toLocaleString(),
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "IP Address",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Port Usage Chart */}
            {chartType === "port" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                  <h3 className="text-sm font-medium mb-2">Port Usage Distribution</h3>
                  <div className="h-full flex items-center justify-center">
                    <Doughnut
                      data={portChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.raw as number
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number
                                const percentage = Math.round((value / total) * 100)
                                return `${value} packets (${percentage}%)`
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="h-[400px]">
                  <h3 className="text-sm font-medium mb-2">Port Usage Comparison</h3>
                  <div className="h-full">
                    <Bar
                      data={portChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: "Packet Count",
                            },
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

