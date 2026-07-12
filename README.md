Modern web interface for your PCAP analysis tool that allows users to upload PCAP files and visualize the results of various analyses.

# How to Run the Application

## Clone the repo:
`
git clone https://codeberg.org/larenmat/pcap_analyzer.git
`
`
cd pcap_analyzer
`

## Install the required dependencies:
`
npm install react-force-graph-2d chart.js react-chartjs-2 lucide-react
`
`
npm install @radix-ui/react-tabs @radix-ui/react-alert-dialog @radix-ui/react-progress
`

## Start the server:
`
npm run dev
`

## How It Works

1. **File Upload**: Users can upload PCAP files through drag-and-drop or file selection
2. **Analysis**: The uploaded file is sent to the server, where a Python script (simulated in this implementation) processes it using your existing code.
3. **Visualization**: The results are displayed in an interactive dashboard with:

1. Charts for IP traffic and protocol distribution
2. Network graph for IP relationships
3. Tables for YARA rule matches
4. Visualizations for machine learning results



4. **Navigation**: Users can switch between different analysis tabs to explore various aspects of the PCAP file.
