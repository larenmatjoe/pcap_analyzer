from lib.preprocess import process
import model.ml as ML
from scapy.all import rdpcap
import numpy as np

if __name__ == "__main__":
    packets = rdpcap("lib/test.pcap")
    count = 0
    for packet in packets:
        count+=1
        if count > 50:
            break
        (size, score) = process(packet)
        if size != 0:
            data = np.array([size, score]).reshape(1,2)
            prediction = ML.model2.predict(data)
            print(prediction,int(prediction*10))

