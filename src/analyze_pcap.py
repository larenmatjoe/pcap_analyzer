#!usr/bin/env python3
import sys
import json
import scapy.all as scapy
import yara
import numpy as np
from collections import defaultdict
from lib.search import SearchPayload
from lib.stats import Stats
from lib.protocol import ProtocolAnalyze
from lib.data import data_extractor
from lib.preprocess import process, get_results

import model.ml as ML

def analyze_pcap(pcap_file):
    # Load the PCAP file
    packets = scapy.rdpcap(pcap_file)

    # Initialize data structures
    ip_bytes = defaultdict(int)
    port_counts = defaultdict(int)
    port_to_ip = defaultdict(list)
    protocol_counts = defaultdict(int)
    ip_connections = []

    yara_results = []
    rules = "./res/rules.yara"
    single = SearchPayload(rules,packets)
    yara_results = single.search()


    single = Stats(packets)
    result = single.run()
    ip_bytes = result[0]
    port_counts = result[2]
    port_to_ip = result[3]

    single = ProtocolAnalyze(packets)
    protocol_counts = single.analyze()

    single = data_extractor()
    results = single.ip_data(packets)
    for result1 in results:
        ip_connections.append([result1[0],result1[1]])
    # Simulate ML detection (in a real scenario, you would use a trained model)
    ml_results = []
    for packet in packets:
        process(packet)
    results = get_results()

    for ip in results.keys():
        size = results[ip][0]
        score = results[ip][1]
        data = np.array([size, score]).reshape(1,2)
        
        prediction = ML.model2.predict(data)
        print(prediction,int(prediction*10))
        ml_results.append([ip,int(prediction[0][0]*10)])

    """
    for ip, (size, entropy) in processed_data.items():
        print(f"IP: {ip}, Size: {size}, Entropy score: {entropy}")
        if size != 0:
            #data = np.array([size, entropy]).reshape(1,2)
            #print(data)
            #prediction = ML.model2.predict(data)
            #print(prediction,int(prediction*10))
            #score = 0 if entropy*10 < 5 else int(entropy*10)
            #ml_results.append([2, score])
            pass
    """
    # Prepare results
    results = {
        "stats": {
            "0": ip_bytes,
            "1": result[1],
            "2": port_counts,
            "3": {str(port): ips for port, ips in port_to_ip.items()}
        },
        "protocol": protocol_counts,
        "ip": ip_connections,
        "magicheader": single.magic_header(packets),  # In a real scenario, you would detect file signatures
        "data": ["COMING SOON"],  # In a real scenario, you would extract interesting data
        "yara": yara_results,
        "ml": ml_results
    }

    return results

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analyze_pcap.py <pcap_file>")
        sys.exit(1)

    pcap_file = sys.argv[1]
    results = analyze_pcap(pcap_file)
    print(json.dumps(results))
