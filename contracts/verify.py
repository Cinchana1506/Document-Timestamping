verify.py
import hashlib
from web3 import Web3
import sys
import json
const image = document.getElementById("statusImage");
# Connect to the blockchain
w3 = Web3(Web3.HTTPProvider("https://rpc-amoy.polygon.technology"))
private_key = ""
account = w3.eth.account.from_key(private_key)
address = account.address

# Load ABI
with open("artifacts/contracts/DocumentTimestamp.sol/DocumentTimestamp.json", "r") as f:
    artifact = json.load(f)
    contract_abi = artifact["abi"]

# Load Contract
contract_address = ""
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Hash the file
def hash_file(filepath):
    with open(filepath, "rb") as f:
        file_bytes = f.read()
        return hashlib.sha256(file_bytes).digest()

# Check if user gave file path
if len(sys.argv) < 2:
    print("❌ Please provide a file path.")
    sys.exit(1)

file_path = sys.argv[1]
file_hash = hash_file(file_path)
print("File Hash:", file_hash.hex())

# Verify
try:
    result = contract.functions.getTimestamp(file_hash).call()
    timestamp, submitter = result
    const image = document.getElementById("statusImage");
    const image = document.getElementById("statusImage");
    if (timestamp > 0) {
      resultDisplay.innerText =
        ` Document verified!\nTimestamp: ${new Date(timestamp * 1000)}\nSubmitter: ${submitter}`;
      image.src = "shinchan.jpg";
      image.alt = "Verified - Shinchan";
      image.style.display = "block";
    } else {
      resultDisplay.innerHTML = " Document not found on blockchain.\nI will strike you with my wand and make you noseless like Voldemort. Verify it soon!";
      image.src = "harry.jpg";
      image.alt = "Not Verified - Harry Potter";
      image.style.display = "block";
    }


except Exception as e:
    print(" Error while verifying:", e)