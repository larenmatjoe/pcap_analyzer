import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import os from "os"

const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pcapFile = formData.get("pcapFile") as File

    if (!pcapFile) {
      return NextResponse.json({ error: "No PCAP file provided" }, { status: 400 })
    }

    // Create a temporary directory to store the uploaded file
    const tempDir = path.join(os.tmpdir(), "pcap-analysis")
    const pcapPath = path.join(tempDir, "uploaded.pcap")

    // Ensure the directory exists
    await execPromise(`mkdir -p ${tempDir}`)

    // Write the uploaded file to disk
    const buffer = Buffer.from(await pcapFile.arrayBuffer())
    await writeFile(pcapPath, buffer)

    // Call the Python script to analyze the PCAP file
    const { stdout } = await execPromise(`python3 ${process.cwd()}/analyze_pcap.py ${pcapPath}`)
    
    // Parse the JSON output from the Python script
    const results = JSON.parse(stdout)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error processing PCAP file:", error)
    return NextResponse.json({ error: "Failed to process PCAP file" }, { status: 500 })
  }
}
