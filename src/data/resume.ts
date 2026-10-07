import type { Education, GlobeData, Job, Life, Photo, Profile, Project, SkillGroup, Stat } from "../types";

export const profile: Profile = {
  name: "Sreenath P",
  role: "Software Engineer, Frontend",
  focus: "React · TypeScript",
  status: "Open to work",
  notice: "Immediate joiner",
  location: "Ernakulam, Kerala",
  phone: "+91-7907919037",
  email: "sreenath.premnath@gmail.com",
  linkedin: "https://www.linkedin.com/in/sree-nath-p",
  github: "https://github.com/sreen98",
  instagram: "https://www.instagram.com/sreen_z",
  medium: "https://medium.com/@sreenz",
  resume: "/Sreenath_P_Software_Engineer_Resume.pdf",
  summary:
    "Software engineer with 5+ years building responsive frontend systems in React and TypeScript. Shipped role-based access control and permission-driven UI for a multi-tenant SaaS platform, LLM-powered job description generation and AI-scored candidate evaluation surfaces, and the frontend for ATS integrations with Greenhouse and Lever. Experience spans HR tech products (Octagnt, Skillkeepr) and a US telecom platform built from scratch for Verizon (via Wipro).",
};

export const photos: Photo[] = [
  { src: "/img/sreenath-hoodie.webp", alt: "Sreenath by the waterfront", position: "50% 30%" },
  { src: "/img/sreenath-at-work.webp", alt: "Sreenath working on a laptop", position: "50% 40%" },
  { src: "/img/sreenath-seaside.webp", alt: "Sreenath at the seaside", position: "50% 25%" },
];

export const stats: Stat[] = [
  { value: 5, suffix: "+", label: "Years building frontend systems" },
  { value: 100, suffix: "+", label: "Components migrated with zero regressions" },
  { value: 25, prefix: "~", suffix: "%", label: "Faster initial load via code splitting" },
  { value: 80, suffix: "%+", label: "Unit test coverage on core modules" },
];

export const experience: Job[] = [
  {
    company: "HASpaces",
    title: "Software Engineer",
    location: "Trivandrum",
    period: "Jun 2023 - Sep 2026",
    blurb: "Frontend engineer on two B2B multi-tenant SaaS products in HR tech: Octagnt and Skillkeepr.",
    products: [
      {
        name: "Octagnt",
        tagline: "AI hiring intelligence SaaS platform",
        points: [
          "Implemented role-based access control (RBAC) with permission-driven UI rendering across 5 roles (Owner, Admin, Senior Recruiter, Recruiter, Viewer) in a multi-tenant architecture, with config-driven permissions so new roles could be added without frontend code changes.",
          "Delivered the subscription and billing system end-to-end on the frontend: Stripe Checkout and Billing Portal integration across 4 plan tiers (Trial, Starter, Growth, Enterprise), feature gating, credit allocation, and quota enforcement.",
          "Built the candidate review interface for a multi-agent AI evaluation pipeline (Decision Packet), with nine-dimension scoring and password-protected external sharing.",
          "Built a four-step role creation wizard with PDF/DOC/DOCX uploads, ATS import, LLM-powered conversational job description generation, and constraint-based screening configuration.",
          "Mentored 2 junior developers on React patterns and code review, and standardized AI-assisted development workflows with GitHub Copilot and Claude Code across the frontend team.",
        ],
      },
      {
        name: "Skillkeepr",
        tagline: "ATS SaaS platform",
        points: [
          "Built recruiter admin portal features covering candidate fit analysis, Jitsi-based video interviews, and shortlisting.",
          "Built a responsive candidate portal for job discovery, applications, and interview attendance.",
          "Built the frontend for Greenhouse and Lever ATS integrations, enabling enterprise customers to bring jobs and candidates into automated recruitment workflows.",
          "Owned a major-version upgrade of the Mantine component library and the Node.js runtime across 3 frontend repositories, migrating 100+ components through a phased rollout with no user-facing regressions.",
          "Configured GitHub Actions pipelines to run lint, type-check, and tests on every PR, blocking merges on failure.",
        ],
      },
    ],
  },
  {
    company: "Wipro",
    title: "Project Engineer",
    location: "Chennai",
    period: "Dec 2020 - Jun 2023",
    blurb: "Verizon Engage: internal lead management platform for Verizon US retail representatives.",
    products: [
      {
        name: "Verizon Engage",
        tagline: "Lead management SPA for Verizon US retail",
        points: [
          "Core contributor to the single-page application (SPA) built from the ground up, integrating four lead channels with six role levels for retail representatives across the US.",
          "Migrated the codebase from class-based to functional components and introduced route-level code splitting with lazy loading, reducing initial page load time by ~25% (Lighthouse, median run).",
          "Resolved 100+ critical SonarQube issues that were blocking production builds, clearing the quality gate for release.",
          "Established the unit testing practice for the team, reaching 80%+ coverage across core modules with Jest and React Testing Library.",
        ],
      },
    ],
  },
];

export const projects = {
  ethra: {
    name: "Ethra",
    kind: "Bill-splitting app · Android + Web",
    description:
      "Group expense splitting app. Bills are organised by event, friends join through a shared link with no sign-up, and multiple people can edit the same bill. Handles consumption-based splits, multiple taxes and discounts, and shares summaries over PDF, SMS or WhatsApp.",
    tags: ["React", "Android", "Web app", "PDF export"],
    icon: "/projects/ethra-icon.webp",
    web: "/projects/ethra-web.webp",
    phone: "/projects/ethra-app.webp",
    links: [
      { label: "Website", href: "https://ethraapp.com/" },
      { label: "Web app", href: "https://app.ethraapp.com/" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.ethraapp.ethra" },
    ],
  },
  geovault: {
    name: "GeoVault",
    kind: "Personal project · Android",
    description:
      "A private location notebook for travellers and foodies. Save places with notes, tags and nine categories, search across everything, and open any spot in your maps app. Local-first with no server or tracking, plus optional scheduled Google Drive backups and JSON export.",
    tags: ["Android", "Local-first", "Google Drive backup", "Full-text search"],
    icon: "/projects/geovault-icon.webp",
    phone: "/projects/geovault-app.webp",
    links: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.geovault.app" }],
  },
  ajhomes: {
    name: "AJ Homes",
    kind: "Property agency website · UK",
    description:
      "Website for a Birmingham property agency covering sales, residential lettings and student lettings, with bedroom/bathroom/price search, property pages with photos and video, and enquiry forms.",
    tags: ["React", "Material UI", "Property search"],
    web: "/projects/ajhomes.webp",
    links: [{ label: "Visit site", href: "https://www.ajhomeslettings.co.uk/" }],
  },
  tastemagic: {
    name: "Taste Magic",
    kind: "Internal staff tool · Multi-tenant PWA",
    description:
      "Web app for the staff of an event-management business to run a booking from first enquiry to completed event - capture a lead, plan each service (catering, photography, decoration, makeup, return gifts), generate a bill, track payments, coordinate vendors, and follow through with reminders, reviews, and a full audit trail.",
    note: "Internal staff tool (not customer-facing), multi-tenant, installable PWA. Tenant-agnostic - branding comes from the API, never hardcoded.",
    modules: ["Leads", "Bookings", "Services", "Billing", "Payments", "Vendors", "Reminders", "Reviews", "Audit trail"],
    tags: ["React", "Vite", "Mantine", "TanStack Query", "PWA"],
    links: [{ label: "Open app", href: "https://app.tastemagic.in/login" }],
  },
  prephub: {
    name: "PrepHub",
    kind: "Personal project · Interview preparation platform",
    description:
      "An interview preparation web app I built for my own learning. Guides across front end, back end, AI engineering, DevOps and system design, with a quiz mode, spaced-repetition daily review, a timed interview simulator, and JavaScript and React playgrounds with graded coding challenges.",
    stats: [
      { value: "76", label: "Guides" },
      { value: "157", label: "Coding challenges" },
      { value: "14", label: "Cheat sheets" },
    ],
    tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "PWA"],
    web: "/projects/prephub.webp",
    url: "prephub.sreenathp.com",
    links: [
      { label: "Live site", href: "https://prephub.sreenathp.com/" },
      { label: "GitHub", href: "https://github.com/sreen98/prephub" },
    ],
  },
} satisfies Record<string, Project>;

// Contact globe: home base plus where the work has shipped to.
export const globe: GlobeData = {
  home: { name: "Kochi", note: "Home", lat: 9.98, lon: 76.28 },
  places: [
    { name: "Trivandrum", note: "HASpaces", lat: 8.52, lon: 76.94 },
    { name: "Chennai", note: "Wipro", lat: 13.08, lon: 80.27 },
    { name: "United States", note: "Verizon", lat: 40.68, lon: -74.55 },
    { name: "Birmingham, UK", note: "AJ Homes", lat: 52.48, lon: -1.89 },
  ],
};

// Outside work.
export const life: Life = {
  travel: [
    { country: "Vietnam", code: "VN", photo: "/img/life/vietnam.webp", position: "50% 35%" },
    { country: "Kazakhstan", code: "KZ", photo: "/img/life/kazakhstan.webp", position: "50% 30%" },
    { country: "South Korea", code: "KR", photo: "/img/life/korea.webp", position: "50% 60%" },
    { country: "Dubai", code: "AE", photo: "/img/life/dubai.webp", position: "50% 40%" },
  ],
  cricket: {
    photo: "/img/life/cricket.webp",
    role: "All-rounder",
  },
  gym: {
    text: "I love going to the gym and working out.",
  },
  writing: [
    {
      title: "Exploring Kazakhstan in Winter: A Complete Travel Guide",
      date: "Dec 2024",
      platform: "Medium",
      cover: "/img/life/kazakhstan-guide.webp",
      coverAlt: "Snowy mountain lake in Kazakhstan",
      href: "https://medium.com/@sreenz/exploring-kazakhstan-in-winter-a-complete-travel-guide-414cf3b8afae",
      blurb:
        "Day-by-day itinerary from Delhi to Almaty: metro rides, Green Bazaar, Panfilov Park and the Alma Arasan trek.",
    },
  ],
};

export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"] },
  {
    title: "React & Frameworks",
    items: ["React.js", "React Hooks", "React Router", "Redux Toolkit", "Redux Saga", "Zustand", "TanStack Query"],
  },
  { title: "Styling & UI", items: ["Tailwind CSS", "Mantine UI", "Material UI", "Responsive Design"] },
  {
    title: "Testing & Quality",
    items: ["Jest", "Vitest", "React Testing Library", "Lighthouse", "Core Web Vitals"],
  },
  {
    title: "Build, CI/CD & Dev Tools",
    items: ["Vite", "Webpack", "Storybook", "GitHub Actions", "GitHub Copilot", "Claude Code"],
  },
  { title: "APIs & Integrations", items: ["REST", "WebSockets", "Stripe", "Greenhouse", "Lever"] },
  {
    title: "Backend (Working Exposure)",
    items: ["Node.js", "Express.js", "MongoDB", "AWS Lambda"],
  },
  {
    title: "Tools & Methodology",
    items: ["Git", "GitHub", "GitLab", "Jira", "Postman", "Kibana", "Agile / Scrum"],
  },
];

export const education: Education = {
  degree: "B.Tech, Computer Science",
  school: "Adi Shankara Institute of Engineering and Technology, Kalady",
  period: "2016 - 2020",
  score: "CGPA 8.3/10",
};
