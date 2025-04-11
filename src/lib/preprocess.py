import numpy as np
from collections import Counter
from math import log2
from scapy.all import TCP, UDP, Raw

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
    if packet.haslayer(Raw):
        payload = packet.payload.load
        size = len(payload)
        entropy = calculate_binary_entropy_tf(payload)
        return (size, entropy)
    else:
        return (0, 0)

if __name__ == "__main__":
    from scapy.all import rdpcap
    packets = rdpcap("test.pcap")
    for packet in packets:
        (size, entro) = process(packet)
        if size !=0:
            print("Size : ",size," Entropy score : ",entro)
