/**
 * WorksWheel - 3D Vertical Drum & Ring Portfolio Index Component
 * Vanilla JavaScript Implementation of the WorksWheel Component
 */

const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
const BOW = 1.82;
const TITLE = 0.115; // ring label and front-card title
const INDEX = 0.038; // the index down the right-hand side
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;
const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export const DEFAULT_WORKS = [
  {
    title: "Face & Hand Tracking",
    subtitle: "VisionAI • Real-Time Landmark Telemetry",
    description: "Real-time facial detection with confidence scoring and 21-point hand landmark tracking running client-side in the browser via MediaPipe Vision.",
    image: "assets/face_hand_tracking_concept.jpg",
    src: "assets/face_hand_tracking_concept.jpg",
    href: "https://github.com/shavedXpixel/face-hand-tracking",
    link: "https://github.com/shavedXpixel/face-hand-tracking",
    stats: "Real-Time Webcam Inference • MediaPipe Tasks Vision • 21 Hand Landmarks",
    tools: ["React 19", "TypeScript", "Vite", "MediaPipe Vision"],
    deliverables: ["Real-Time Video Ingestion Pipeline", "Facial Landmark Mesh & Bounding", "Hand Skeleton Tracking", "Interactive Web Visualizer Canvas"]
  },
  {
    title: "YOLOv5 Autonomous Perception",
    subtitle: "Computer Vision & Traffic Detection",
    description: "Intelligent perception system trained with PyTorch YOLOv5 to detect critical traffic objects (vehicles, pedestrians, cyclists, road signs) with dynamic IoU thresholds.",
    image: "assets/yolov5_selfdriving_concept.jpg",
    src: "assets/yolov5_selfdriving_concept.jpg",
    href: "https://github.com/shavedXpixel/YOLOv5-SelfDriving",
    link: "https://github.com/shavedXpixel/YOLOv5-SelfDriving",
    stats: "PyTorch YOLOv5 Architecture • Multi-Class Road Detection • Real-Time Inference",
    tools: ["Python", "PyTorch", "YOLOv5", "OpenCV", "Flask"],
    deliverables: ["Real-Time Object Detection Pipeline", "Configurable IoU & Confidence Thresholds", "Selective Traffic Class Filters", "Dark-Themed Telemetry Dashboard"]
  },
  {
    title: "Weather Prediction Model",
    subtitle: "Meteorological Forecasting & Regression",
    description: "Data analytics and machine learning pipeline analyzing historical meteorological telemetry from Open-Meteo Archive API to model weather patterns and regression trends.",
    image: "assets/weather_prediction_concept.jpg",
    src: "assets/weather_prediction_concept.jpg",
    href: "https://github.com/shavedXpixel/weather-prediction-internship",
    link: "https://github.com/shavedXpixel/weather-prediction-internship",
    stats: "Open-Meteo API Ingestion • Multi-Variable Regression • Scikit-Learn Model",
    tools: ["Python", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    deliverables: ["Automated Archive API Ingestion", "Historical Time-Frame Feature Engineering", "Linear Regression Training", "Comparative Plot & Visualization"]
  },
  {
    title: "Stock Trend Predictor",
    subtitle: "Financial Time-Series & Regression Engine",
    description: "Quantitative financial modeling service downloading real-time stock ticker history via yfinance and forecasting projected price trajectories using scikit-learn regression.",
    image: "assets/stock_predictor_concept.jpg",
    src: "assets/stock_predictor_concept.jpg",
    href: "https://github.com/shavedXpixel/stock-predictor",
    link: "https://github.com/shavedXpixel/stock-predictor",
    stats: "Yahoo Finance Telemetry • 30-Day Forward Forecasting • FastAPI Service",
    tools: ["Python", "yfinance", "scikit-learn", "FastAPI", "Pandas"],
    deliverables: ["Automated Multi-Year Ticker Fetching", "Time-Shifted Forward Horizon Modeling", "FastAPI Prediction Endpoint", "Trend Visualization Canvas"]
  },
  {
    title: "Used Car Valuation ML",
    subtitle: "Automotive Regression Modeling",
    description: "End-to-end machine learning regression system estimating fair market pre-owned car valuation based on depreciation curves, mileage, displacement, and fuel type.",
    image: "assets/used_car_prediction_concept.jpg",
    src: "assets/used_car_prediction_concept.jpg",
    href: "https://github.com/shavedXpixel/used-car-price-prediction-ml",
    link: "https://github.com/shavedXpixel/used-car-price-prediction-ml",
    stats: "Multi-Feature Regression • Depreciation Analytics • Evaluated on Real Market Data",
    tools: ["Python", "Jupyter", "scikit-learn", "Pandas", "NumPy"],
    deliverables: ["Exploratory Data Analysis & Outlier Handling", "Feature Correlation & Encoding Pipeline", "Regression Valuation Estimator", "Comprehensive Project Analysis Report"]
  },
  {
    title: "AI CRM Platform",
    subtitle: "Intelligent Customer Relationship Analytics",
    description: "Full-stack client relationship management platform featuring dynamic visual analytics, interactive pipeline charts, and fluid interface animations.",
    image: "assets/ai_crm_concept.jpg",
    src: "assets/ai_crm_concept.jpg",
    href: "https://github.com/shavedXpixel/ai-crm",
    link: "https://github.com/shavedXpixel/ai-crm",
    stats: "Modern CRM Architecture • Real-Time Chart.js Visuals • Framer Motion",
    tools: ["React 19", "Vite", "Node.js", "Express", "Chart.js", "Framer Motion"],
    deliverables: ["Interactive Analytics Dashboard", "Client Pipeline State Management", "Data Visualization Suite", "Responsive RESTful Backend"]
  }
];

export function initWorksWheel(container, options = {}) {
  if (!container) return null;

  const items = options.items || DEFAULT_WORKS;
  const label = options.label || "Works '26";
  const action = options.action !== undefined ? options.action : "View";
  const onSelect = options.onSelect || null;

  const count = items.length;
  const last = Math.max(count - 1, 0);

  let turn = 0;
  let target = 0;
  let active = 0;
  let stage = { w: container.clientWidth || 800, h: container.clientHeight || 600 };
  let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Drag & click state
  let isPointerDown = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastY = 0;
  let dragCapturedPointerId = null;
  const DRAG_THRESHOLD = 6; // pixels

  // Build DOM Structure
  container.innerHTML = "";
  container.classList.add("relative", "w-full", "h-full", "overflow-hidden", "select-none");

  const section = document.createElement("section");
  section.setAttribute("aria-label", label);
  section.className = "relative w-full h-full min-h-[24rem] overflow-hidden select-none bg-transparent text-neutral-900";

  // Stage (perspective container)
  const stageEl = document.createElement("div");
  stageEl.tabIndex = 0;
  stageEl.role = "listbox";
  stageEl.setAttribute("aria-label", label);
  stageEl.className = "absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:outline-neutral-900 focus-visible:-outline-offset-4 active:cursor-grabbing";

  // Wheel (preserve-3d anchor)
  const wheelEl = document.createElement("div");
  wheelEl.className = "absolute top-1/2 left-1/2 pointer-events-none transition-none";
  wheelEl.style.transformStyle = "preserve-3d";

  // Cards
  const cardRefs = [];
  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.id = `works-wheel-${i}`;
    card.role = "option";
    card.tabIndex = 0;
    card.setAttribute("aria-selected", i === 0 ? "true" : "false");
    card.setAttribute("aria-label", `${item.title} — Click or press Enter to view details`);
    card.className = "group absolute cursor-pointer pointer-events-auto [backface-visibility:hidden] focus-visible:ring-2 focus-visible:ring-black rounded-2xl outline-none";
    card.style.transformStyle = "preserve-3d";
    card.style.willChange = "transform, opacity";

    const face = document.createElement("div");
    face.className = "relative block w-full h-full overflow-hidden rounded-2xl bg-white border border-neutral-300/80 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_28px_50px_-10px_rgba(0,0,0,0.22)] hover:border-neutral-500";
    face.style.willChange = "transform";
    face.style.transformOrigin = "center center";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.draggable = false;
    img.className = "w-full h-full object-cover select-none pointer-events-none";
    img.loading = "eager";

    face.appendChild(img);

    // Subtle gradient overlay for card readability
    const gradientOverlay = document.createElement("div");
    gradientOverlay.className = "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent";
    face.appendChild(gradientOverlay);

    // Bottom subtle info badge on card with fully functional VIEW button
    const cardInfo = document.createElement("div");
    cardInfo.className = "pointer-events-auto absolute left-3.5 bottom-3.5 right-3.5 flex items-center justify-between z-20";

    const cardTitle = document.createElement("span");
    cardTitle.className = "text-[11px] font-mono tracking-wider text-white drop-shadow font-semibold truncate max-w-[65%] select-none pointer-events-none";
    cardTitle.textContent = item.title;

    // Fully accessible, functional VIEW ↗ link button
    const viewBtn = document.createElement("a");
    viewBtn.href = item.href || item.link;
    viewBtn.target = "_blank";
    viewBtn.rel = "noopener noreferrer";
    viewBtn.className = "view-project-btn pointer-events-auto cursor-pointer bg-white/95 hover:bg-white text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-black";
    viewBtn.setAttribute("aria-label", `View ${item.title} repository in a new tab`);
    viewBtn.setAttribute("title", `Open ${item.title} repository in new tab`);
    viewBtn.innerHTML = `<span>${action} ↗</span>`;

    // Intercept drag so direct button clicks open link cleanly
    const handleViewClick = (e) => {
      if (isDragging) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();
    };
    viewBtn.addEventListener("click", handleViewClick);
    viewBtn.addEventListener("touchend", handleViewClick);

    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(viewBtn);
    face.appendChild(cardInfo);
    card.appendChild(face);

    // Click on card body opens project modal for active card or rotates to non-active card
    const handleCardActivate = (e) => {
      if (isDragging) return;
      if (active === i) {
        if (onSelect) {
          onSelect(i, item);
        } else if (window.openProjectModal) {
          window.openProjectModal(item);
        } else if (item.href && item.href.startsWith("http")) {
          window.open(item.href, "_blank", "noopener,noreferrer");
        }
      } else {
        to(i + 1);
      }
    };

    card.addEventListener("click", handleCardActivate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardActivate(e);
      }
    });

    wheelEl.appendChild(card);
    cardRefs.push(card);
  });

  stageEl.appendChild(wheelEl);
  section.appendChild(stageEl);

  // Center ring label ("Works '26" or "Landing Pages")
  const labelEl = document.createElement("div");
  labelEl.className = "pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-black uppercase text-center text-neutral-900 select-none z-10 transition-opacity duration-300";
  labelEl.textContent = label;
  section.appendChild(labelEl);

  // Front-card title - responsive positioning prevents any card collision
  const titleEl = document.createElement("div");
  titleEl.className = "pointer-events-none absolute tracking-tight font-black uppercase text-neutral-900 opacity-0 select-none z-10 leading-[1.05] transition-opacity duration-300";
  titleEl.textContent = items[0] ? items[0].title : "";
  section.appendChild(titleEl);

  // Side Index List
  const indexList = document.createElement("ol");
  indexList.className = "text-neutral-500 absolute top-[7%] right-[3%] text-right leading-[1.75] z-20 space-y-0.5 select-none font-mono";
  const indexButtons = [];

  items.forEach((item, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Jump to project: ${item.title}`);
    if (i === 0) {
      btn.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-black mr-2 align-middle"></span><span class="text-neutral-900 font-extrabold underline decoration-2 underline-offset-4">${item.title}</span>`;
      btn.className = "cursor-pointer transition-all duration-200 text-[10px] md:text-xs tracking-wider outline-none block ml-auto scale-105";
    } else {
      btn.innerHTML = `<span>${item.title}</span>`;
      btn.className = "cursor-pointer transition-all duration-200 text-[10px] md:text-xs tracking-wider outline-none text-neutral-400 hover:text-neutral-900 block ml-auto";
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      to(i + 1);
    });
    li.appendChild(btn);
    indexList.appendChild(li);
    indexButtons.push(btn);
  });
  section.appendChild(indexList);

  // Bottom helper pill
  const hintPill = document.createElement("div");
  hintPill.className = "pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200 shadow-sm backdrop-blur-md text-[10px] md:text-[11px] font-mono text-neutral-600 uppercase tracking-wider";
  hintPill.innerHTML = `
    <svg class="w-3 h-3 text-neutral-500 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>SCROLL OR DRAG DRUM TO CYCLE</span>
  `;
  section.appendChild(hintPill);

  container.appendChild(section);

  // Geometry computation
  let currentMetrics = calculateMetrics();

  function calculateMetrics() {
    const w = stage.w || 800;
    const h = stage.h || 600;
    const isMobile = w < 768;
    const isTablet = w >= 768 && w < 1024;

    // Responsive card dimensions: tablet and mobile cards scaled for clear visibility without crowding
    const maxWFactor = isMobile ? 0.58 : isTablet ? 0.31 : 0.33;
    const cardHFactor = isMobile ? 0.28 : CARD_H;

    const cardW = Math.min(h * cardHFactor * CARD_RATIO, w * maxWFactor);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(22, cardH * TITLE),
      index: Math.max(10, cardH * INDEX),
    };
  }

  function applyMetrics() {
    currentMetrics = calculateMetrics();
    stageEl.style.perspective = `${currentMetrics.depth}px`;

    cardRefs.forEach((card) => {
      card.style.width = `${currentMetrics.cardW}px`;
      card.style.height = `${currentMetrics.cardH}px`;
      card.style.marginLeft = `${-currentMetrics.cardW / 2}px`;
      card.style.marginTop = `${-currentMetrics.cardH / 2}px`;
    });

    const w = stage.w || 800;
    labelEl.style.fontSize = `${currentMetrics.title}px`;

    if (w >= 1024) {
      // Desktop: left-aligned dramatic heading vertically centered with dedicated reserved width
      titleEl.style.fontSize = `${Math.min(36, Math.max(24, currentMetrics.cardH * 0.135))}px`;
      titleEl.style.top = "50%";
      titleEl.style.left = "6%";
      titleEl.style.transform = "translateY(-50%)";
      titleEl.style.maxWidth = "28%";
      titleEl.style.textAlign = "left";

      indexList.style.top = "7%";
      indexList.style.right = "3%";
      indexList.style.maxWidth = "260px";
      indexList.style.fontSize = "12px";
      indexList.style.lineHeight = "1.75";
    } else if (w >= 768) {
      // Tablet: 3-column layout with left heading, center wheel, and right index list
      titleEl.style.fontSize = `${Math.min(24, Math.max(19, currentMetrics.cardH * 0.13))}px`;
      titleEl.style.top = "50%";
      titleEl.style.left = "4%";
      titleEl.style.transform = "translateY(-50%)";
      titleEl.style.maxWidth = "28%";
      titleEl.style.textAlign = "left";

      indexList.style.top = "7%";
      indexList.style.right = "2.5%";
      indexList.style.maxWidth = "200px";
      indexList.style.fontSize = "11px";
      indexList.style.lineHeight = "1.65";
    } else {
      // Mobile: heading sits cleanly at top, index list below it on right, card deck centered in lower area
      titleEl.style.fontSize = "19px";
      titleEl.style.top = "3%";
      titleEl.style.left = "4%";
      titleEl.style.transform = "none";
      titleEl.style.maxWidth = "92%";
      titleEl.style.textAlign = "left";

      indexList.style.top = "76px";
      indexList.style.right = "4%";
      indexList.style.maxWidth = "65%";
      indexList.style.fontSize = "9.5px";
      indexList.style.lineHeight = "1.55";
    }
  }

  applyMetrics();

  // ResizeObserver
  const ro = new ResizeObserver(() => {
    stage = { w: stageEl.clientWidth, h: stageEl.clientHeight };
    applyMetrics();
  });
  ro.observe(stageEl);

  // Target steering
  function to(next) {
    target = clamp(next, 0, last + 1);
  }

  // Wheel interaction
  let settlingTimer = null;
  const onWheel = (event) => {
    const delta = event.deltaY;
    const next = target + delta / WHEEL_UNITS;
    // Native listener: cancellable only while inside wheel range so page scrolls on at edges
    if (next > 0 && next < last + 1) {
      event.preventDefault();
    }
    to(next);
    clearTimeout(settlingTimer);
    settlingTimer = setTimeout(() => {
      to(Math.round(target));
    }, SETTLE);
  };
  stageEl.addEventListener("wheel", onWheel, { passive: false });

  // Pointer drag interaction (with drag threshold so clicks are not swallowed)
  stageEl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    // Let button or link clicks pass through without initiating wheel drag
    if (event.target.closest("a, button")) {
      return;
    }
    isPointerDown = true;
    isDragging = false;
    startX = event.clientX;
    startY = event.clientY;
    lastY = event.clientY;
    dragCapturedPointerId = event.pointerId;
  });

  stageEl.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;
    const dist = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (!isDragging && dist > DRAG_THRESHOLD) {
      isDragging = true;
      try {
        stageEl.setPointerCapture(event.pointerId);
      } catch (_) {}
    }
    if (isDragging) {
      const diff = lastY - event.clientY;
      to(target + diff / DRAG_UNITS);
      lastY = event.clientY;
    }
  });

  const endDrag = (event) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (dragCapturedPointerId !== null && stageEl.hasPointerCapture(dragCapturedPointerId)) {
      try {
        stageEl.releasePointerCapture(dragCapturedPointerId);
      } catch (_) {}
    }
    dragCapturedPointerId = null;

    if (isDragging) {
      to(Math.round(target));
      setTimeout(() => {
        isDragging = false;
      }, 60);
    }
  };

  stageEl.addEventListener("pointerup", endDrag);
  stageEl.addEventListener("pointercancel", endDrag);

  // Keyboard navigation
  stageEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      to(Math.round(target) + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      to(Math.round(target) - 1);
    }
  });

  // UI Active State Update
  function updateActiveUI(near) {
    stageEl.setAttribute("aria-activedescendant", `works-wheel-${near}`);
    cardRefs.forEach((card, idx) => {
      card.setAttribute("aria-selected", idx === near ? "true" : "false");
    });

    indexButtons.forEach((btn, idx) => {
      if (idx === near) {
        btn.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-black mr-2 align-middle"></span><span class="text-neutral-900 font-extrabold underline decoration-2 underline-offset-4">${items[idx].title}</span>`;
        btn.className = "cursor-pointer transition-all duration-200 text-[10px] md:text-xs tracking-wider outline-none block ml-auto scale-105";
      } else {
        btn.innerHTML = `<span>${items[idx].title}</span>`;
        btn.className = "cursor-pointer transition-all duration-200 text-[10px] md:text-xs tracking-wider outline-none text-neutral-400 hover:text-neutral-900 block ml-auto";
      }
    });

    const counter = document.getElementById("works-wheel-counter");
    if (counter) {
      counter.textContent = `${String(near + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
    }

    if (items[near]) {
      titleEl.textContent = items[near].title;
    }
  }

  // Animation Loop (Single rAF pass writing direct DOM transforms)
  let frameId = 0;
  let isRunning = true;

  const draw = () => {
    if (!isRunning) return;
    frameId = requestAnimationFrame(draw);

    const gap = target - turn;
    if (Math.abs(gap) < 0.0005) {
      turn = target;
    } else {
      turn += gap * (reduced ? 1 : EASE);
    }

    const t = turn;
    const m = clamp(t, 0, 1);
    const pos = Math.max(0, t - 1);

    const { ringR, ringScale, drumR, bow } = currentMetrics;

    const isDesktop = (stage.w || 800) >= 1024;
    const isTablet = (stage.w || 800) >= 768 && (stage.w || 800) < 1024;
    // Desktop and Tablet: smoothly shift wheel center to right to preserve dramatic title space; Mobile: shift downward
    const targetLeft = isDesktop ? lerp(50, 54, m) : isTablet ? lerp(50, 52, m) : 50;
    const targetTop = (isDesktop || isTablet) ? 50 : lerp(50, 68, m);
    if (wheelEl) {
      wheelEl.style.left = `${targetLeft}%`;
      wheelEl.style.top = `${targetTop}%`;
      wheelEl.style.transform = `translateZ(${-m * drumR}px)`;
    }

    for (let i = 0; i < count; i++) {
      const d = i - pos;
      const drumDeg = d * STEP;
      const card = cardRefs[i];
      if (card) {
        card.style.transform = place(
          d * (360 / count),
          drumDeg,
          ringR,
          drumR,
          bow,
          m
        );
        card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
        card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
      }
      const face = card ? card.firstElementChild : null;
      if (face) {
        face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }
    }

    if (labelEl) labelEl.style.opacity = String(1 - m);
    if (titleEl) titleEl.style.opacity = String(m);

    const near = clamp(Math.round(pos), 0, last);
    if (near !== active) {
      active = near;
      updateActiveUI(near);
    }
  };

  frameId = requestAnimationFrame(draw);

  return {
    to,
    next: () => to(Math.min(last + 1, Math.round(target) + 1)),
    prev: () => to(Math.max(0, Math.round(target) - 1)),
    getActive: () => active,
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      stageEl.removeEventListener("wheel", onWheel);
      clearTimeout(settlingTimer);
    }
  };
}
