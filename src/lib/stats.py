from scapy.layers.inet import IP, TCP
from scapy.utils import rdpcap

class Stats:
    def __init__(self, packets):
        self.ipData = {}
        self.totalPackets = 0
        self.portCount = {}
        self.packets = packets
        self.ipPort = {}

    def calculate_data_consumption(self):
        for packet in self.packets:
            self.totalPackets += 1
            if packet.haslayer(IP):
                src = packet[IP].src
                dst = packet[IP].dst
                if src in self.ipData.keys():
                    self.ipData[src] += len(packet.payload)
                else:
                    self.ipData[src] = len(packet.payload)
                if dst in self.ipData.keys():
                    self.ipData[dst] += len(packet.payload)
                else:
                    self.ipData[dst] = len(packet.payload)

    def count_ports(self):
        for packet in self.packets:
            if packet.haslayer(IP) and packet.haslayer(TCP):
                sport = packet[TCP].sport
                dport = packet[TCP].dport
                if sport < 4000:
                    if sport in self.portCount.keys():
                        self.portCount[sport] += 1
                    else:
                        self.portCount[sport] = 1
                if dport < 4000:
                    if dport in self.portCount.keys():
                        self.portCount[dport] += 1
                    else:
                        self.portCount[dport] = 1

    def ip_port_relation(self):
        for packet in self.packets:
            if packet.haslayer(TCP) and packet.haslayer(IP):
                src = packet[IP].src
                dst = packet[IP].dst
                port = 0
                if packet[TCP].dport < 4000:
                    port = packet[TCP].dport
                elif packet[TCP].sport < 4000:
                    port = packet[TCP].sport
                if port:
                    if port not in self.ipPort.keys():
                        self.ipPort[port] = [src, dst]
                    else:
                        if src not in self.ipPort[port]:
                            self.ipPort[port].append(src)
                        if dst not in self.ipPort[port]:
                            self.ipPort[port].append(dst)

    def run(self) -> (dict,dict,dict,dict):
        self.calculate_data_consumption()
        self.count_ports()
        self.ip_port_relation()
        return (self.ipData, self.totalPackets, self.portCount, self.ipPort)

    def display(self):
        from pprint import pprint

        print("\n--- IP Data Consumption Statistics ---")
        pprint(self.ipData)

        print("\n--- Total Packets ---")
        print(self.totalPackets)

        print("\n--- Port Usage Statistics ---")
        pprint(self.portCount)

        print("\n--- IP-Port Relationships ---")
        pprint(self.ipPort)

if __name__ == "__main__":
    packets = rdpcap('test.pcapng')
    demo = Stats(packets)
    demo.run()
    demo.display()

