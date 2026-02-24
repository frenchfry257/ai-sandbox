import os
import requests
import json

def main():
    api_key = os.getenv("ETHERIUM_WALLET_KEY")
    if not api_key:
        print("Missing ETHERSCAN_API_KEY environment variable.")
        print('$env:ETHERSCAN_API_KEY="YOUR_KEY_HERE"')
        return 1

    # 🔥 Replace this with any public Ethereum address you want to inspect
    address = "0x6C08C077dBd193022cBaD43f4b71F7068740B86C"

    url = "https://api.etherscan.io/v2/api"

    params = {
        "chainid": "1",
        "module": "account",
        "action": "balance",
        "address": address,
        "tag": "latest",
        "apikey": api_key,
    }

    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()

    print("Full JSON response:")
    print(json.dumps(data, indent=2))

    if data.get("status") != "1":
        print("\nError:", data.get("result"))
        return 1

    wei_balance = int(data.get("result"))
    eth_balance = wei_balance / 10**18

    print("\nAddress:", address)
    print("Balance in Wei:", wei_balance)
    print("Balance in ETH:", eth_balance)

    return 0

if __name__ == "__main__":
    raise SystemExit(main())

