import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function setupScrolly(scrollyEl) {
  const videoEl = scrollyEl.querySelector("video");
  if (!videoEl || !Number.isFinite(videoEl.duration) || videoEl.duration <= 0) {
    return;
  }

  videoEl.currentTime = 0;
  videoEl.pause();

  let rawProgress = 0;
  let smoothProgress = 0;
  let rafScheduled = false;

  function syncVideoFrame() {
    rafScheduled = false;
    const nextTime = smoothProgress * videoEl.duration;

    if (Math.abs(videoEl.currentTime - nextTime) > 0.016) {
      videoEl.currentTime = nextTime;
    }
  }

  ScrollTrigger.create({
    trigger: scrollyEl,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => { rawProgress = self.progress; },
  });

  gsap.ticker.add(() => {
    smoothProgress += (rawProgress - smoothProgress) * 0.07;

    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(syncVideoFrame);
    }
  });

  scrollyEl.querySelectorAll(".step").forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 60%",
      end: "bottom 40%",
      onEnter:     () => step.classList.add("is-active"),
      onLeave:     () => step.classList.remove("is-active"),
      onEnterBack: () => step.classList.add("is-active"),
      onLeaveBack: () => step.classList.remove("is-active"),
    });
  });
}

function initAll() {
  document.querySelectorAll(".scrolly").forEach((scrollyEl) => {
    const videoEl = scrollyEl.querySelector("video");

    if (videoEl.readyState >= 1) {
      setupScrolly(scrollyEl);
    } else {
      videoEl.addEventListener("loadedmetadata", () => setupScrolly(scrollyEl), { once: true });
    }
  });
}

initAll();
