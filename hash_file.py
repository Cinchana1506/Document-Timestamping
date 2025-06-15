import hashlib

def hash_file(file_path):
    with open(file_path, "rb") as f:
        file_bytes = f.read()
        hash_value = hashlib.sha256(file_bytes).hexdigest()
    return hash_value


