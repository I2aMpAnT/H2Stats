#!/usr/bin/env python3
"""
sync_identity.py - Fetch identity XLSX files from remote server and build MAC->profile mappings.

This script connects to the stats server via SFTP, reads identity XLSX files from the
private folder, extracts MAC addresses, and creates identity_mappings.json.

Usage:
    python sync_identity.py

The identity files in /home/carnagereport/stats/private/ contain MAC addresses that can be
used to link players. The filename of each identity XLSX corresponds to the player's
profile name used in game stats.

Output:
    identity_mappings.json - Maps MAC addresses to profile names
    Format: { "00:0D:3A:84:44:2F": "KidMode", ... }
"""

import paramiko
import pandas as pd
import json
import os
import io
from datetime import datetime

# Server configuration
SERVER_HOST = "104.207.143.249"
SERVER_USER = "root"
PRIVATE_STATS_PATH = "/home/carnagereport/stats/private/"

# Output file
IDENTITY_MAPPINGS_FILE = "identity_mappings.json"

def log(message):
    """Log with timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] {message}")

def save_json_file(filepath, data):
    """Save data to JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def connect_sftp():
    """Establish SFTP connection to server"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Try SSH key first, then agent
    home = os.path.expanduser("~")
    key_paths = [
        os.path.join(home, ".ssh", "id_rsa"),
        os.path.join(home, ".ssh", "id_ed25519"),
    ]

    key = None
    for kp in key_paths:
        if os.path.exists(kp):
            try:
                key = paramiko.RSAKey.from_private_key_file(kp)
                log(f"Using SSH key: {kp}")
                break
            except:
                try:
                    key = paramiko.Ed25519Key.from_private_key_file(kp)
                    log(f"Using SSH key: {kp}")
                    break
                except:
                    pass

    try:
        if key:
            ssh.connect(SERVER_HOST, username=SERVER_USER, pkey=key, timeout=30)
        else:
            log("No SSH key found, using SSH agent")
            ssh.connect(SERVER_HOST, username=SERVER_USER, timeout=30)

        return ssh, ssh.open_sftp()
    except Exception as e:
        log(f"Connection failed: {e}")
        return None, None

def extract_mac_from_identity(sftp, filepath):
    """
    Extract MAC address from an identity XLSX file.

    Identity files contain player profile information including their
    hardware MAC address used for identification.
    """
    try:
        # Read file into memory
        with sftp.file(filepath, 'rb') as f:
            file_data = io.BytesIO(f.read())

        # Try to read Excel file and find MAC address
        xl = pd.ExcelFile(file_data)

        mac_address = None

        # Common patterns for identity data in XLSX files
        for sheet_name in xl.sheet_names:
            df = pd.read_excel(file_data, sheet_name=sheet_name)
            file_data.seek(0)  # Reset for next read

            # Look for MAC-related columns (case-insensitive)
            for col in df.columns:
                col_lower = str(col).lower()
                if any(pattern in col_lower for pattern in ['mac', 'hardware', 'identifier', 'address']):
                    # Get first non-null value
                    values = df[col].dropna()
                    if len(values) > 0:
                        val = str(values.iloc[0]).strip()
                        # Validate it looks like a MAC address
                        if ':' in val or '-' in val:
                            mac_address = val.upper().replace('-', ':')
                            break

            if mac_address:
                break

        # If no MAC column found, check first column for MAC-like data
        if not mac_address:
            file_data.seek(0)
            df = pd.read_excel(file_data, sheet_name=0)
            if len(df.columns) > 0 and len(df) > 0:
                first_val = str(df.iloc[0, 0]).strip()
                if ':' in first_val or '-' in first_val:
                    mac_address = first_val.upper().replace('-', ':')

        return mac_address

    except Exception as e:
        log(f"Error reading {filepath}: {e}")
        return None

def sync_identity_data():
    """
    Main sync function - fetches identity data from server and creates identity_mappings.json
    """
    log("Starting identity sync...")

    # Connect to server
    ssh, sftp = connect_sftp()
    if not sftp:
        log("Failed to connect to server. Please check SSH configuration.")
        return False

    try:
        # List identity files in private directory
        log(f"Listing identity files in {PRIVATE_STATS_PATH}...")
        identity_files = []
        try:
            for filename in sftp.listdir(PRIVATE_STATS_PATH):
                if filename.endswith('.xlsx'):
                    identity_files.append(filename)
        except Exception as e:
            log(f"Error listing directory: {e}")
            return False

        log(f"Found {len(identity_files)} identity XLSX files")

        # Process each identity file
        # The filename (without .xlsx) IS the profile name
        identity_mappings = {}  # MAC address -> profile name

        for filename in identity_files:
            filepath = os.path.join(PRIVATE_STATS_PATH, filename)

            # The filename (without .xlsx) is the profile name used in stats
            profile_name = os.path.splitext(filename)[0]

            # Extract MAC address from the file
            mac_address = extract_mac_from_identity(sftp, filepath)

            if mac_address:
                identity_mappings[mac_address] = profile_name
                log(f"  {profile_name}: MAC={mac_address}")
            else:
                log(f"  {profile_name}: No MAC found")

        # Save identity mappings
        save_json_file(IDENTITY_MAPPINGS_FILE, identity_mappings)
        log(f"Saved {IDENTITY_MAPPINGS_FILE} with {len(identity_mappings)} mappings")

        return True

    finally:
        sftp.close()
        ssh.close()
        log("Connection closed")

if __name__ == '__main__':
    success = sync_identity_data()
    exit(0 if success else 1)
