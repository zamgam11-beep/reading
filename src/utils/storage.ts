import { ReadingLog, GASConfig } from '../types';
import { INITIAL_MOCK_LOGS } from '../data/mockData';

const LOCAL_STORAGE_LOGS_KEY = 'class_reading_logs_v1';
const LOCAL_STORAGE_GAS_KEY = 'class_reading_gas_config_v1';
const LOCAL_STORAGE_STUDENT_PREF_KEY = 'class_reading_student_pref_v1';

/**
 * Get all reading logs from localStorage (or initialize with mock data)
 */
export function getStoredLogs(): ReadingLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(INITIAL_MOCK_LOGS));
      return INITIAL_MOCK_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_LOGS;
  } catch (err) {
    console.error('Failed to load stored reading logs:', err);
    return INITIAL_MOCK_LOGS;
  }
}

/**
 * Save logs to localStorage
 */
export function saveStoredLogs(logs: ReadingLog[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save reading logs:', err);
  }
}

/**
 * Get stored GAS configuration
 */
export function getGASConfig(): GASConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GAS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load GAS config:', err);
  }
  return { webAppUrl: '', isConnected: false };
}

/**
 * Save GAS configuration
 */
export function saveGASConfig(config: GASConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_GAS_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save GAS config:', err);
  }
}

/**
 * Get student profile preference (grade, classNum, studentName)
 */
export function getStudentPref(): { grade: number; classNum: number; studentName: string } {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENT_PREF_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return { grade: 5, classNum: 2, studentName: '' };
}

/**
 * Save student profile preference
 */
export function saveStudentPref(pref: { grade: number; classNum: number; studentName: string }): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENT_PREF_KEY, JSON.stringify(pref));
  } catch (e) {
    // ignore
  }
}

/**
 * Send reading log entry to Google Apps Script Web App (POST request)
 */
export async function sendLogToGAS(log: ReadingLog, webAppUrl: string): Promise<boolean> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return false;
  }
  try {
    // Note: GAS web apps require text/plain to avoid CORS preflight errors
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(log),
      mode: 'cors',
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (err) {
    console.warn('GAS POST failed or blocked by CORS (data saved locally):', err);
    return false;
  }
}

/**
 * Fetch entries from Google Apps Script Web App (GET request)
 */
export async function fetchLogsFromGAS(webAppUrl: string): Promise<ReadingLog[] | null> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return null;
  }
  try {
    const response = await fetch(webAppUrl, {
      method: 'GET',
      mode: 'cors',
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (json && json.result === 'success' && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn('GAS GET fetch failed:', err);
  }
  return null;
}

/**
 * Test GAS connection
 */
export async function testGASConnection(webAppUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: '올바른 웹 앱 URL(https://script.google.com/...)을 입력해 주세요.' };
  }
  try {
    const response = await fetch(webAppUrl, {
      method: 'GET',
      mode: 'cors',
    });
    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data && data.result === 'success') {
        return { success: true, message: '구글 앱스 스크립트(GAS)와 성공적으로 연동되었습니다! 🎉' };
      }
      return { success: true, message: '구글 응답을 수신했습니다. 시트 연동 준비 완료!' };
    }
    return { success: false, message: `서버 응답 오류 (상태 코드: ${response.status})` };
  } catch (err) {
    return { 
      success: false, 
      message: 'CORS 설정 또는 Web App 배포 액세스 권한("모든 사용자/Anyone")을 확인해 주세요. (로컬 데이터 전송은 정상 동작합니다.)' 
    };
  }
}

/**
 * Export logs to CSV with UTF-8 BOM so Microsoft Excel opens Korean characters cleanly!
 */
export function exportLogsToCSV(logs: ReadingLog[], filename: string = '독서기록장_데이터.csv'): void {
  const headers = ['ID', '학년', '반', '이름', '도서명', '지은이', '출판사', '줄거리', '소감', '별점', '작성일시', '칭찬칭호', '선생님한마디'];
  
  const rows = logs.map(log => [
    `"${log.id}"`,
    log.grade,
    log.classNum,
    `"${log.studentName.replace(/"/g, '""')}"`,
    `"${log.bookTitle.replace(/"/g, '""')}"`,
    `"${log.author.replace(/"/g, '""')}"`,
    `"${log.publisher.replace(/"/g, '""')}"`,
    `"${log.summary.replace(/"/g, '""')}"`,
    `"${log.thoughts.replace(/"/g, '""')}"`,
    log.rating,
    `"${log.createdAt}"`,
    `"${(log.badge || '').replace(/"/g, '""')}"`,
    `"${(log.teacherComment || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  
  // UTF-8 BOM byte order mark
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
