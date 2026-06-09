const jobs = [
  { id: 1, title: "產品助理實習生", company: "職途有限公司", field: "product", skills: ["Figma", "訪談", "簡報"], hours: 20, stage: "可申請" },
  { id: 2, title: "資料分析實習生", company: "城市數據實驗室", field: "data", skills: ["SQL", "儀表板", "簡報"], hours: 24, stage: "可申請" },
  { id: 3, title: "成長行銷實習生", company: "校園品牌社", field: "marketing", skills: ["文案", "簡報", "訪談"], hours: 16, stage: "可申請" },
  { id: 4, title: "UX 研究實習生", company: "青創服務設計", field: "product", skills: ["訪談", "Figma", "研究"], hours: 18, stage: "可申請" },
];

const profileSkills = ["Figma", "SQL", "訪談", "簡報"];
let selected = [];
let mode = "student";

const search = document.querySelector("#search");
const fieldFilter = document.querySelector("#fieldFilter");
const hours = document.querySelector("#hours");
const hoursValue = document.querySelector("#hoursValue");
const jobList = document.querySelector("#jobList");
const jobCount = document.querySelector("#jobCount");
const pipeline = document.querySelector("#pipeline");
const matchRate = document.querySelector("#matchRate");

function calcMatch(job) {
  const skillHits = job.skills.filter((skill) => profileSkills.some((profile) => skill.includes(profile) || profile.includes(skill))).length;
  const hoursFit = Math.max(0, 1 - Math.abs(Number(hours.value) - job.hours) / 32);
  return Math.min(98, Math.round(45 + skillHits * 14 + hoursFit * 18));
}

function filteredJobs() {
  const query = search.value.trim().toLowerCase();
  const field = fieldFilter.value;
  return jobs
    .filter((job) => {
      const hay = `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase();
      return (!query || hay.includes(query)) && (field === "all" || job.field === field);
    })
    .sort((a, b) => calcMatch(b) - calcMatch(a));
}

function renderJobs() {
  const items = filteredJobs();
  jobCount.textContent = `${items.length} 筆`;
  matchRate.textContent = `${Math.round(items.reduce((sum, job) => sum + calcMatch(job), 0) / Math.max(items.length, 1))}%`;

  const actionLabel = mode === "company" ? "邀請面試" : mode === "school" ? "加入追蹤" : "申請";
  jobList.innerHTML = items.map((job) => `
    <article class="job-card">
      <div class="job-top">
        <div>
          <strong>${job.title}</strong>
          <p class="job-meta">${job.company} / 每週 ${job.hours} 小時</p>
        </div>
        <span class="match">${calcMatch(job)}%</span>
      </div>
      <div class="chips">${job.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
      <button type="button" data-id="${job.id}">${actionLabel}</button>
    </article>
  `).join("");

  jobList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => addPipeline(Number(button.dataset.id)));
  });
}

function renderPipeline() {
  if (!selected.length) {
    pipeline.innerHTML = `<div class="empty">還沒有申請紀錄。</div>`;
    return;
  }

  pipeline.innerHTML = `
    <div class="pipeline-list">
      ${selected.map((job, index) => `
        <div class="pipeline-item">
          <strong>${job.title}</strong>
          <span>${job.company}</span>
          <span class="stage">${index === 0 ? "履歷送出" : index === 1 ? "面試安排" : "校方追蹤"}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function addPipeline(id) {
  const job = jobs.find((item) => item.id === id);
  if (job && !selected.some((item) => item.id === id)) selected.push(job);
  renderPipeline();
}

document.querySelectorAll(".segment button").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll(".segment button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderJobs();
  });
});

[search, fieldFilter, hours].forEach((el) => {
  el.addEventListener("input", () => {
    hoursValue.textContent = `${hours.value} 小時`;
    renderJobs();
  });
});

renderJobs();
renderPipeline();
