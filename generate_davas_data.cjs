const fs = require('fs');

const startups = [];
const investors = [];

// Seed Data
const startupPrefixes = ["Edu", "Agri", "Fin", "Health", "Eco", "Smart", "AI", "Cyber", "Tech", "Viet", "Global", "Next", "Quantum", "Bio", "Green"];
const startupSuffixes = ["Bot", "Grow", "Pay", "Care", "Life", "Hub", "Vision", "Shield", "Works", "Base", "Flow", "Link", "Gen", "Mind", "Chain"];
const industries = ["EdTech", "Artificial Intelligence", "AgriTech", "Cleantech", "FinTech", "HealthTech", "SaaS", "E-commerce", "DeepTech", "Blockchain", "Logistics", "IoT"];
const stages = ["Pre-Seed", "Seed", "Pre-Series A", "Series A", "Series B"];
const countries = ["Vietnam", "Singapore", "South Korea", "Japan", "USA", "Australia", "Taiwan", "Malaysia", "Indonesia", "Thailand"];

const firstNames = ["Nguyen", "Tran", "Le", "Pham", "Hoang", "David", "Sarah", "Michael", "Kenji", "Lee", "Park", "Alex", "Maria", "John", "Jessica"];
const lastNames = ["Anh", "Binh", "C", "Smith", "Johnson", "Suzuki", "Kim", "Wong", "Chen", "Tan", "Gomez", "Williams", "Nguyen", "Tran"];

// Helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateEmail = (first, last, domain) => `${first.toLowerCase()}.${last.toLowerCase()}@${domain}.com`;
const generatePhone = () => `+84${randomInt(900000000, 999999999)}`;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

// Generate 62 Startups
for (let i = 0; i < 62; i++) {
  const sName = `${randomItem(startupPrefixes)}${randomItem(startupSuffixes)} ${randomItem(["AI", "Technologies", "Solutions", "Labs", ""])}`.trim();
  const fName = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
  
  // Pick 1-2 random industries
  let ind = [randomItem(industries)];
  if (Math.random() > 0.5) {
    let ind2 = randomItem(industries);
    if (ind2 !== ind[0]) ind.push(ind2);
  }

  const stage = randomItem(stages);
  let targetAmount = 0;
  if (stage === "Pre-Seed") targetAmount = randomInt(5, 20) * 10000; // 50k - 200k
  else if (stage === "Seed") targetAmount = randomInt(3, 10) * 100000; // 300k - 1M
  else if (stage === "Pre-Series A") targetAmount = randomInt(15, 30) * 100000; // 1.5M - 3M
  else targetAmount = randomInt(3, 10) * 1000000; // 3M - 10M

  startups.push({
    "Timestamp": randomDate(new Date(2026, 6, 1), new Date(2026, 7, 10)),
    "Startup Name": sName,
    "Representative Name": fName,
    "Email Address": generateEmail(fName.split(" ")[0], fName.split(" ")[1], sName.replace(/\s+/g, "").toLowerCase()),
    "Phone Number": generatePhone(),
    "Primary Industry": ind.join(", "),
    "Current Funding Stage": stage,
    "Target Funding Amount in USD": targetAmount,
    "Upload Pitch Deck (PDF)": `https://drive.google.com/drive/folders/davas2026_${i}`
  });
}

// Bespoke 31 Investors with 100% matched sectors and philosophies
const curatedInvestors = [
  { fund: "Global Partners", name: "John Nguyen", sectors: "Cleantech, AgriTech", ticket: 2000000, thesis: "Backing tech-enabled circular economy models and high-yield, climate-resilient farming solutions across the Mekong Delta." },
  { fund: "Green Global", name: "Kenji Suzuki", sectors: "DeepTech, Cleantech", ticket: 2000000, thesis: "Investing in early-stage material science, carbon accounting platforms, and energy transition hardware with verifiable ESG metrics." },
  { fund: "Alpha Partners", name: "Alex Tan", sectors: "EdTech, Artificial Intelligence, SaaS", ticket: 3000000, thesis: "Partnering with founders building generative AI-native learning companions and automated corporate upskilling ecosystems." },
  { fund: "Vertex Fund", name: "David Williams", sectors: "HealthTech, Artificial Intelligence", ticket: 3000000, thesis: "Targeting AI-assisted diagnostic tools, telemedicine infrastructure, and digital pharmacy networks serving tier-2 SEA cities." },
  { fund: "CyberAgent Holdings", name: "Sarah Kim", sectors: "SaaS, FinTech", ticket: 4000000, thesis: "Hunting for high-retention B2B SaaS workflows and embedded payment gateways with proven net dollar retention > 115%." },
  { fund: "Do Capital", name: "Lee Anh", sectors: "FinTech, E-commerce", ticket: 5000000, thesis: "Backing seed-stage platforms that democratize micro-insurance and supply-chain financing for unbanked micro-merchants." },
  { fund: "Mekong Group", name: "Alex C", sectors: "AgriTech, Logistics", ticket: 3000000, thesis: "Modernizing agriculture cold-chains, farm-to-table logistics, and IoT-driven post-harvest loss prevention systems." },
  { fund: "Vina Partners", name: "Michael Anh", sectors: "FinTech, SaaS", ticket: 4000000, thesis: "Investing in next-generation accounting automation, e-invoicing compliance, and automated payroll infrastructure for SEA enterprises." },
  { fund: "Golden Gate Group", name: "Lee Chen", sectors: "DeepTech, Artificial Intelligence, Blockchain", ticket: 4000000, thesis: "Backing technical founders building decentralized compute networks, zero-knowledge security, and enterprise AI orchestration layers." },
  { fund: "East Capital", name: "David Nguyen", sectors: "E-commerce, D2C, Sustainability", ticket: 5000000, thesis: "Empowering female-founded consumer brands, omni-channel retail tech, and sustainable direct-to-consumer lifestyle innovations." },
  { fund: "Monk's Hill Fund", name: "Michael Williams", sectors: "SaaS, Logistics", ticket: 3000000, thesis: "Series A lead investor focused on gritty operators solving fundamental infrastructure and fragmented logistics bottlenecks in ASEAN." },
  { fund: "500 Holdings", name: "Sarah Nguyen", sectors: "FinTech, PropTech", ticket: 3000000, thesis: "Backing aggressive, fast-executing seed founders modernizing fractional real estate investments and digital mortgage origination." },
  { fund: "Sequoia Partners", name: "Hoang Johnson", sectors: "Artificial Intelligence, SaaS", ticket: 5000000, thesis: "Seeking visionary founders creating category-defining vertical AI agents with deep proprietary workflow data moats." },
  { fund: "Lightspeed Global", name: "Pham Anh", sectors: "E-commerce, MediaTech", ticket: 2000000, thesis: "Investing in live-commerce enablement tools, cross-border social shopping engines, and affiliate monetization platforms." },
  { fund: "Wavemaker Global", name: "Nguyen Tan", sectors: "DeepTech, Robotics, IoT", ticket: 4000000, thesis: "Early-stage enterprise and hard-tech fund backing industrial robotics, factory automation, and smart manufacturing in Vietnam." },
  { fund: "Jungle Holdings", name: "Pham Chen", sectors: "SaaS, FinTech", ticket: 1000000, thesis: "Supporting regional category leaders with strong unit economics, low churn, and clear pathways to $10M+ ARR expansion." },
  { fund: "Insignia Global", name: "Pham Williams", sectors: "HealthTech, InsurTech", ticket: 3000000, thesis: "Investing in digital health platforms connecting outpatient care with preventive corporate wellness and micro-health policies." },
  { fund: "Openspace Capital", name: "Michael Smith", sectors: "AgriTech, FoodTech", ticket: 2000000, thesis: "Partnering with growth-stage tech companies solving alternative protein, bio-fertilizers, and supply-demand price discovery." },
  { fund: "Antler Fund", name: "Kenji Smith", sectors: "Artificial Intelligence, DeepTech", ticket: 1000000, thesis: "Day-zero co-founder to top-tier engineers and domain experts launching high-velocity AI-first startups in Southeast Asia." },
  { fund: "Nextrans Global", name: "John Wong", sectors: "Cleantech, Mobility", ticket: 1000000, thesis: "Backing electric two-wheeler ecosystems, smart battery-swapping networks, and smart urban mobility hardware." },
  { fund: "Lightspeed Group", name: "Le Anh", sectors: "EdTech, Gaming", ticket: 4000000, thesis: "Focusing on gamified learning applications, interactive STEM platforms, and immersive educational software." },
  { fund: "Jungle Global", name: "Park Gomez", sectors: "FinTech, WealthTech", ticket: 4000000, thesis: "Democratizing algorithmic retail investment tools, automated robo-advisory, and digital asset custody solutions." },
  { fund: "CyberAgent Group", name: "Le Tan", sectors: "MediaTech, Artificial Intelligence", ticket: 3000000, thesis: "Investing in automated AI content creation tools, synthetic media, and personalized digital marketing engines." },
  { fund: "Vina Capital", name: "Hoang Wong", sectors: "AgriTech, Renewable Energy", ticket: 3000000, thesis: "Financing rooftop solar optimization software, smart irrigation grids, and carbon credit tokenization platforms." },
  { fund: "Alpha Fund", name: "Alex Suzuki", sectors: "SaaS, Cybersecurity", ticket: 3000000, thesis: "Protecting mid-market enterprises with automated penetration testing, cloud identity governance, and threat intelligence AI." },
  { fund: "Insignia Capital", name: "John Nguyen", sectors: "Logistics, E-commerce", ticket: 2000000, thesis: "Backing on-demand hyper-local delivery tech, warehouse robotics, and automated customs clearance platforms." },
  { fund: "Golden Gate Fund", name: "David Kim", sectors: "FinTech, SME Banking", ticket: 2000000, thesis: "Building all-in-one neo-banking suites, corporate credit cards, and treasury management tools tailored for emerging Asian startups." },
  { fund: "Jungle Ventures", name: "Le Nguyen", sectors: "TravelTech, Hospitality", ticket: 4000000, thesis: "Modernizing boutique hotel management systems, experiential travel marketplaces, and dynamic flight pricing algorithms." },
  { fund: "Lightspeed Fund", name: "John Suzuki", sectors: "HealthTech, Biotech", ticket: 3000000, thesis: "Supporting personalized genomics analytics, early cancer screening hardware, and decentralized clinical trial software." },
  { fund: "Vertex Group", name: "Hoang C", sectors: "EdTech, Future of Work", ticket: 2000000, thesis: "Backing remote team collaboration software, AI technical interview screening, and global talent credential verification." },
  { fund: "Nextrans Ventures", name: "Jessica Tran", sectors: "Robotics, Logistics", ticket: 4000000, thesis: "Investing in autonomous last-mile delivery drones, smart warehousing sensors, and fleet telematics optimization." }
];

curatedInvestors.forEach((inv, i) => {
  investors.push({
    "Timestamp": randomDate(new Date(2026, 6, 1), new Date(2026, 7, 10)),
    "Investor or Fund Name": inv.fund,
    "Representative Name": inv.name,
    "Email Address": generateEmail(inv.name.split(" ")[0], inv.name.split(" ")[1], inv.fund.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()),
    "Phone Number": generatePhone(),
    "Interested Industries": inv.sectors,
    "Maximum Ticket Size (USD)": inv.ticket,
    "Investment Philosophy and matching criteria": inv.thesis
  });
});

// Convert to CSV
const toCSV = (data) => {
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(h => {
      let cell = row[h] === null || row[h] === undefined ? "" : row[h];
      cell = String(cell).replace(/"/g, '""');
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
        cell = `"${cell}"`;
      }
      return cell;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

fs.writeFileSync('davas_startups.csv', '\uFEFF' + toCSV(startups));
fs.writeFileSync('davas_investors.csv', '\uFEFF' + toCSV(investors));

console.log("Successfully generated clean and realistic davas_startups.csv and davas_investors.csv.");
