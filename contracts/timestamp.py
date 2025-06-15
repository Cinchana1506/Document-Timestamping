import hashlib
from web3 import Web3
import sys
import json
import os

# === CONFIGURATION ===
RPC_URL = "https://rpc-amoy.polygon.technology"
PRIVATE_KEY = ""  #  NEVER expose this in frontend
CONTRACT_ADDRESS = ""

# === CONNECT TO BLOCKCHAIN ===
w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = w3.eth.account.from_key(PRIVATE_KEY)
address = account.address

# === LOAD ABI ===
with open("artifacts/contracts/DocumentTimestamp.sol/DocumentTimestamp.json", "r") as f:
    artifact = json.load(f)
    contract_abi = artifact["abi"]

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

# === FILE HASHING ===
def hash_file(filepath):
    with open(filepath, "rb") as f:
        file_bytes = f.read()
        return hashlib.sha256(file_bytes).digest()

# === MAIN LOGIC ===
def timestamp_document(filepath):
    file_hash = hash_file(filepath)
    print(" File Hash:", file_hash.hex())

    try:
        nonce = w3.eth.get_transaction_count(address)
        txn = contract.functions.timestampDocument(file_hash).build_transaction({
            "from": address,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": w3.eth.gas_price
        })

        
        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

        print(" Transaction sent! Tx Hash:", tx_hash.hex())
    except Exception as e:
        print(" Error sending transaction:", e)

# === ENTRY POINT ===
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(" Please provide a file path.")
        sys.exit(1)

    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(" File does not exist.")
        sys.exit(1)

    timestamp_document(filepath)
