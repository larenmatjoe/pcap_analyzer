class ProtocolAnalyze:
    def __init__(self, packets):
        self.packets = packets
        self.protocol_stats = {}

    def analyze(self):
        for packet in self.packets:
            # Check for layer names in the packet
            for layer in packet.layers():
                proto_name = layer.__name__
                if proto_name in self.protocol_stats:
                    self.protocol_stats[proto_name] += 1
                else:
                    self.protocol_stats[proto_name] = 1

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

