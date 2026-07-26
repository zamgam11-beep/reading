import React, { useState, useMemo } from 'react';
import { ReadingLog } from '../types';
import { exportLogsToCSV } from '../utils/storage';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Star, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Award, 
  TrendingUp, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface TeacherDashboardViewProps {
  logs: ReadingLog[];
  onSelectLog: (log: ReadingLog) => void;
  onDeleteLog: (id: string) => void;
  onAddBadge: (logId: string, badge: string, comment: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  logs,
  onSelectLog,
  onDeleteLog,
  onAddBadge,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter logs by selected grade & class & search query
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesGrade = selectedGrade === 'all' || String(log.grade) === selectedGrade;
      const matchesClass = selectedClass === 'all' || String(log.classNum) === selectedClass;
      const matchesSearch = 
        log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGrade && matchesClass && matchesSearch;
    });
  }, [logs, selectedGrade, selectedClass, searchQuery]);

  // Overall Statistics
  const totalReadCount = filteredLogs.length;

  const uniqueStudents = useMemo(() => {
    const set = new Set(filteredLogs.map((l) => `${l.grade}-${l.classNum}-${l.studentName}`));
    return set.size;
  }, [filteredLogs]);

  const avgRating = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    const sum = filteredLogs.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / filteredLogs.length).toFixed(1));
  }, [filteredLogs]);

  const topPopularBook = useMemo(() => {
    if (filteredLogs.length === 0) return '없음';
    const bookCounts: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      bookCounts[l.bookTitle] = (bookCounts[l.bookTitle] || 0) + 1;
    });
    let topBook = '';
    let max = 0;
    Object.entries(bookCounts).forEach(([title, count]) => {
      if (count > max) {
        max = count;
        topBook = title;
      }
    });
    return topBook ? `${topBook} (${max}회)` : '데이터 없음';
  }, [filteredLogs]);

  const handleCSVDownload = () => {
    if (filteredLogs.length === 0) {
      alert('다운로드할 독서 기록 데이터가 없습니다.');
      return;
    }
    const gradeStr = selectedGrade === 'all' ? '전체' : `${selectedGrade}학년`;
    const classStr = selectedClass === 'all' ? '전체' : `${selectedClass}반`;
    const filename = `우리반_독서기록장_${gradeStr}_${classStr}_${new Date().toISOString().split('T')[0]}.csv`;
    exportLogsToCSV(filteredLogs, filename);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            선생님 전용 통합 관리 센터
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            선생님 대시보드 📊
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            우리 반 학생들의 제출 기록 검토, 학급별 통계 확인 및 엑셀 다운로드를 진행하세요.
          </p>
        </div>

        {/* CSV Download Button */}
        <button
          onClick={handleCSVDownload}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-indigo-600/30 transition hover:scale-[1.02] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>엑셀 / CSV 데이터 다운로드</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>학급 필터:</span>
          </div>

          {/* Grade Select */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="all">전체 학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년</option>
            <option value="6">6학년</option>
          </select>

          {/* Class Select */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="all">전체 반</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <option key={c} value={String(c)}>
                {c}반
              </option>
            ))}
          </select>

          {(selectedGrade !== 'all' || selectedClass !== 'all') && (
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSelectedClass('all');
              }}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="학생 이름 또는 도서명 검색..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Read */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">총 읽은 권수</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalReadCount} <span className="text-sm font-bold text-slate-400">권</span></div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 선택 필터 기준
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Participating Students */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">참여 학생 수</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{uniqueStudents} <span className="text-sm font-bold text-slate-400">명</span></div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              활발히 독서 기록 중
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Average Rating */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">평균 독서 별점</div>
            <div className="text-3xl font-black text-amber-500 mt-1">★ {avgRating}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              5.0 만점 기준
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Card 4: Top Popular Book */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">가장 인기 도서</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1.5 truncate max-w-[140px]" title={topPopularBook}>
              {topPopularBook}
            </div>
            <div className="text-[11px] text-violet-600 font-semibold mt-1">
              최다 기록 도서
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Reading Logs Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              학급 독서기록 리스트 ({filteredLogs.length}건)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              학생이 제출한 상세 줄거리와 느낀 점을 검토하고 칭찬 스티커를 등록할 수 있습니다.
            </p>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-slate-400 font-bold text-sm">해당 학급의 제출 기록이 없습니다.</div>
            <p className="text-xs text-slate-400">필터 조건을 변경하거나 학생 독서록 작성을 요청해 주세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">작성일시</th>
                  <th className="px-6 py-3.5">학년/반</th>
                  <th className="px-6 py-3.5">이름</th>
                  <th className="px-6 py-3.5">도서명</th>
                  <th className="px-6 py-3.5">저자/출판사</th>
                  <th className="px-6 py-3.5">별점</th>
                  <th className="px-6 py-3.5">칭찬 스티커</th>
                  <th className="px-6 py-3.5 text-right">검토 및 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-indigo-50/20 transition">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {log.createdAt}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.grade}학년 {log.classNum}반
                    </td>
                    <td className="px-6 py-4 font-extrabold text-indigo-900 whitespace-nowrap">
                      {log.studentName}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {log.bookTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {log.author || '저자미상'} {log.publisher ? `/ ${log.publisher}` : ''}
                    </td>
                    <td className="px-6 py-4 text-amber-500 font-bold whitespace-nowrap">
                      ★ {log.rating}.0
                    </td>
                    <td className="px-6 py-4">
                      {log.badge ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 whitespace-nowrap">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          {log.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">미부여</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onSelectLog(log)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          상세 검토
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${log.studentName} 학생의 '${log.bookTitle}' 독서 기록을 삭제하시겠습니까?`)) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
