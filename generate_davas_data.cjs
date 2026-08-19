const fs = require('fs');

// Seed Curated 62 Startups with 100% aligned sector names and descriptions
const curatedStartups = [
  // FinTech & Payments (6)
  { name: "QuantumGen Solutions", rep: "Michael Tan", sector: "FinTech", stage: "Seed", ask: 400000 },
  { name: "PayFlow Vietnam", rep: "Lee Chen", sector: "FinTech", stage: "Seed", ask: 600000 },
  { name: "SmartCredit AI", rep: "Tran Anh", sector: "FinTech, Artificial Intelligence", stage: "Seed", ask: 500000 },
  { name: "VietPay Link", rep: "David Kim", sector: "FinTech", stage: "Pre-Series A", ask: 1800000 },
  { name: "LedgerPay Labs", rep: "Sarah Wong", sector: "FinTech", stage: "Series A", ask: 3500000 },
  { name: "WealthGen AI", rep: "Nguyen Binh", sector: "FinTech, Artificial Intelligence", stage: "Pre-Seed", ask: 1500000 },

  // AgriTech & FoodTech (6)
  { name: "AgriGen AI", rep: "Alex Nguyen", sector: "AgriTech, Artificial Intelligence", stage: "Pre-Series A", ask: 2000000 },
  { name: "AgriHub Vietnam", rep: "David Wong", sector: "AgriTech, E-commerce", stage: "Seed", ask: 750000 },
  { name: "EcoFarm Works", rep: "Le Pham", sector: "AgriTech, IoT", stage: "Seed", ask: 500000 },
  { name: "GreenHarvest Tech", rep: "Tran Gomez", sector: "AgriTech, Cleantech", stage: "Series A", ask: 3000000 },
  { name: "MekongAgri Flow", rep: "Hoang Anh", sector: "AgriTech, Logistics", stage: "Pre-Seed", ask: 180000 },
  { name: "SmartSoil Labs", rep: "Jessica Williams", sector: "AgriTech, DeepTech", stage: "Seed", ask: 600000 },

  // EdTech & Upskilling (6)
  { name: "EduMind AI", rep: "Sarah Wong", sector: "EdTech, Artificial Intelligence", stage: "Seed", ask: 500000 },
  { name: "SkillUp Hub", rep: "Kenji Suzuki", sector: "EdTech, SaaS", stage: "Series A", ask: 3200000 },
  { name: "TutorFlow AI", rep: "Tran Binh", sector: "EdTech, Artificial Intelligence", stage: "Seed", ask: 600000 },
  { name: "ClassBot Technologies", rep: "Nguyen Anh", sector: "EdTech, SaaS", stage: "Pre-Seed", ask: 120000 },
  { name: "NextGen Academy", rep: "Maria Gomez", sector: "EdTech", stage: "Seed", ask: 450000 },
  { name: "EduLink Global", rep: "John Tan", sector: "EdTech, SaaS", stage: "Pre-Series A", ask: 1500000 },

  // HealthTech & BioTech (6)
  { name: "BioMind Health", rep: "Sarah Kim", sector: "HealthTech, DeepTech", stage: "Series A", ask: 4000000 },
  { name: "HealthBot Labs", rep: "Michael Smith", sector: "HealthTech, Artificial Intelligence", stage: "Seed", ask: 300000 },
  { name: "MedLink Vietnam", rep: "Pham Le", sector: "HealthTech, SaaS", stage: "Pre-Series A", ask: 2200000 },
  { name: "SmartCare AI", rep: "Kenji Binh", sector: "HealthTech, Artificial Intelligence", stage: "Seed", ask: 800000 },
  { name: "CardioVision Tech", rep: "Alex Chen", sector: "HealthTech, DeepTech", stage: "Series A", ask: 3500000 },
  { name: "GeneTech Labs", rep: "David Williams", sector: "HealthTech, DeepTech", stage: "Seed", ask: 700000 },

  // Cleantech & ClimateTech (6)
  { name: "EcoCharge Vietnam", rep: "Tran Gomez", sector: "Cleantech, IoT", stage: "Seed", ask: 850000 },
  { name: "GreenShield Energy", rep: "Maria Smith", sector: "Cleantech, SaaS", stage: "Pre-Series A", ask: 2500000 },
  { name: "CarbonLink Labs", rep: "Hoang Anh", sector: "Cleantech, SaaS", stage: "Seed", ask: 500000 },
  { name: "SolarFlow AI", rep: "Nguyen Pham", sector: "Cleantech, Artificial Intelligence", stage: "Seed", ask: 650000 },
  { name: "WasteZero Hub", rep: "Lee Tan", sector: "Cleantech, Logistics", stage: "Pre-Seed", ask: 180000 },
  { name: "CleanWater Works", rep: "Sarah Suzuki", sector: "Cleantech, DeepTech", stage: "Seed", ask: 400000 },

  // Artificial Intelligence & DeepTech (6)
  { name: "VietBase AI", rep: "Tran Anh", sector: "Artificial Intelligence, DeepTech", stage: "Seed", ask: 700000 },
  { name: "QuantumVision Labs", rep: "Kenji Binh", sector: "DeepTech, Artificial Intelligence", stage: "Series A", ask: 4500000 },
  { name: "DeepMind Robotics", rep: "Alex Williams", sector: "DeepTech, IoT", stage: "Series A", ask: 5000000 },
  { name: "VoiceGen AI", rep: "David Tan", sector: "Artificial Intelligence, SaaS", stage: "Seed", ask: 600000 },
  { name: "SenseTech AI", rep: "Michael Chen", sector: "DeepTech, IoT", stage: "Pre-Series A", ask: 2000000 },
  { name: "CyberCore Labs", rep: "John Suzuki", sector: "DeepTech, Artificial Intelligence", stage: "Seed", ask: 900000 },

  // Logistics & Supply Chain (5)
  { name: "LogiFlow Vietnam", rep: "Nguyen Le", sector: "Logistics, SaaS", stage: "Pre-Series A", ask: 2500000 },
  { name: "ColdChain Link", rep: "Tran Wong", sector: "Logistics, IoT", stage: "Seed", ask: 600000 },
  { name: "CargoHub SEA", rep: "David Pham", sector: "Logistics, E-commerce", stage: "Series A", ask: 4000000 },
  { name: "RouteSmart AI", rep: "Alex Tan", sector: "Logistics, Artificial Intelligence", stage: "Seed", ask: 450000 },
  { name: "PortTech Solutions", rep: "Kenji Kim", sector: "Logistics, DeepTech", stage: "Pre-Series A", ask: 2000000 },

  // SaaS & Enterprise Automation (5)
  { name: "WorkFlow Pro", rep: "Maria Chen", sector: "SaaS, Artificial Intelligence", stage: "Seed", ask: 500000 },
  { name: "RetailSync Hub", rep: "Hoang Binh", sector: "SaaS, E-commerce", stage: "Pre-Series A", ask: 1800000 },
  { name: "DocuSmart AI", rep: "Sarah Tan", sector: "SaaS, Artificial Intelligence", stage: "Seed", ask: 700000 },
  { name: "TalentFlow HR", rep: "Nguyen Smith", sector: "SaaS, Artificial Intelligence", stage: "Seed", ask: 400000 },
  { name: "InvoiceFast", rep: "Lee Gomez", sector: "SaaS, FinTech", stage: "Pre-Seed", ask: 200000 },

  // E-commerce & Consumer Tech (5)
  { name: "ShopLive Vietnam", rep: "Jessica Tran", sector: "E-commerce, SaaS", stage: "Seed", ask: 600000 },
  { name: "FreshBox SEA", rep: "Pham Anh", sector: "E-commerce, AgriTech", stage: "Seed", ask: 450000 },
  { name: "DirectBrand Hub", rep: "David Chen", sector: "E-commerce", stage: "Series A", ask: 3500000 },
  { name: "RetailAI Vision", rep: "Maria Wong", sector: "E-commerce, Artificial Intelligence", stage: "Pre-Series A", ask: 1600000 },
  { name: "SocialCart", rep: "Kenji Tan", sector: "E-commerce", stage: "Pre-Seed", ask: 180000 },

  // Blockchain & Web3 (4)
  { name: "CyberChain Labs", rep: "Michael Williams", sector: "Blockchain, DeepTech", stage: "Seed", ask: 500000 },
  { name: "TrustTrace Tech", rep: "Tran Hoang", sector: "Blockchain, AgriTech", stage: "Seed", ask: 400000 },
  { name: "DataVault Web3", rep: "Alex Kim", sector: "Blockchain, SaaS", stage: "Pre-Series A", ask: 1800000 },
  { name: "TokenFlow Protocol", rep: "Sarah Gomez", sector: "Blockchain, Cleantech", stage: "Seed", ask: 750000 },

  // IoT & Smart Cities (4)
  { name: "SmartCity Link", rep: "Nguyen Chen", sector: "IoT, DeepTech", stage: "Pre-Series A", ask: 1500000 },
  { name: "InfraSense AI", rep: "David Binh", sector: "IoT, Artificial Intelligence", stage: "Seed", ask: 700000 },
  { name: "ParkSmart Solutions", rep: "Lee Pham", sector: "IoT, SaaS", stage: "Pre-Seed", ask: 150000 },
  { name: "MeterFlow IoT", rep: "Maria Suzuki", sector: "IoT, Cleantech", stage: "Seed", ask: 500000 },

  // Cybersecurity & Cloud (3)
  { name: "SmartShield Labs", rep: "Lee Chen", sector: "DeepTech, SaaS", stage: "Series A", ask: 3800000 },
  { name: "GuardNet Technologies", rep: "John Williams", sector: "DeepTech, SaaS", stage: "Pre-Series A", ask: 2200000 },
  { name: "ZeroLeak AI", rep: "Tran Tan", sector: "DeepTech, Artificial Intelligence", stage: "Seed", ask: 600000 }
];

// Bespoke 31 Investors with 100% matched sectors and philosophies
const curatedInvestors = [
  { fund: "Global Partners", name: "John Nguyen", sectors: "Cleantech, AgriTech", ticket: 2000000, thesis: "Backing tech-enabled circular economy models and high-yield, climate-resilient farming solutions across the Mekong Delta." },
  { fund: "Green Global", name: "Kenji Suzuki", sectors: "DeepTech, Cleantech", ticket: 2000000, thesis: "Investing in early-stage material science, carbon accounting platforms, and energy transition hardware with verifiable ESG metrics." },
  { fund: "Alpha Partners", name: "Alex Tan", sectors: "EdTech, Artificial Intelligence, SaaS", ticket: 3000000, thesis: "Partnering with founders building generative AI-native learning companions and automated corporate upskilling ecosystems." },
  { fund: "Vertex Fund", name: "David Williams", sectors: "HealthTech, Artificial Intelligence", ticket: 3000000, thesis: "Targeting AI-assisted diagnostic tools, telemedicine infrastructure, and digital pharmacy networks serving tier-2 SEA cities." },
  { fund: "CyberAgent Ventures", name: "Sarah Kim", sectors: "E-commerce, SaaS, Artificial Intelligence", ticket: 2500000, thesis: "Leading Series Seed and Series A in high-growth social commerce, retail media infrastructure, and conversational AI tools." },
  { fund: "500 Global Vietnam", name: "Hoang Johnson", sectors: "FinTech, SaaS, Logistics", ticket: 1500000, thesis: "Early-stage hyper-scalable software, embedded B2B payments, and API-first supply chain visibility platforms across SEA." },
  { fund: "VinaCapital Ventures", name: "Lee Pham", sectors: "FinTech, Artificial Intelligence, DeepTech", ticket: 5000000, thesis: "Catalyzing transformative Vietnamese tech champions in AI-driven wealth management, digital banking, and enterprise cloud." },
  { fund: "Do Ventures", name: "Nguyen Anh", sectors: "EdTech, HealthTech, E-commerce", ticket: 3000000, thesis: "Consumer-centric and education-first technology startups unlocking massive domestic digital transformation in Vietnam." },
  { fund: "Monk's Hill Ventures", name: "Michael Williams", sectors: "Logistics, SaaS, AgriTech", ticket: 4000000, thesis: "Backing seasoned operators tackling foundational logistics friction and agricultural distribution bottlenecks in SE Asia." },
  { fund: "Golden Gate Ventures", name: "Lee Chen", sectors: "FinTech, HealthTech, E-commerce", ticket: 3500000, thesis: "Bridging Southeast Asia and global capital for category-defining consumer internet, health, and cross-border digital finance." },
  { fund: "Jungle Ventures", name: "Maria Gomez", sectors: "SaaS, FinTech, DeepTech", ticket: 6000000, thesis: "Build-to-scale investment philosophy for regional SaaS companies and enterprise software expanding globally from Vietnam." },
  { fund: "Insignia Ventures", name: "David Tan", sectors: "Artificial Intelligence, AgriTech, Logistics", ticket: 4500000, thesis: "High-conviction backing for market leaders leveraging AI automation in agritech cold chains and smart regional logistics." },
  { fund: "East Ventures", name: "Jessica Tran", sectors: "Cleantech, HealthTech, SaaS", ticket: 3000000, thesis: "Pioneering holistic digital ecosystems, inclusive healthcare software, and decarbonization tech throughout Southeast Asia." },
  { fund: "Wavemaker Partners", name: "Pham Le", sectors: "DeepTech, IoT, Cleantech", ticket: 3000000, thesis: "Southeast Asia's leading enterprise and deep tech fund, investing in industrial IoT sensors, robotics, and climate-resilience." },
  { fund: "Openspace Ventures", name: "Tran Gomez", sectors: "FinTech, EdTech, HealthTech", ticket: 5000000, thesis: "Growth-stage capital and hands-on operational excellence for consumer fintech, scalable edtech, and modern health platforms." },
  { fund: "Quest Ventures", name: "Sarah Suzuki", sectors: "E-commerce, Artificial Intelligence, SaaS", ticket: 2000000, thesis: "Driving digital commerce enablement, AI smart search algorithms, and cross-border marketplace platforms in SEA." },
  { fund: "Antler Vietnam", name: "Michael Smith", sectors: "FinTech, SaaS, Artificial Intelligence", ticket: 1000000, thesis: "Day-zero co-founder matching and pre-seed capital for exceptional software engineers building AI-native SaaS products." },
  { fund: "Sequoia Surge", name: "Alex Chen", sectors: "Artificial Intelligence, DeepTech, SaaS", ticket: 3000000, thesis: "Rapid scale-up capital and company-building community for early-stage deep tech and next-generation AI architectures." },
  { fund: "Bessemer Global", name: "Sarah Wong", sectors: "SaaS, Cleantech, FinTech", ticket: 5000000, thesis: "Long-term partnership with visionary software founders crafting market-defining cloud software and climate fintech tools." },
  { fund: "Lightspeed SEA", name: "Kenji Binh", sectors: "Artificial Intelligence, DeepTech, FinTech", ticket: 4000000, thesis: "Investing boldly in foundational AI models, high-throughput financial rails, and developer tooling across Southeast Asia." },
  { fund: "SOSV / Orbit Startups", name: "David Wong", sectors: "Blockchain, AgriTech, HealthTech", ticket: 1500000, thesis: "Global accelerator fund scaling cross-border food security, precision biology, and decentralized data verification systems." },
  { fund: "Plug and Play APAC", name: "Maria Smith", sectors: "IoT, Logistics, Cleantech", ticket: 2000000, thesis: "Corporate innovation bridge connecting smart manufacturing, port logistics startups, and clean energy pilots with Fortune 500s." },
  { fund: "Genesia Ventures", name: "John Suzuki", sectors: "EdTech, SaaS, AgriTech", ticket: 2500000, thesis: "Cultivating sustainable prosperity in Asia through investments in education equity, digital agriculture, and business SaaS." },
  { fund: "Access Ventures", name: "Tran Anh", sectors: "DeepTech, Artificial Intelligence, IoT", ticket: 3000000, thesis: "Specialized deep tech fund targeting computer vision, embedded edge-AI chips, and smart industrial automation." },
  { fund: "Cocoon Capital", name: "Jessica Williams", sectors: "SaaS, FinTech, DeepTech", ticket: 1500000, thesis: "Early-stage, high-conviction mentor fund focusing on B2B enterprise software and resilient financial infrastructure." },
  { fund: "ThinkZone Ventures", name: "Hoang Binh", sectors: "FinTech, EdTech, SaaS", ticket: 2000000, thesis: "Backing homegrown Vietnamese tech founders with strategic local enterprise distribution networks and expansion capital." },
  { fund: "Touchstone Partners", name: "Tran Wong", sectors: "AgriTech, Cleantech, HealthTech", ticket: 3000000, thesis: "Impact-driven venture firm dedicated to climate change mitigation, green agriculture, and healthcare accessibility in Vietnam." },
  { fund: "Nextrans Vietnam", name: "Lee Gomez", sectors: "Cleantech, Logistics, E-commerce", ticket: 2500000, thesis: "Active Korean-Vietnamese VC bridge investing in green mobility, EV charging infrastructure, and smart retail logistics." },
  { fund: "Ascend Vietnam Ventures", name: "Maria Wong", sectors: "SaaS, Artificial Intelligence, FinTech", ticket: 3000000, thesis: "Empowering visionary Vietnam-based tech startups poised to win regional and global enterprise markets." },
  { fund: "Zone Startups Vietnam", name: "Alex Kim", sectors: "EdTech, E-commerce, SaaS", ticket: 1500000, thesis: "Hands-on corporate accelerator backing high-growth B2B enterprise applications and customer engagement software." },
  { fund: "Mekong Capital", name: "David Binh", sectors: "HealthTech, AgriTech, E-commerce", ticket: 8000000, thesis: "Transformative growth capital driving consumer-facing supply chain excellence, modern retail, and wellness services." }
];

// Generate CSV rows for 62 Startups
const startupRows = [
  "Timestamp,Startup Name,Representative Name,Email Address,Phone Number,Primary Industry,Current Funding Stage,Target Funding Amount in USD,Upload Pitch Deck (PDF)"
];

curatedStartups.forEach((s, i) => {
  const fName = s.rep;
  const sName = s.name;
  const email = `${fName.toLowerCase().replace(/\s+/g, '.')}.${i + 1}@${sName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`;
  const phone = `+849${Math.floor(10000000 + Math.random() * 89999999)}`;
  const date = new Date(2026, 6, 1 + (i % 25)).toISOString();
  const deck = `https://drive.google.com/drive/folders/davas2026_startup_${i + 1}`;
  startupRows.push(`"${date}","${sName}","${fName}","${email}","${phone}","${s.sector}","${s.stage}",${s.ask},"${deck}"`);
});

fs.writeFileSync("davas_startups.csv", startupRows.join("\n"), "utf8");

// Generate CSV rows for 31 Investors
const investorRows = [
  "Timestamp,Investor or Fund Name,Representative Name,Email Address,Phone Number,Investment Sectors of Interest,Maximum Ticket Size (USD),Investment Philosophy / Thesis"
];

curatedInvestors.forEach((inv, i) => {
  const fName = inv.name;
  const fund = inv.fund;
  const email = `${fName.toLowerCase().replace(/\s+/g, '.')}@${fund.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`;
  const phone = `+849${Math.floor(10000000 + Math.random() * 89999999)}`;
  const date = new Date(2026, 6, 1 + (i % 25)).toISOString();
  investorRows.push(`"${date}","${fund}","${fName}","${email}","${phone}","${inv.sectors}",${inv.ticket},"${inv.thesis}"`);
});

fs.writeFileSync("davas_investors.csv", investorRows.join("\n"), "utf8");
console.log("Successfully generated 62 Curated Startups & 31 Curated Investors!");
