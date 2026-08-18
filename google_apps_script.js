// =========================================================================
// DAVAS 2026 - GOOGLE APPS SCRIPT INTEGRATION (WEBHOOK & API)
// Hệ thống tích hợp hai chiều giữa Node.js, Google Sheets, Gmail & Google Calendar
// =========================================================================

/**
 * Hàm doPost: Nhận tín hiệu (Webhook) từ Node.js Backend để thực hiện các Action
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // -----------------------------------------------------------------------
    // ACTION 1: LƯU CẶP MATCH MỚI VÀO SHEET "Matches"
    // -----------------------------------------------------------------------
    if (action === "save_match") {
      let sheet = ss.getSheetByName("Matches");
      if (!sheet) {
        sheet = ss.insertSheet("Matches");
        sheet.appendRow([
          "Match_ID", "Timestamp", "Startup_Name", "Founder_Name", "Startup_Email",
          "Startup_Sector", "Startup_Stage", "Target_Ask", "Investor_Firm",
          "Investor_Representative", "Investor_Email", "AI_Match_Score",
          "Compatibility_Rating", "AI_Match_Reason", "AI_Ice_Breakers",
          "Assigned_Table", "Meeting_Date", "Meeting_Time_Slot", "Meeting_Status",
          "Investor_Notes", "AI_Followup_Draft", "Deal_Outcome"
        ]);
      }

      const rating = (data.score >= 80) ? "High Conviction Match" : ((data.score >= 50) ? "Moderate Synergy Match" : "Low Compatibility / Mismatch");
      const iceBreakersStr = Array.isArray(data.iceBreakers) ? data.iceBreakers.join("\n") : (data.iceBreakers || "");

      sheet.appendRow([
        data.id || ("DAVAS-M" + new Date().getTime()),
        new Date().toISOString(),
        data.startupName || "",
        data.founderName || "",
        data.startupEmail || "",
        data.startupSector || "",
        data.startupStage || "",
        data.targetAsk || "",
        data.investorFirm || "",
        data.investorName || "",
        data.investorEmail || "",
        data.score || 95,
        rating,
        data.reason || "",
        iceBreakersStr,
        data.table || "Table A1",
        data.date || "2026-08-13",
        data.time || "Pending Schedule",
        data.status || "Scheduled",
        data.notes || "",
        data.followupDraft || "",
        "Scheduled"
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Match saved to Google Sheets" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // -----------------------------------------------------------------------
    // ACTION 2: CẬP NHẬT GIỜ HỌP & BÀN HỌP TỪ THUẬT TOÁN SMART SCHEDULER
    // -----------------------------------------------------------------------
    if (action === "update_schedule") {
      let sheet = ss.getSheetByName("Matches");
      if (sheet && data.schedule && Array.isArray(data.schedule)) {
        const values = sheet.getDataRange().getValues();
        data.schedule.forEach(function(slot) {
          for (let i = 1; i < values.length; i++) {
            const rowStartup = values[i][2]; // Startup_Name
            const rowInvestor = values[i][8]; // Investor_Firm
            if (rowStartup === slot.startupName && rowInvestor === slot.investorFirm) {
              sheet.getRange(i + 1, 16).setValue(slot.table || "Table A1"); // Cột 16: Assigned_Table
              sheet.getRange(i + 1, 18).setValue(slot.time || "09:00 - 09:30"); // Cột 18: Meeting_Time_Slot
              sheet.getRange(i + 1, 19).setValue("Confirmed"); // Cột 19: Meeting_Status
              break;
            }
          }
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Schedule updated in Google Sheets" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // -----------------------------------------------------------------------
    // ACTION 3: TỰ ĐỘNG GỬI EMAIL VÀ ĐẶT LỊCH GOOGLE CALENDAR
    // -----------------------------------------------------------------------
    if (action === "trigger_schedule") {
      sendMatchEmail(data.startupEmail, data.investorEmail, data.startupName, data.investorName, data.reason, data.iceBreakers);
      createCalendarEvent(data.startupEmail, data.investorEmail, data.startupName, data.investorName, data.date, data.time);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã gửi Email và Lịch thành công" }))
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
 * Hàm doGet: Trả về danh sách Startups, Investors và các Matches đã lưu từ trước
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  function getSheetData(sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    const headers = data[0];
    const rows = [];
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j];
      }
      rows.push(obj);
    }
    return rows;
  }

  const result = {
    startups: getSheetData("Startups"),
    investors: getSheetData("Investors"),
    matches: getSheetData("Matches")
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
