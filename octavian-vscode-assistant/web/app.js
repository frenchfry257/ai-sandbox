const BASE_URL = "http://localhost:1420";

const out = document.getElementById("out");
const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");
const baseUrlLabel = document.getElementById("baseUrlLabel");

baseUrlLabel.textContent = BASE_URL;

function setStatus(isOnline) {
  dot.classList.toggle("online", isOnline);
  dot.classList.toggle("offline", !isOnline);
  statusText.textContent = isOnline ? "Connected" : "Disconnected";
}

function print(obj) {
  out.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function ping() {
  try {
    const res = await fetch(`${BASE_URL}/`, { method: "GET" });
    setStatus(res.ok);
    const text = await res.text();
    print({ ok: res.ok, status: res.status, body: text });
  } catch (e) {
    setStatus(false);
    print({ ok: false, error: String(e) });
  }
}

async function health() {
  try {
    const res = await fetch(`${BASE_URL}/health`, { method: "GET" });
    setStatus(res.ok);

    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    print({ ok: res.ok, status: res.status, body });
  } catch (e) {
    setStatus(false);
    print({ ok: false, error: String(e) });
  }
}

async function sendMessage(message) {
  try {
    const res = await fetch(`${BASE_URL}/echo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    setStatus(res.ok);

    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    print({ ok: res.ok, status: res.status, body });
  } catch (e) {
    setStatus(false);
    print({ ok: false, error: String(e) });
  }
}

ping();