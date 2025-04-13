import numpy as np
import pandas as pd

# Set seed for reproducibility
np.random.seed(42)

# Configuration
num_samples = 90000  # Total number of samples (balanced classes)
num_benign = num_samples // 2
num_malicious = num_samples // 2

def generate_benign_samples(num_samples):
    data = []
    for _ in range(num_samples):
        # 5% of benign samples have high entropy (e.g., encrypted traffic)
        if np.random.rand() < 0.05:
            length = int(np.clip(np.random.normal(1000, 300), 50, None))
            entropy = np.clip(np.random.normal(7.5, 0.5), 0, 8)
        else:
            # Regular benign samples with length-dependent entropy
            length = int(np.clip(np.random.normal(1000, 300), 50, None))
            base_entropy = 5.0 - 0.002 * (length - 1000)
            entropy = np.clip(base_entropy + np.random.normal(0, 0.5), 0, 8)
        data.append([length, entropy, 0])
    return data

def generate_malicious_samples(num_samples):
    data = []
    for _ in range(num_samples):
        # 10% of malicious samples mimic benign characteristics
        if np.random.rand() < 0.1:
            length = int(np.clip(np.random.normal(1000, 300), 50, None))
            base_entropy = 5.0 - 0.002 * (length - 1000)
            entropy = np.clip(base_entropy + np.random.normal(0, 0.5), 0, 8)
        else:
            # Regular malicious samples with high entropy
            length = np.random.randint(50, 2501)  # 50-2500 inclusive
            entropy = np.clip(np.random.normal(7.5, 1.0), 0, 8)
        data.append([length, entropy, 1])
    return data

# Generate data
benign_data = generate_benign_samples(num_benign)
malicious_data = generate_malicious_samples(num_malicious)

# Create DataFrames and combine
df = pd.DataFrame(
    benign_data + malicious_data,
    columns=['payload_length', 'entropy_score', 'label']
)

# Shuffle the dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV
df.to_csv('dataset.csv', index=False)
print("Dataset generated successfully!")
