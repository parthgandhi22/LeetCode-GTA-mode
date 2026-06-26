console.log("🚀 GTA Injected");

// Get the injected script element
const script = document.querySelector(
  `script[src*="inject.js"]`
);

const MISSION =
  script?.getAttribute("data-mission");

const WASTED =
  script?.getAttribute("data-wasted");

const ACCEPTED_IMG =
  script?.getAttribute("data-accepted-img");

const REJECTED_IMG =
  script?.getAttribute("data-rejected-img");

console.log({
  MISSION,
  WASTED,
  ACCEPTED_IMG,
  REJECTED_IMG
});

let lastSubmissionId = null;

// ---------------- AUDIO ----------------

const missionAudio = new Audio(MISSION);
const wastedAudio = new Audio(WASTED);

missionAudio.preload = "auto";
wastedAudio.preload = "auto";

function play(audio) {
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;

    const p = audio.play();

    if (p) {
      p.catch(console.error);
    }
  } catch (e) {
    console.error(e);
  }
}

// ---------------- OVERLAY ----------------

function removeOverlay() {
  document.getElementById("gta-overlay")?.remove();
}

function showOverlay(type) {
  removeOverlay();

  const overlay = document.createElement("div");
  overlay.id = "gta-overlay";

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(5px);
    pointer-events: none;
    opacity: 0;
    transition: opacity 300ms ease;
  `;

  const img = document.createElement("img");

  img.src =
    type === "VICTORY"
      ? ACCEPTED_IMG
      : REJECTED_IMG;

  img.style.cssText = `
  width: min(70vw, 500px);
  max-height: 60vh;
  object-fit: contain;
  transform: scale(0.75);
  transition: transform 300ms ease;
  filter: drop-shadow(
    0 20px 40px rgba(0,0,0,0.8)
  );
`;

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    img.style.transform = "scale(0.88)";
  });

  setTimeout(() => {
    overlay.style.opacity = "0";
    img.style.transform = "scale(0.75)";

    setTimeout(() => {
      overlay.remove();
    }, 300);
  }, 3000);
}

// ---------------- LEETCODE HOOK ----------------

const originalFetch = window.fetch.bind(window);

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  try {
    const url = String(args[0]);

    if (
      url.includes("/submissions/detail/") &&
      url.includes("/check/")
    ) {
      response
        .clone()
        .json()
        .then((data) => {
          console.log("LC:", data);

          if (!data) return;

          if (data.state !== "SUCCESS") {
            return;
          }

          const id = data.submission_id;

          if (
            id &&
            id === lastSubmissionId
          ) {
            return;
          }

          lastSubmissionId = id;

          // Accepted
          if (
            data.status_code === 10 &&
            data.run_success
          ) {
            play(missionAudio);
            showOverlay("VICTORY");
          }
          // Wrong Answer / TLE / RE / MLE
          else {
            play(wastedAudio);
            showOverlay("DEFEAT");
          }
        })
        .catch(console.error);
    }
  } catch (e) {
    console.error(e);
  }

  return response;
};