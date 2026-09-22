// Google AdSense integration scaffold.
// Fill these two public identifiers after your AdSense site is approved.
window.ADSENSE_CONFIG = {
  client: "", // example format: ca-pub-1234567890123456
  slot: ""    // ad unit slot id from AdSense
};

window.initAdSense = function initAdSense() {
  if (window.__adsenseInitialized) return;
  const host = document.getElementById("googleAdSlot");
  if (!host) return;

  const { client, slot } = window.ADSENSE_CONFIG || {};
  const validClient = /^ca-pub-\d+$/.test(client || "");
  const validSlot = /^\d+$/.test(slot || "");

  if (!validClient || !validSlot) return;

  window.__adsenseInitialized = true;
  host.innerHTML = "";

  if (!document.querySelector('script[data-mathquiz-adsense]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    script.crossOrigin = "anonymous";
    script.dataset.mathquizAdsense = "1";
    document.head.appendChild(script);
  }

  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.style.display = "block";
  ins.dataset.adClient = client;
  ins.dataset.adSlot = slot;
  ins.dataset.adFormat = "auto";
  ins.dataset.fullWidthResponsive = "true";
  host.appendChild(ins);

  const pushAd = () => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) { console.warn("AdSense chưa sẵn sàng:", e); }
  };

  const existing = document.querySelector('script[data-mathquiz-adsense]');
  if (existing && existing.dataset.loaded === "1") {
    pushAd();
  } else if (existing) {
    existing.addEventListener("load", () => {
      existing.dataset.loaded = "1";
      pushAd();
    }, { once: true });
  }
};
