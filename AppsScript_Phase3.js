// =========================================================================
// DAVAS 2026 - GOOGLE APPS SCRIPT INTEGRATION (WEBHOOK & API)
// File này đóng vai trò như một API siêu nhỏ để giao tiếp với hệ sinh thái Google.
// Không dùng để chạy AI Matching nữa (chức năng AI đã được chuyển sang Node.js).
// =========================================================================

/**
 * Hàm doPost: Nhận tín hiệu (Webhook) từ Node.js Backend để thực hiện các Action
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "trigger_schedule") {
      // Trigger cả Gửi Email và Tạo Calendar
      sendMatchEmail(data.startupEmail, data.investorEmail, data.startupName, data.investorName, data.reason, data.iceBreakers);
      createCalendarEvent(data.startupEmail, data.investorEmail, data.startupName, data.investorName, data.date, data.time);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã gửi Email và Lịch" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Hành động không hợp lệ" }))
        .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
  }
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
${iceBreakers}

A calendar invitation for your introductory meeting has been automatically sent to both of you.

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
function createCalendarEvent(startupEmail, investorEmail, startupName, investorName, dateStr, timeStr) {
  // Nếu Node.js truyền vào dateStr và timeStr thì parse, nếu không thì lấy mặc định
  let startTime, endTime;
  
  if (dateStr && timeStr) {
    startTime = new Date(`${dateStr}T${timeStr}:00`);
    endTime = new Date(startTime.getTime() + 30 * 60000); // Mặc định họp 30 phút
  } else {
    // Fallback: Nếu không truyền, tạo lịch 7 ngày sau lúc 10h sáng
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7); 
    startTime = new Date(eventDate);
    startTime.setHours(10, 0, 0, 0); 
    endTime = new Date(eventDate);
    endTime.setHours(10, 30, 0, 0); 
  }
  
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

// =========================================================================
// GIAI ĐOẠN 4: TẠO API (GET) CHO REACT WEB DASHBOARD
// =========================================================================

/**
 * Hàm doGet biến Apps Script thành Web API
 * Trả về danh sách Startups và Investors lấy trực tiếp từ Sheets dưới dạng JSON
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Đọc danh sách Startups
  const startupSheet = ss.getSheetByName("Startups");
  const startupData = startupSheet ? startupSheet.getDataRange().getValues() : [];
  const startups = [];
  if (startupData.length > 1) {
    const headers = startupData[0];
    for (let i = 1; i < startupData.length; i++) {
      let obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = startupData[i][j];
      }
      startups.push(obj);
    }
  }

  // Đọc danh sách Investors
  const investorSheet = ss.getSheetByName("Investors");
  const investorData = investorSheet ? investorSheet.getDataRange().getValues() : [];
  const investors = [];
  if (investorData.length > 1) {
    const headers = investorData[0];
    for (let i = 1; i < investorData.length; i++) {
      let obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = investorData[i][j];
      }
      investors.push(obj);
    }
  }
  
  const result = {
    startups: startups,
    investors: investors
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
