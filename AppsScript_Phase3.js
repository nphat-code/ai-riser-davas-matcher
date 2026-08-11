// Thay chuỗi "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY" bằng API Key thật của bạn
const GEMINI_API_KEY = "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY"; 

function callGeminiAPI(startupInfo, investorInfo) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = `Bạn là một Chuyên gia Phân tích Đầu tư Mạo hiểm (Venture Capital Analyst) cấp cao tại sự kiện DAVAS. Nhiệm vụ của bạn là đọc thông tin hồ sơ của một Startup và thông tin Gu đầu tư của một Nhà đầu tư (Investor/VC), sau đó đánh giá mức độ phù hợp để họ gặp nhau 1:1.

Hãy phân tích dựa trên các tiêu chí: Lĩnh vực, Giai đoạn gọi vốn, Ngân sách (Ticket size) và Triết lý đầu tư.

BẮT BUỘC trả về kết quả dưới định dạng JSON với 3 trường: "matching_score", "reason", "ice_breakers".
LƯU Ý QUAN TRỌNG: Bạn PHẢI viết nội dung cho phần "reason" và "ice_breakers" hoàn toàn bằng TIẾNG ANH (English), bất kể ngôn ngữ đầu vào là gì.`;

  const promptText = `Vui lòng đánh giá cặp đôi sau:\n- Startup: ${startupInfo}\n- Nhà đầu tư: ${investorInfo}`;

  const payload = {
    "system_instruction": { "parts": { "text": systemInstruction } },
    "contents": [{ "parts": [{ "text": promptText }] }],
    "generationConfig": { "response_mime_type": "application/json" }
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if (json.candidates && json.candidates.length > 0) {
      const resultText = json.candidates[0].content.parts[0].text;
      return JSON.parse(resultText); 
    } else {
      Logger.log("Lỗi phản hồi: " + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log("Lỗi code: " + e.message);
    return null;
  }
}

// Hàm này dùng để chạy test thử xem kết nối API có mượt không
function testGemini() {
  const startup = "EduBot, EdTech, Seed, $500k";
  const investor = "Global Ventures, EdTech & AI, $300k-$1M";
  
  Logger.log("Đang gọi AI suy nghĩ...");
  const result = callGeminiAPI(startup, investor);
  
  Logger.log("KẾT QUẢ TỪ AI:");
  Logger.log("Điểm số: " + result.matching_score);
  Logger.log("Lý do: " + result.reason);
  Logger.log("Câu hỏi gợi mở: " + result.ice_breakers.join(" | "));
}

// Hàm tự động ghép cặp Nhà đầu tư mới nhất với TẤT CẢ Startups
function runMatchmaker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const investorSheet = ss.getSheetByName("Investors");
  const startupSheet = ss.getSheetByName("Startups");
  
  // Tự động tạo Sheet "Matches" nếu chưa có
  let matchSheet = ss.getSheetByName("Matches");
  if (!matchSheet) {
    matchSheet = ss.insertSheet("Matches");
    matchSheet.appendRow(["Thời gian", "Nhà đầu tư", "Startup", "Điểm số", "Lý do", "Câu hỏi gợi mở"]);
    matchSheet.getRange("A1:F1").setFontWeight("bold").setBackground("#e0f7fa");
  }

  // Lấy dữ liệu Startups
  const startupData = startupSheet.getDataRange().getValues();
  const startupHeaders = startupData[0];
  
  // Lấy dữ liệu Nhà đầu tư mới nhất (dòng cuối cùng)
  const investorData = investorSheet.getDataRange().getValues();
  if (investorData.length <= 1) {
    Logger.log("Chưa có dữ liệu Nhà đầu tư nào!");
    return;
  }
  const investorHeaders = investorData[0];
  const latestInvestorRow = investorData[investorData.length - 1]; // Lấy dòng dưới cùng
  
  // Đóng gói thông tin Nhà đầu tư (tự động gom tất cả các cột)
  let investorInfo = "";
  for(let i = 0; i < investorHeaders.length; i++) {
    investorInfo += `${investorHeaders[i]}: ${latestInvestorRow[i]}\n`;
  }
  const investorName = latestInvestorRow[1] || "Nhà đầu tư"; // Mặc định cột 2 là Tên
  
  // Duyệt qua toàn bộ Startups để chấm điểm
  Logger.log(`BẮT ĐẦU TÌM KIẾM CHO NHÀ ĐẦU TƯ: ${investorName}`);
  
  for (let i = 1; i < startupData.length; i++) {
    let startupRow = startupData[i];
    let startupInfo = "";
    for(let j = 0; j < startupHeaders.length; j++) {
      startupInfo += `${startupHeaders[j]}: ${startupRow[j]}\n`;
    }
    
    const startupName = startupRow[1] || `Startup số ${i}`;
    Logger.log(`Đang so khớp với: ${startupName}...`);
    
    // Gọi não bộ Gemini
    const result = callGeminiAPI(startupInfo, investorInfo);
    
    if (result && result.matching_score) {
      // Ghi kết quả vào Sheet "Matches"
      matchSheet.appendRow([
        new Date(),
        investorName,
        startupName,
        result.matching_score,
        result.reason,
        result.ice_breakers.join("\n- ")
      ]);
      Logger.log(`=> Đã ghép cặp xong! Điểm: ${result.matching_score}`);
      
      // =========================================================================
      // TRIGGER GIAI ĐOẠN 3: ĐẶT LỊCH VÀ GỬI EMAIL NẾU ĐIỂM >= 75
      // =========================================================================
      
      // Xử lý điểm số do AI đôi khi trả về chữ (ví dụ: "90/100" hoặc "90%")
      let rawScore = String(result.matching_score);
      let numericScore = parseInt(rawScore, 10);
      
      if (numericScore >= 75) {
        Logger.log("Điểm cao (>=75). Bắt đầu gửi Email và Calendar...");
        
        // Lấy email từ Sheets (Cột số 4, index 3 theo dữ liệu thực tế)
        const investorEmail = latestInvestorRow[3];
        const startupEmail = startupRow[3];
        
        const iceBreakersText = result.ice_breakers.join("\n- ");
        
        // Kích hoạt Hành động
        sendMatchEmail(startupEmail, investorEmail, startupName, investorName, result.reason, iceBreakersText);
        createCalendarEvent(startupEmail, investorEmail, startupName, investorName);
      }
    }
    
    // Tạm nghỉ 4 giây giữa mỗi lần gọi để không bị Google chặn spam (Free Tier giới hạn 15 req/phút)
    Utilities.sleep(4000); 
  }
  Logger.log("🎉 HOÀN THÀNH QUÁ TRÌNH GHÉP CẶP!");
}

// =========================================================================
// GIAI ĐOẠN 3: TỰ ĐỘNG HÓA EMAIL (GMAIL) VÀ ĐẶT LỊCH (GOOGLE CALENDAR)
// =========================================================================

/**
 * Hàm gửi Email tự động bằng tiếng Anh
 */
function sendMatchEmail(startupEmail, investorEmail, startupName, investorName, reason, iceBreakers) {
  const subject = `[DAVAS 2026] Business Matching Success: ${startupName} & ${investorName}`;
  const body = `
Dear ${startupName} and ${investorName},

Congratulations! The DAVAS AI Matchmaker has identified a high-potential synergy between your profiles.

🎯 WHY YOU MATCHED:
${reason}

🤝 AI ICE-BREAKERS (To kickstart your conversation):
- ${iceBreakers}

A calendar invitation for a 30-minute introductory meeting has been automatically sent to both of you.

Best regards,
DAVAS AI Matchmaker Team
  `;
  
  const recipients = `${startupEmail},${investorEmail}`;
  try {
    MailApp.sendEmail({ to: recipients, subject: subject, body: body });
    Logger.log("Email sent successfully to: " + recipients);
  } catch (e) {
    Logger.log("Error sending email: " + e.toString());
  }
}

/**
 * Hàm tạo sự kiện Google Calendar
 */
function createCalendarEvent(startupEmail, investorEmail, startupName, investorName) {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 7); // Tính tới 7 ngày sau
  
  const startTime = new Date(eventDate);
  startTime.setHours(10, 0, 0, 0); // 10:00 AM
  
  const endTime = new Date(eventDate);
  endTime.setHours(10, 30, 0, 0); // 10:30 AM
  
  const title = `[DAVAS Match] ${startupName} x ${investorName}`;
  const description = "Business matching introductory meeting arranged by DAVAS AI.";
  
  try {
    const event = CalendarApp.getDefaultCalendar().createEvent(title, startTime, endTime, {
      description: description,
      guests: `${startupEmail},${investorEmail}`,
      sendInvites: true // Ép Google Calendar gửi thư mời
    });
    Logger.log("Calendar event created: " + event.getId());
  } catch (e) {
    Logger.log("Error creating calendar event: " + e.toString());
  }
}
