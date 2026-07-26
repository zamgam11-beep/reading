/**
 * Google Apps Script (Code.gs) template for Class Digital Reading Journal
 */
export const GAS_CODE_TEMPLATE = `// =================================================================
// [우리반 전자 독서기록장] Google Apps Script (Code.gs)
// 구글 시트에 이 코드를 붙여넣고 '웹 앱으로 배포' 하세요!
// =================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 시트가 비어있을 경우 헤더 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID", "학년", "반", "이름", "도서명", "지은이", "출판사", 
        "줄거리", "소감", "별점", "작성일시"
      ]);
      // 헤더 스타일 적용 (인디고 테마)
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground("#4F46E5").setFontColor("#FFFFFF").setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    var newRow = [
      data.id || "LOG_" + new Date().getTime(),
      data.grade,
      data.classNum,
      data.studentName,
      data.bookTitle,
      data.author || "",
      data.publisher || "",
      data.summary || "",
      data.thoughts || "",
      data.rating || 5,
      data.createdAt || new Date().toLocaleString("ko-KR")
    ];
    
    sheet.appendRow(newRow);
    
    var output = ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "독서 기록이 성공적으로 구글 시트에 저장되었습니다.",
      data: data
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
    
  } catch (error) {
    var errOutput = ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    }));
    errOutput.setMimeType(ContentService.MimeType.JSON);
    return errOutput;
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      var emptyOutput = ContentService.createTextOutput(JSON.stringify({
        result: "success",
        data: []
      }));
      emptyOutput.setMimeType(ContentService.MimeType.JSON);
      return emptyOutput;
    }
    
    var logs = [];
    // 첫번째 헤더 행 제외
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (!row[3] || !row[4]) continue; // 이름이나 도서명이 없으면 패스
      
      logs.push({
        id: row[0] ? String(row[0]) : "LOG_" + i,
        grade: Number(row[1]) || 1,
        classNum: Number(row[2]) || 1,
        studentName: String(row[3] || ""),
        bookTitle: String(row[4] || ""),
        author: String(row[5] || ""),
        publisher: String(row[6] || ""),
        summary: String(row[7] || ""),
        thoughts: String(row[8] || ""),
        rating: Number(row[9]) || 5,
        createdAt: String(row[10] || "")
      });
    }
    
    var successOutput = ContentService.createTextOutput(JSON.stringify({
      result: "success",
      data: logs
    }));
    successOutput.setMimeType(ContentService.MimeType.JSON);
    return successOutput;
    
  } catch (error) {
    var errOutput = ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    }));
    errOutput.setMimeType(ContentService.MimeType.JSON);
    return errOutput;
  }
}
`;
