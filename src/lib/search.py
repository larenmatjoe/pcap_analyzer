import yara
from scapy.layers.inet import IP

class SearchPayload:
    def __init__(self, rule_path, packets):
        self.rule_path = rule_path
        self.packets = packets
        self.rules = yara.compile(filepath=self.rule_path)
        self.matches = set()

    def search(self) -> set:
        for packet in self.packets:
            try:
                # Make sure packet has a payload with load attribute
                if not hasattr(packet, 'payload') or not hasattr(packet.payload, 'load'):
                    continue

                payload = packet.payload.load
                if isinstance(payload, bytes):
                    payload = payload.decode('utf-8', errors='ignore')

                if len(payload) < 1:
                    continue

                flag = self.rules.match(data=payload)
                if flag and len(flag) > 0:
                    rule_names = [match.rule for match in flag]
                    if packet.haslayer(IP):  # Changed from 'IP' string to IP object
                        ip = packet[IP].src
                        self.matches.add((ip, ', '.join(rule_names)))
                    else:
                        self.matches.add(('unknown', ', '.join(rule_names)))
            except Exception as e:
                # Skip packets that cause errors during processing
                continue

        return self.matches

