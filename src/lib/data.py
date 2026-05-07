from scapy.layers.inet import IP
from scapy.all import Raw
from scapy.utils import rdpcap
import re

class data_extractor:

    def extract_data(self, packets, regex) -> set:
        data = set()
        for packet in packets:
            if packet.haslayer(Raw):
                payload = packet[Raw].load
                if isinstance(payload, bytes):
                    try:
                        decoded = payload.decode('utf-8', errors='ignore')
                        match = re.search(regex, decoded)
                        if match:
                            data.add(match.group(0))
                    except Exception as e:
                        continue  # or optionally log the error
        return data

    def ip_data(self,packets) -> set:
        data = set()
        for packet in packets:
            if IP in packet and len(packet.payload) > 0:
                ip_src = packet[IP].src
                ip_dst = packet[IP].dst
                payload = ""
                try:
                    payload = packet.payload.load
                    if isinstance(payload, bytes):
                        payload = payload.decode('utf-8', errors='ignore')
                except (AttributeError, UnicodeDecodeError):
                    payload = ""
                if len(payload) > 1:
                    continue
                #data.add((ip_src, ip_dst, payload))
            data.add((ip_src, ip_dst))
        return data

    def magic_header(self,packets):
        headers = set()
        for packet in packets:
            if IP in packet and len(packet.payload) > 0:
                ip_src = packet[IP].src
                ip_dst = packet[IP].dst
                payload = packet.payload

                if isinstance(payload, bytes):
                    # Check for image file headers
                    if payload.startswith(b'\xff\xd8\xff'):
                        headers.add('JPEG image')
                    elif payload.startswith(b'\x89PNG\r\n\x1a\n'):
                        headers.add('PNG image')
                    elif payload.startswith(b'GIF87a') or payload.startswith(b'GIF89a'):
                        headers.add('GIF image')
                    # Check for PDF file header
                    elif payload.startswith(b'%PDF'):
                        headers.add('PDF document')
                    # Check for video file headers
                    elif payload.startswith(b'\x00\x00\x00\x18ftyp'):
                        headers.add('MP4 video')
                    elif payload.startswith(b'\x1a\x45\xdf\xa3'):
                        headers.add('MKV video')
                    # Check for audio file headers
                    elif payload.startswith(b'ID3') or payload.startswith(b'\xff\xfb'):
                        headers.add('MP3 audio')
                    elif payload.startswith(b'OggS'):
                        headers.add('OGG audio')
                    elif payload.startswith(b'fLaC'):
                        headers.add('FLAC audio')
                    # Check for additional audio file headers
                    elif payload.startswith(b'RIFF') and b'WAVE' in payload[8:12]:
                        headers.add('WAV audio')
                    # Check for additional video file headers
                    elif payload.startswith(b'RIFF') and b'AVI ' in payload[8:12]:
                        headers.add('AVI video')
                    # Check for text file header
                    elif payload.startswith(b'\xef\xbb\xbf') or payload.startswith(b'\xfe\xff') or payload.startswith(b'\xff\xfe') or payload.startswith(b'\x00\x00\xfe\xff'):
                        headers.add('Text file')
                    # Check for HTML file header
                    elif payload.startswith(b'<!DOCTYPE html') or payload.startswith(b'<html'):
                        headers.add('HTML file')
                    # Check for XML file header
                    elif payload.startswith(b'<?xml'):
                        headers.add('XML file')

        return list(headers)

if __name__ == "__main__":
    packets = rdpcap('test.pcap')
    headers = data_extractor.magic_header(packets)
    payload = data_extractor.ip_data(packets)
    print(headers)
    print(payload)

