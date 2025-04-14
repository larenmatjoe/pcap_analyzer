from scapy.all import rdpcap

packets = rdpcap("lib/test.pcap")

def stats():
    from lib.stats import Stats

    single = Stats(packets)
    result = single.run()

def protocol():
    from lib.protocol import ProtocolAnalyze

    single = ProtocolAnalyze(packets)
    result = single.analyze()

def magicheader():
    from lib.data import data_extractor

    single = data_extractor()
    result = single.magic_header(packets)

def ip():
    from lib.data import data_extractor

    single = data_extractor()
    result = single.ip_data(packets)

def data():
    from lib.data import data_extractor

    regex = ".txt"
    single = data_extractor()
    result = single.extract_data(packets, regex)

def yara():
    from lib.search import SearchPayload

    rules = "./res/rules.yara"
    single = SearchPayload(rules, packets)
    result = single.search()
