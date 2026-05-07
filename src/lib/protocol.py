from scapy.layers.inet import TCP as TCP
from scapy.layers.inet import UDP as UDP

class ProtocolAnalyze:
    def __init__(self, packets):
        self.packets = packets
        self.protocol_stats = {}

    def analyze(self):
        for packet in self.packets:
            if packet.haslayer(TCP):
                if "TCP" in self.protocol_stats:
                    self.protocol_stats["TCP"] += 1
                else:
                    self.protocol_stats["TCP"] = 1
            elif packet.haslayer(UDP):
                if "UDP" in self.protocol_stats:
                    self.protocol_stats["UDP"] += 1
                else:
                    self.protocol_stats["UDP"] = 1
            else:
                pass

        return self.protocol_stats

    def get_top_protocols(self, limit=5):
        sorted_protocols = sorted(self.protocol_stats.items(),
                                  key=lambda x: x[1],
                                  reverse=True)
        return dict(sorted_protocols[:limit])

    def display(self):
        print("\nProtocol Distribution:")
        for protocol, count in self.protocol_stats.items():
            print(f"{protocol}: {count} packets")

