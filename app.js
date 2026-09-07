/* ===========================================================
   QuickProfiles — shared data + helpers
   All candidate data lives ONLY in sessionStorage (this browser
   tab, this session). Nothing is sent to a server or database.
   Clicking "Reset" wipes it completely.
=========================================================== */

const COMPANIES = [
  {
    id: "sydney",
    name: "Sydney Inc.",
    logo: "assets/sydneyinc.png"
  },
  {
    id: "nelson",
    name: "Nelson Global Accounting & Bookkeeping",
    logo: "assets/nelsonglobal.png"
  },
  {
    id: "fye",
    name: "Forum for Youth Empowerment (FYE)",
    logo: "assets/fye.png"
  }
];

/* 35 statements — 7 per dichotomy.
   trait values: E/I, S/N, T/F, J/P, A/U (U = Turbulent, shown as "T") */
const QUESTIONS = [
  { id: 1, trait: "E", text: "I feel energized after spending time around a lot of people." },
  { id: 2, trait: "I", text: "I prefer quiet, solitary activities over busy social events." },
  { id: 3, trait: "E", text: "I find it easy to start conversations with people I've just met." },
  { id: 4, trait: "I", text: "I need time alone to recharge after socializing." },
  { id: 5, trait: "E", text: "I enjoy being at the center of a group conversation." },
  { id: 6, trait: "I", text: "I usually think things through carefully before speaking up in a group." },
  { id: 7, trait: "E", text: "I would rather work closely with others than work alone." },

  { id: 8, trait: "S", text: "I focus more on concrete facts and details than on abstract ideas." },
  { id: 9, trait: "N", text: "I enjoy imagining future possibilities more than dealing with things as they are now." },
  { id: 10, trait: "S", text: "I trust practical, hands-on experience over untested theories." },
  { id: 11, trait: "N", text: "I often notice patterns or connections that other people miss." },
  { id: 12, trait: "S", text: "I prefer clear, step-by-step instructions over open-ended exploration." },
  { id: 13, trait: "N", text: "I'm drawn to new and unconventional ideas." },
  { id: 14, trait: "S", text: "I pay close attention to concrete details in my surroundings." },

  { id: 15, trait: "T", text: "I make decisions based on logic rather than emotion." },
  { id: 16, trait: "F", text: "I consider how a decision will affect other people's feelings before I decide." },
  { id: 17, trait: "T", text: "I value fairness based on consistent rules over individual circumstances." },
  { id: 18, trait: "F", text: "I find it easy to empathize with what other people are feeling." },
  { id: 19, trait: "T", text: "I'd rather receive honest, direct feedback than gentle reassurance." },
  { id: 20, trait: "F", text: "My personal values often guide the choices I make." },
  { id: 21, trait: "T", text: "I tend to stay calm and objective during conflict." },

  { id: 22, trait: "J", text: "I like having a clear plan and schedule for my day." },
  { id: 23, trait: "P", text: "I prefer to keep my options open rather than commit early to a plan." },
  { id: 24, trait: "J", text: "I feel satisfied when I finish tasks well ahead of time." },
  { id: 25, trait: "P", text: "I enjoy adapting spontaneously when a situation changes." },
  { id: 26, trait: "J", text: "I like organizing my tasks with lists and deadlines." },
  { id: 27, trait: "P", text: "I tend to work best close to a deadline, under some pressure." },
  { id: 28, trait: "J", text: "I prefer structure and routine over unpredictability." },

  { id: 29, trait: "A", text: "I rarely worry about how other people perceive me." },
  { id: 30, trait: "U", text: "I often worry about whether I've made the right decision." },
  { id: 31, trait: "A", text: "I feel confident in my own abilities, even under pressure." },
  { id: 32, trait: "U", text: "I tend to replay and overthink my past mistakes." },
  { id: 33, trait: "A", text: "I generally stay calm even when things don't go as planned." },
  { id: 34, trait: "U", text: "I look for reassurance from others before feeling sure of my choices." },
  { id: 35, trait: "A", text: "I generally feel secure and at ease with myself." }
];

const TRAIT_LABELS = {
  E: "Extraverted", I: "Introverted",
  S: "Observant", N: "Intuitive",
  T: "Thinking", F: "Feeling",
  J: "Judging", P: "Prospecting",
  A: "Assertive", U: "Turbulent"
};

/* ---------- storage helpers ---------- */
const QP = {
  getCompany() {
    const raw = sessionStorage.getItem("qp_company");
    return raw ? JSON.parse(raw) : null;
  },
  setCompany(company) {
    sessionStorage.setItem("qp_company", JSON.stringify(company));
  },
  getProfile() {
    const raw = sessionStorage.getItem("qp_profile");
    return raw ? JSON.parse(raw) : null;
  },
  setProfile(profile) {
    sessionStorage.setItem("qp_profile", JSON.stringify(profile));
  },
  getAnswers() {
    const raw = sessionStorage.getItem("qp_answers");
    return raw ? JSON.parse(raw) : {};
  },
  setAnswers(answers) {
    sessionStorage.setItem("qp_answers", JSON.stringify(answers));
  },
  getType() {
    return sessionStorage.getItem("qp_type");
  },
  setType(code) {
    sessionStorage.setItem("qp_type", code);
  },
  clearAll() {
    sessionStorage.removeItem("qp_company");
    sessionStorage.removeItem("qp_profile");
    sessionStorage.removeItem("qp_answers");
    sessionStorage.removeItem("qp_type");
  }
};

/* ---------- guards: keep pages from being opened out of order ---------- */
function requireCompany() {
  if (!QP.getCompany()) window.location.href = "index.html";
}
function requireProfile() {
  requireCompany();
  if (!QP.getProfile()) window.location.href = "profile.html";
}
function requireAnswers() {
  requireProfile();
  const answers = QP.getAnswers();
  if (Object.keys(answers).length < QUESTIONS.length) window.location.href = "test.html";
}

/* ---------- scoring ---------- */
function computeType(answers) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, A: 0, U: 0 };
  QUESTIONS.forEach(q => {
    const val = answers[q.id];
    if (val === undefined) return;
    scores[q.trait] += (val - 3); // -2..+2
  });
  const code =
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P") +
    "-" +
    (scores.A >= scores.U ? "A" : "T");
  return code;
}

function typeDescription(code) {
  const letters = code.replace("-", "").split("");
  const suffix = code.split("-")[1]; // A or T
  const names = [
    TRAIT_LABELS[letters[0]],
    TRAIT_LABELS[letters[1]],
    TRAIT_LABELS[letters[2]],
    TRAIT_LABELS[letters[3]],
    suffix === "A" ? TRAIT_LABELS.A : TRAIT_LABELS.U
  ];
  return names.join(" · ");
}

/* ---------- reset (shared button behaviour) ---------- */
function wireResetButton(buttonEl) {
  if (!buttonEl) return;
  buttonEl.addEventListener("click", () => {
    const ok = confirm("Start a new candidate? This will clear all entered data.");
    if (ok) {
      QP.clearAll();
      window.location.href = "index.html";
    }
  });
}