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

const fundPrefixes = ["Global", "Green", "Alpha", "Vertex", "CyberAgent", "Do", "Mekong", "Vina", "Golden Gate", "East", "Monk's Hill", "500", "Sequoia", "Lightspeed", "Wavemaker", "Jungle", "Insignia", "Openspace", "Antler", "Nextrans"];
const fundSuffixes = ["Ventures", "Capital", "Partners", "Global", "Fund", "Holdings", "Group"];
const investmentPhilosophies = [
  "Seeking sustainable development solutions at a micro-scale that create significant environmental impact.",
  "Prioritizing AI-applied startups to personalize learning. The founding team must have practical experience.",
  "Active tech investor seeking high-growth ventures in SEA with a focus on unit economics.",
  "We back early-stage founders building disruptive SaaS and FinTech solutions in emerging markets.",
  "Focus on DeepTech and Healthcare innovations that improve life expectancy and health systems.",
  "Looking for scalable platforms with strong network effects in the logistics and e-commerce space.",
  "Data-driven investment in AI, Blockchain, and Next-Gen infrastructure.",
  "Supporting female-led startups and sustainable business models in Southeast Asia.",
  "B2B SaaS focused fund looking for proven product-market fit and MRR > $50k.",
  "We are sector agnostic but founder-focused. We look for grit, vision, and execution ability."
];

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

// Generate 31 Investors
for (let i = 0; i < 31; i++) {
  let fundName = "";
  if (i < fundPrefixes.length) {
     fundName = `${fundPrefixes[i]} ${randomItem(fundSuffixes)}`;
  } else {
     fundName = `${randomItem(fundPrefixes)} ${randomItem(fundSuffixes)}`;
  }
  
  const fName = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
  
  // Pick 2-4 target industries
  let indCount = randomInt(2, 4);
  let ind = [];
  for(let j=0; j<indCount; j++) {
      let rInd = randomItem(industries);
      if(!ind.includes(rInd)) ind.push(rInd);
  }

  let ticketSize = randomInt(1, 5) * 1000000; // 1M - 5M

  investors.push({
    "Timestamp": randomDate(new Date(2026, 6, 1), new Date(2026, 7, 10)),
    "Investor or Fund Name": fundName,
    "Representative Name": fName,
    "Email Address": generateEmail(fName.split(" ")[0], fName.split(" ")[1], fundName.replace(/\s+/g, "").toLowerCase()),
    "Phone Number": generatePhone(),
    "Interested Industries": ind.join(", "),
    "Maximum Ticket Size (USD)": ticketSize,
    "Investment Philosophy and matching criteria": randomItem(investmentPhilosophies)
  });
}

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

console.log("Generated davas_startups.csv (62 rows) and davas_investors.csv (31 rows).");
