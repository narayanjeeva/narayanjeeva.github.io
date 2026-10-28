"use strict";

/* ---------- Content data (edit these to update the site) ---------- */
const projects = [
  {
    title: "Taskboard API",
    description: "A REST API for team task tracking with role-based access and rate limiting. Handles 2,000 requests per minute in load tests.",
    stack: "Node.js, PostgreSQL, Docker",
    demo: "https://example.com",
    code: "https://github.com/yourname/taskboard-api"
  },
  {
    title: "Weather Now",
    description: "A responsive weather app with city search, a 5-day forecast and offline caching.",
    stack: "JavaScript, Service Workers, OpenWeather API",
    demo: "https://example.com",
    code: "https://github.com/yourname/weather-now"
  },
  {
    title: "Inventory Dashboard",
    description: "A dashboard that lets small shops track stock levels and get low-stock alerts by email.",
    stack: "React, Express, MongoDB",
    demo: "",
    code: "https://github.com/yourname/inventory-dashboard"
  }
];

const skills = {
  Languages: ["JavaScript", "TypeScript", "Python", "SQL"],
  Frontend: ["HTML", "CSS", "React", "Accessibility"],
  Backend: ["Node.js", "Express", "REST", "PostgreSQL"],
  Tools: ["Git", "Docker", "GitHub Actions", "Linux"]
};

const experience = [
  {
    role: "Software Engineer",
    company: "Company Name",
    period: "2024 – Present",
    summary: "Built and shipped customer-facing features, cut page load time by 40%, and mentored two junior developers."
  },
  {
    role: "Software Engineering Intern",
    company: "Another Company",
    period: "2023",
    summary: "Developed internal tools in Node.js that saved the support team about five hours a week."
  }
];

/* ---------- DOM references ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const projectList = document.getElementById("projectList");
const skillList = document.getElementById("skillList");
const experienceList = document.getElementById("experienceList");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const THEME_KEY = "portfolio-theme";

/* ---------- Helpers ---------- */
// Builds an element safely (textContent, never innerHTML)
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createLink(label, href) {
  const link = createElement("a", "", label);
  link.href = href;
  link.rel = "noopener";
  return link;
}

/* ---------- Render sections ---------- */
function renderProjects() {
  projects.forEach(({ title, description, stack, demo, code }) => {
    const item = createElement("li", "project");
    const links = createElement("div", "project-links");

    if (demo) links.append(createLink("Live demo", demo));
    if (code) links.append(createLink("Source code", code));

    item.append(
      createElement("h3", "", title),
      links,
      createElement("p", "", description),
      createElement("p", "project-stack", stack)
    );
    projectList.append(item);
  });
}

function renderSkills() {
  Object.entries(skills).forEach(([group, items]) => {
    const wrapper = createElement("div", "skill-group");
    const list = createElement("ul");
    items.forEach((skill) => list.append(createElement("li", "", skill)));
    wrapper.append(createElement("h3", "", group), list);
    skillList.append(wrapper);
  });
}

function renderExperience() {
  experience.forEach(({ role, company, period, summary }) => {
    const item = createElement("li", "job");
    item.append(
      createElement("h3", "", `${role}, ${company}`),
      createElement("p", "job-period", period),
      createElement("p", "", summary)
    );
    experienceList.append(item);
  });
}

/* ---------- Theme ---------- */
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const next = theme === "dark" ? "light" : "dark";
  themeToggle.textContent = next === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
}

function getInitialTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (error) { /* storage blocked */ }
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (error) { /* ignore */ }
});

/* ---------- Mobile navigation ---------- */
navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Contact form validation ---------- */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => (value.trim().length < 2 ? "Enter your name." : ""),
  email: (value) => (emailPattern.test(value.trim()) ? "" : "Enter a valid email address, like you@example.com."),
  message: (value) => (value.trim().length < 10 ? "Write at least 10 characters." : "")
};

function validateField(field) {
  const message = validators[field](contactForm.elements[field].value);
  document.getElementById(`${field}Error`).textContent = message;
  contactForm.elements[field].setAttribute("aria-invalid", String(Boolean(message)));
  return message === "";
}

Object.keys(validators).forEach((field) => {
  contactForm.elements[field].addEventListener("blur", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const results = Object.keys(validators).map(validateField); // validate every field
  if (results.includes(false)) {
    formStatus.textContent = "Fix the highlighted fields and send again.";
    return;
  }

  // Replace this block with a real backend or a form service (Formspree, Netlify Forms).
  const { name, email, message } = contactForm.elements;
  const subject = encodeURIComponent(`Portfolio message from ${name.value.trim()}`);
  const body = encodeURIComponent(`${message.value.trim()}\n\nReply to: ${email.value.trim()}`);
  window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;

  formStatus.textContent = "Message ready in your email app. Send it from there.";
  contactForm.reset();
});

/* ---------- Init ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
applyTheme(getInitialTheme());
renderProjects();
renderSkills();
renderExperience();