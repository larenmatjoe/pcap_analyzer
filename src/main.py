from scapy.all import rdpcap
import warnings
warnings.filterwarnings("ignore")

packets = rdpcap("lib/test.pcap")

def stats():
    from lib.stats import Stats

    single = Stats(packets)
    result = single.run()
    print(result)

def protocol():
    from lib.protocol import ProtocolAnalyze

    single = ProtocolAnalyze(packets)
    result = single.analyze()
    print(result)

def magicheader():
    from lib.data import data_extractor

    single = data_extractor()
    result = single.magic_header(packets)
    print(result)

def ip():
    from lib.data import data_extractor

    single = data_extractor()
    result = single.ip_data(packets)
    print(result)

def data():
    from lib.data import data_extractor

    regex = ".txt"
    single = data_extractor()
    result = single.extract_data(packets, regex)
    print(result)

def yara():
    from lib.search import SearchPayload

    rules = "./res/rules.yara"
    single = SearchPayload(rules, packets)
    result = single.search()
    print(result)

def ml():
    from lib.preprocess import process,get_results
    import model.ml as ML
    from scapy.all import rdpcap
    import numpy as np

    for packet in packets:
        process(packet)
    result = get_results()
    for ip in result.keys():
        size = result[ip][0]
        score = result[ip][1]
        data = np.array([size, score]).reshape(1,2)
        prediction = ML.model2.predict(data)
        print(int(prediction[0][0]*10))

#stats()
#protocol()
#magicheader()
#ip()
#data()
#yara()
#ml()
