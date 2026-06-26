console.log("🚀 GTA Extension Loaded");

const script = document.createElement("script");

script.src = chrome.runtime.getURL("inject.js");

script.setAttribute(
  "data-mission",
  chrome.runtime.getURL("mission-passed.mp3")
);

script.setAttribute(
  "data-wasted",
  chrome.runtime.getURL("wasted.mp3")
);

script.setAttribute(
  "data-accepted-img",
  chrome.runtime.getURL("gtaAcceptedImg.png")
);

script.setAttribute(
  "data-rejected-img",
  chrome.runtime.getURL("gtaRejectedImg.png")
);

(document.head || document.documentElement)
  .appendChild(script);