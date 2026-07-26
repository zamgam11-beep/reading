import React, { useState, useEffect } from 'react';
import { ReadingLog, GASConfig, ActiveTab } from './types';
import { 
  getStoredLogs, 
  saveStoredLogs, 
  getGASConfig, 
  saveGASConfig, 
  fetchLogsFromGAS 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StudentJournalView } from './components/StudentJournalView';
import { ReadingKingView } from './components/ReadingKingView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { GASSettingsView } from './components/GASSettingsView';
import { LogDetailModal } from './components/LogDetailModal';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('student');
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [gasConfig, setGasConfig] = useState<GASConfig>({ webAppUrl: '', isConnected: false });
  const [selectedLog, setSelectedLog] = useState<ReadingLog | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    const loadedLogs = getStoredLogs();
    setLogs(loadedLogs);

    const loadedGAS = getGASConfig();
    setGasConfig(loadedGAS);
  }, []);

  // Save logs whenever updated
  const handleAddLog = (newLog: ReadingLog) => {
    const updated = [newLog, ...logs];
    setLogs(updated);
    saveStoredLogs(updated);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    saveStoredLogs(updated);
    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
  };

  const handleAddBadge = (logId: string, badge: string, comment: string) => {
    const updated = logs.map((l) => {
      if (l.id === logId) {
        return {
          ...l,
          badge: badge || undefined,
          teacherComment: comment || undefined,
        };
      }
      return l;
    });
    setLogs(updated);
    saveStoredLogs(updated);

    if (selectedLog && selectedLog.id === logId) {
      setSelectedLog({
        ...selectedLog,
        badge: badge || undefined,
        teacherComment: comment || undefined,
      });
    }
  };

  const handleSaveGASConfig = (newConfig: GASConfig) => {
    setGasConfig(newConfig);
    saveGASConfig(newConfig);
  };

  const handleSyncFromGAS = async () => {
    if (!gasConfig.webAppUrl) return;
    const fetched = await fetchLogsFromGAS(gasConfig.webAppUrl);
    if (fetched && fetched.length > 0) {
      // Merge unique by ID
      const mergedMap = new Map<string, ReadingLog>();
      logs.forEach((l) => mergedMap.set(l.id, l));
      fetched.forEach((l) => mergedMap.set(l.id, l));
      const mergedLogs = Array.from(mergedMap.values());
      setLogs(mergedLogs);
      saveStoredLogs(mergedLogs);
      alert(`🎉 구글 시트에서 총 ${fetched.length}건의 독서 기록을 새로 동기화했습니다!`);
    } else {
      alert('구글 시트에 조회할 새 독서 기록이 없거나 접근 권한을 확인해야 합니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gasConfig={gasConfig}
        totalLogsCount={logs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {activeTab === 'student' && (
          <StudentJournalView
            logs={logs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onSelectLog={(log) => setSelectedLog(log)}
            gasConfig={gasConfig}
          />
        )}

        {activeTab === 'king' && (
          <ReadingKingView
            logs={logs}
            onSelectLog={(log) => setSelectedLog(log)}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboardView
            logs={logs}
            onSelectLog={(log) => setSelectedLog(log)}
            onDeleteLog={handleDeleteLog}
            onAddBadge={handleAddBadge}
          />
        )}

        {activeTab === 'settings' && (
          <GASSettingsView
            gasConfig={gasConfig}
            onSaveGASConfig={handleSaveGASConfig}
            onSyncFromGAS={handleSyncFromGAS}
          />
        )}

      </main>

      {/* Log Detail Modal */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        onAddBadge={handleAddBadge}
        isTeacher={activeTab === 'teacher'}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">우리반 전자 독서기록장</span>
            <span className="text-slate-300">•</span>
            <span>초·중·고 학급용 스탠다드 웹 앱</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 스마트 학급 독서 프로젝트</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 꿈과 지혜를 가꾸는 독서 교육
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
