from re import I
import numpy as np
from collections import Counter
from scapy.all import IP, Raw

# Dictionary to store payloads for each IP
data = dict()

def calculate_binary_entropy_tf(data):
    # Convert the byte data into a list of byte values
    byte_values = list(data)

    # Calculate the frequency of each byte value
    byte_counts = Counter(byte_values)
    total_bytes = sum(byte_counts.values())

    # Calculate probabilities
    probs = np.array([count / total_bytes for count in byte_counts.values()])

    # Calculate Shannon entropy
    entropy = -np.sum(probs * np.log2(probs + 1e-10))  # Adding small epsilon to avoid log(0)

    return entropy

def process(packet):
    # Check if packet has IP and Raw layers
    if packet.haslayer(IP) and packet.haslayer(Raw):
        ip_src = packet[IP].src
        payload = packet[Raw].load

        # Initialize or append payload to the corresponding IP
        if ip_src not in data:
            data[ip_src] = bytearray()
        data[ip_src].extend(payload)

    # Return empty values since we'll calculate entropy after processing all packets
    return (0, 0)

def get_results():
    results = {}
    for ip, payload in data.items():
        size = len(payload)
        entropy = calculate_binary_entropy_tf(payload)
        results[ip] = (size, entropy)
    return results

if __name__ == "__main__":
    from scapy.all import rdpcap
    packets = rdpcap("test.pcap")
    for packet in packets:
        process(packet)

    results = get_results()

    for ip in results.keys():
        print(f"IP: {ip}, Size: {results[ip][0]}, Entropy score: {results[ip][1]}")
