import tensorflow as tf
import numpy as np
from collections import Counter
from math import log2

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

# Example usage
data = b"\x34"  # Binary data
entropy_tf = calculate_binary_entropy_tf(data)
print(f"Entropy of the binary data (using TensorFlow): {entropy_tf}")

