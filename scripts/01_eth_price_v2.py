import os
import requests

def main():
    api_key = os.getenv("ETHERSCAN_API_KEY")
    if not api_key:
        print("Missing ETHERSCAN_API_KEY environment variable.")
        return 1

    url = "https://api.etherscan.io/v2/api"
    params = {
        "chainid": "1",
        "module": "stats",
        "action": "ethprice",
        "apikey": api_key,
    }

    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()

    result = data.get("result", {})
    if not isinstance(result, dict):
        print("Unexpected response:", data)
        return 2

    print("ETH/USD:", result.get("ethusd"))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
