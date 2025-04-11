import csv
import random

def generate_random_entropy():
    """Generate a random entropy score between 0 and 8 (Shannon entropy range)."""
    return round(random.uniform(0, 8), 4)

def generate_random_payload_length():
    """Generate a realistic payload length (e.g., between 20 and 1500 bytes)."""
    return random.randint(20, 1500)

def generate_random_label():
    """Randomly assign 0 (benign) or 1 (suspicious)."""
    return random.randint(0, 1)

def generate_dataset(num_samples=900000, output_file='dataset.csv'):
    with open(output_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['payload_length', 'entropy_score', 'label'])

        for _ in range(num_samples):
            length = generate_random_payload_length()
            entropy = generate_random_entropy()
            label = generate_random_label()
            writer.writerow([length, entropy, label])

    print(f"Dataset with {num_samples} rows saved to {output_file}")

# === Run it ===
if __name__ == '__main__':
    generate_dataset()

