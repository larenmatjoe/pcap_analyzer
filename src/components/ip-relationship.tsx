"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, ArrowRight } from "lucide-react"
import ForceGraph2D from "react-force-graph-2d"

interface IpRelationshipProps {
  data: [string, string, string][]
}

interface GraphData {
  nodes: { id: string; group: number }[]
  links: { source: string; target: string; value: number }[]
}

export default function IpRelationship({ data }: IpRelationshipProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Process data for the graph
  const processData = (): GraphData => {
    const nodes = new Map<string, { id: string; group: number }>()
    const links: { source: string; target: string; value: number }[] = []

    // Extract unique IP addresses
    data.forEach(([source, target]) => {
      if (!nodes.has(source)) {
        nodes.set(source, { id: source, group: 1 })
      }
      if (!nodes.has(target)) {
        nodes.set(target, { id: target, group: 2 })
      }
    })

    // Create links
    data.forEach(([source, target]) => {
      // Check if this link already exists
      const existingLink = links.find((link) => link.source === source && link.target === target)

      if (existingLink) {
        existingLink.value += 1
      } else {
        links.push({ source, target, value: 1 })
      }
    })

    return {
      nodes: Array.from(nodes.values()),
      links,
    }
  }

  const graphData = processData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            IP Address Relationships
          </CardTitle>
          <CardDescription>Network graph showing connections between IP addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]" ref={containerRef}>
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="id"
              nodeColor={(node: any) => (node.group === 1 ? "#3b82f6" : "#ef4444")}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.25}
              linkWidth={(link: any) => Math.sqrt(link.value)}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.id
                const fontSize = 12 / globalScale
                ctx.font = `${fontSize}px Sans-Serif`
                const textWidth = ctx.measureText(label).width
                const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2)

                ctx.fillStyle = node.group === 1 ? "rgba(59, 130, 246, 0.8)" : "rgba(239, 68, 68, 0.8)"
                ctx.beginPath()
                ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI)
                ctx.fill()

                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillStyle = "#ffffff"
                ctx.fillText(label, node.x, node.y)
              }}
              width={containerRef.current?.clientWidth}
              height={600}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IP Connections</CardTitle>
          <CardDescription>Tabular view of IP address connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {data.map(([source, target, info], index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">{source}</div>
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <div className="px-2 py-1 bg-red-100 dark:bg-red-900 rounded text-sm">{target}</div>
                {info && <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">{info}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
