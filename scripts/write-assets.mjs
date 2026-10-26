import { mkdirSync, writeFileSync } from "node:fs";

function illustration(title, subtitle, blocks) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${title}">
  <rect width="640" height="400" fill="#E7F2EC"/>
  <rect x="28" y="24" width="584" height="352" rx="24" fill="#FFFFFF" stroke="#D7E6DE"/>
  <rect x="48" y="44" width="120" height="12" rx="6" fill="#2F6F56"/>
  <rect x="180" y="46" width="70" height="8" rx="4" fill="#D7E6DE"/>
  <rect x="258" y="46" width="54" height="8" rx="4" fill="#D7E6DE"/>
  <text x="500" y="56" fill="#1D4A38" font-family="Georgia, serif" font-size="16">${subtitle}</text>
  ${blocks}
</svg>`;
}

const files = {
  "public/images/projects/waste-to-reward.svg": illustration(
    "Waste-to-Reward preview",
    "Points",
    `<rect x="52" y="84" width="170" height="250" rx="18" fill="#F7FAF8" stroke="#E1E8E4"/>
     <circle cx="137" cy="150" r="36" fill="#2F6F56"/>
     <rect x="86" y="204" width="102" height="10" rx="5" fill="#1D4A38"/>
     <rect x="96" y="224" width="82" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="242" y="84" width="330" height="74" rx="16" fill="#F4F7F5"/>
     <rect x="262" y="106" width="150" height="12" rx="6" fill="#1D4A38"/>
     <rect x="262" y="128" width="220" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="242" y="172" width="156" height="162" rx="16" fill="#FFFFFF" stroke="#E1E8E4"/>
     <rect x="262" y="194" width="40" height="40" rx="12" fill="#8FCEB0"/>
     <rect x="314" y="206" width="64" height="8" rx="4" fill="#1D4A38"/>
     <rect x="416" y="172" width="156" height="162" rx="16" fill="#FFFFFF" stroke="#E1E8E4"/>
     <rect x="436" y="194" width="40" height="40" rx="12" fill="#1D4A38"/>
     <rect x="488" y="206" width="64" height="8" rx="4" fill="#1D4A38"/>`,
  ),
  "public/images/projects/foodlink.svg": illustration(
    "FoodLink preview",
    "Menu",
    `<rect x="52" y="84" width="360" height="250" rx="18" fill="#F7FAF8"/>
     <rect x="72" y="104" width="150" height="96" rx="16" fill="#FFFFFF" stroke="#E1E8E4"/>
     <circle cx="147" cy="140" r="22" fill="#2F6F56"/>
     <rect x="92" y="168" width="110" height="8" rx="4" fill="#1D4A38"/>
     <rect x="236" y="104" width="150" height="96" rx="16" fill="#FFFFFF" stroke="#E1E8E4"/>
     <circle cx="311" cy="140" r="22" fill="#8FCEB0"/>
     <rect x="256" y="168" width="110" height="8" rx="4" fill="#1D4A38"/>
     <rect x="72" y="216" width="314" height="96" rx="16" fill="#FFFFFF" stroke="#E1E8E4"/>
     <rect x="92" y="238" width="180" height="10" rx="5" fill="#1D4A38"/>
     <rect x="92" y="258" width="120" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="292" y="246" width="74" height="28" rx="14" fill="#2F6F56"/>
     <rect x="432" y="84" width="156" height="250" rx="18" fill="#1D4A38"/>
     <rect x="452" y="112" width="90" height="10" rx="5" fill="#E7F2EC"/>
     <rect x="452" y="146" width="116" height="28" rx="8" fill="#2F6F56"/>
     <rect x="452" y="186" width="116" height="28" rx="8" fill="#2F6F56"/>
     <rect x="452" y="270" width="116" height="36" rx="18" fill="#8FCEB0"/>`,
  ),
  "public/images/projects/portfolio.svg": illustration(
    "Portfolio preview",
    "Home",
    `<rect x="52" y="84" width="536" height="250" rx="18" fill="#F7FAF8"/>
     <rect x="78" y="112" width="250" height="18" rx="8" fill="#1D4A38"/>
     <rect x="78" y="144" width="210" height="10" rx="5" fill="#2F6F56"/>
     <rect x="78" y="168" width="230" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="78" y="184" width="190" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="78" y="214" width="92" height="28" rx="14" fill="#2F6F56"/>
     <rect x="180" y="214" width="92" height="28" rx="14" fill="#FFFFFF" stroke="#2F6F56"/>
     <circle cx="470" cy="196" r="62" fill="#D7EBE1" stroke="#FFFFFF" stroke-width="8"/>
     <circle cx="470" cy="184" r="18" fill="#1D4A38"/>
     <path d="M430 246c12-28 68-28 80 0" fill="#1D4A38"/>`,
  ),
  "public/images/blog/tailwind.svg": illustration(
    "Tailwind notes",
    "CSS",
    `<rect x="70" y="100" width="500" height="210" rx="18" fill="#102018"/>
     <rect x="96" y="128" width="90" height="10" rx="5" fill="#8FCEB0"/>
     <rect x="96" y="156" width="280" height="8" rx="4" fill="#E7F2EC"/>
     <rect x="96" y="176" width="220" height="8" rx="4" fill="#5D6E66"/>
     <rect x="96" y="196" width="250" height="8" rx="4" fill="#5D6E66"/>
     <rect x="96" y="230" width="120" height="28" rx="14" fill="#2F6F56"/>`,
  ),
  "public/images/blog/supabase.svg": illustration(
    "Supabase notes",
    "Data",
    `<rect x="80" y="110" width="200" height="180" rx="18" fill="#FFFFFF" stroke="#D7E6DE"/>
     <rect x="104" y="138" width="120" height="10" rx="5" fill="#1D4A38"/>
     <rect x="104" y="164" width="150" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="104" y="184" width="130" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="104" y="220" width="70" height="28" rx="14" fill="#2F6F56"/>
     <rect x="320" y="110" width="220" height="180" rx="18" fill="#1D4A38"/>
     <circle cx="390" cy="180" r="28" fill="#8FCEB0"/>
     <circle cx="460" cy="210" r="18" fill="#E7F2EC"/>
     <path d="M390 180 L460 210" stroke="#FFFFFF" stroke-width="4"/>`,
  ),
  "public/images/blog/first-app.svg": illustration(
    "First application notes",
    "Build",
    `<rect x="90" y="90" width="460" height="230" rx="20" fill="#FFFFFF" stroke="#D7E6DE"/>
     <rect x="120" y="120" width="180" height="14" rx="7" fill="#1D4A38"/>
     <rect x="120" y="154" width="390" height="36" rx="12" fill="#F4F7F5"/>
     <rect x="120" y="204" width="390" height="36" rx="12" fill="#F4F7F5"/>
     <rect x="120" y="256" width="110" height="32" rx="16" fill="#2F6F56"/>`,
  ),
  "public/images/blog/journey.svg": illustration(
    "Study notes",
    "Study",
    `<rect x="70" y="120" width="150" height="180" rx="16" fill="#FFFFFF" stroke="#D7E6DE"/>
     <rect x="245" y="90" width="150" height="210" rx="16" fill="#1D4A38"/>
     <rect x="420" y="140" width="150" height="160" rx="16" fill="#FFFFFF" stroke="#D7E6DE"/>
     <rect x="92" y="150" width="100" height="8" rx="4" fill="#A7B8AE"/>
     <rect x="267" y="130" width="100" height="8" rx="4" fill="#8FCEB0"/>
     <rect x="442" y="170" width="100" height="8" rx="4" fill="#A7B8AE"/>`,
  ),
  "public/images/blog/capstone.svg": illustration(
    "Capstone notes",
    "Scope",
    `<rect x="80" y="100" width="480" height="210" rx="20" fill="#FFFFFF" stroke="#D7E6DE"/>
     <circle cx="160" cy="190" r="46" fill="#E7F2EC"/>
     <circle cx="320" cy="190" r="46" fill="#2F6F56"/>
     <circle cx="480" cy="190" r="46" fill="#E7F2EC"/>
     <path d="M206 190 H274 M366 190 H434" stroke="#1D4A38" stroke-width="6"/>`,
  ),
  "public/images/certificates/sample-document.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="Sample certificate placeholder">
  <rect width="640" height="400" fill="#F4F7F5"/>
  <rect x="70" y="36" width="500" height="328" rx="8" fill="#FFFFFF" stroke="#2F6F56" stroke-width="3"/>
  <rect x="86" y="52" width="468" height="296" rx="4" fill="none" stroke="#8FCEB0"/>
  <text x="320" y="130" text-anchor="middle" fill="#1D4A38" font-family="Georgia, serif" font-size="28">SAMPLE</text>
  <text x="320" y="168" text-anchor="middle" fill="#5D6E66" font-family="Georgia, serif" font-size="16">Not a real certificate</text>
  <text x="320" y="230" text-anchor="middle" fill="#24312C" font-family="Georgia, serif" font-size="18">Replace this document</text>
  <text x="320" y="258" text-anchor="middle" fill="#5D6E66" font-family="Georgia, serif" font-size="14">with a certificate you earned</text>
  <circle cx="320" cy="310" r="18" fill="none" stroke="#2F6F56" stroke-width="2"/>
</svg>`,
};

for (const [file, contents] of Object.entries(files)) {
  mkdirSync(file.split("/").slice(0, -1).join("/"), { recursive: true });
  writeFileSync(file, contents);
}

const lines = [
  "SAMPLE RESUME  -  replace this file with your own",
  "",
  "Mica Dames",
  "IT Student & Aspiring Developer",
  "Philippines",
  "hello@example.com",
  "github.com/micarejie",
  "",
  "This PDF is placeholder content for the portfolio download button.",
  "Edit the profile in the admin dashboard and upload your real resume.",
  "",
  "Education",
  "Bachelor of Science in Information Technology  -  in progress",
  "Add your college or university",
  "",
  "Focus",
  "Web development, databases, and interface design.",
  "",
  "Sample projects",
  "Waste-to-Reward, FoodLink, Personal Portfolio",
  "",
  "Skills in progress",
  "HTML, CSS, JavaScript, Tailwind CSS, React, Next.js,",
  "PHP, PostgreSQL, Supabase, Git, Figma",
];

function pdfEscape(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const commands = ["BT", "/F1 12 Tf", "50 760 Td", "16 TL"];
lines.forEach((line, index) => {
  if (index === 0) commands.push(`(${pdfEscape(line)}) Tj`);
  else commands.push(`T* (${pdfEscape(line)}) Tj`);
});
commands.push("ET");
const stream = commands.join("\n");
const objects = [];
objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
objects.push("2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n");
objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n");
objects.push(`4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream\nendobj\n`);
objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n");

let pdf = "%PDF-1.4\n";
const offsets = [0];
for (const object of objects) {
  offsets.push(pdf.length);
  pdf += object;
}
const xref = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let index = 1; index < offsets.length; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
writeFileSync("public/resume.pdf", pdf);
console.log("Wrote illustrations and resume.pdf");
