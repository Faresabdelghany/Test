from rembg import remove
from PIL import Image
import os

# Paths
brain_dir = r"C:\Users\fares\.gemini\antigravity\brain\b6e2c87e-c594-4f12-bd4e-a45a0b43b1d3"
input_path = os.path.join(brain_dir, "clean_character_transparent_1767832222216.png")
output_path = os.path.join(brain_dir, "final_real_transparent_character.png")

print(f"Processing: {input_path}")

try:
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    output_image.save(output_path)
    print(f"Success! Saved to: {output_path}")
except Exception as e:
    print(f"Error: {e}")
