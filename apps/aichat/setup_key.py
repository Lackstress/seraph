#!/usr/bin/env python3
import os
import sys

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
env_file = os.path.join(script_dir, '.env')
config_file = os.path.join(script_dir, 'config.js')

print("🔑 OpenRouter API Key Setup")
print("-" * 40)

# Get API key from user
api_key = input("Enter your OpenRouter API key: ").strip()

if not api_key:
    print("❌ Error: API key cannot be empty")
    sys.exit(1)

# Write to .env file
with open(env_file, 'w') as f:
    f.write(f"OPENROUTER_API_KEY={api_key}\n")
    f.write("PORT=3000\n")

print(f"✅ API key saved to .env file")

# Also update config.js for direct use
config_content = f"""// OpenRouter API Configuration
// Auto-generated - DO NOT EDIT MANUALLY
const OPENROUTER_API_KEY = '{api_key}';
"""

with open(config_file, 'w') as f:
    f.write(config_content)

print(f"✅ config.js updated")
print("\n✨ Setup complete!")

