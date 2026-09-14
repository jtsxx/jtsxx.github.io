const WALLET = "A2x1TegBj9fy27TtVidez6PyR8boe4ZTqxArX2qrf9q5";

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 2200);
}

function copyWallet() {
  navigator.clipboard.writeText(WALLET).then(() => toast("Wallet address copied")).catch(() => {
    toast(WALLET);
  });
}

function openWallet() {
  window.open(`https://solscan.io/account/${WALLET}`, "_blank");
}

function notifyMe(e) {
  e.preventDefault();
  const email = document.getElementById("email")?.value?.trim();
  if (!email || !email.includes("@")) {
    toast("Enter a valid email");
    return;
  }
  const list = JSON.parse(localStorage.getItem("cabai-notify") || "[]");
  if (!list.includes(email)) list.push(email);
  localStorage.setItem("cabai-notify", JSON.stringify(list));
  toast("You're on the launch list. No noise.");
  e.target.reset();
}

function toggleMenu() {
  document.getElementById("mobileMenu")?.classList.toggle("open");
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  const open = item.classList.contains("open");
  document.querySelectorAll(".faq-item").forEach((n) => n.classList.remove("open"));
  if (!open) item.classList.add("open");
}

const state = {
  vehicle: "one",
  fare: { one: 18.4, xl: 24.9, share: 9.6 }
};

function selectCar(id) {
  state.vehicle = id;
  document.querySelectorAll(".car").forEach((c) => c.classList.remove("selected"));
  document.getElementById("car-" + id)?.classList.add("selected");
  updateFare();
}

function haversineish(a, b) {
  if (!a || !b) return null;
  const n = Math.abs(a.length - b.length) + Math.min(a.length, b.length) / 12;
  return Math.max(1.2, Math.min(18.6, n * 0.35));
}

function updateFare() {
  const pick = document.getElementById("pickup")?.value || "";
  const drop = document.getElementById("dest")?.value || "";
  const miles = haversineish(pick, drop);
  const base = state.fare[state.vehicle];
  const fare = miles ? (base + miles * 1.15).toFixed(2) : "0.00";
  const mins = miles ? Math.round(miles * 3.4 + 4) : "—";
  const fareEl = document.getElementById("fare");
  if (!fareEl) return;
  fareEl.textContent = "$" + fare;
  document.getElementById("distance").textContent = miles ? miles.toFixed(1) + " mi" : "—";
  document.getElementById("triptime").textContent = miles ? mins + " min" : "—";
  document.getElementById("pickupin").textContent = miles ? "3 min" : "—";
  const names = { one: "CABAI ONE", xl: "CABAI XL", share: "CABAI SHARE" };
  document.getElementById("orderLabel").textContent = "ORDER " + names[state.vehicle];
}

function orderRide() {
  const pick = document.getElementById("pickup")?.value;
  const drop = document.getElementById("dest")?.value;
  if (!pick || !drop) {
    toast("Add pickup and destination to simulate");
    return;
  }
  toast("Simulation only — no real ride, payment, or vehicle.");
}

document.addEventListener("DOMContentLoaded", () => {
  ["pickup", "dest"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateFare);
  });
});
