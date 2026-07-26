import React, { useState, useEffect } from 'react';
import { ReadingLog, GASConfig } from '../types';
import { 
  getStudentPref, 
  saveStudentPref, 
  sendLogToGAS 
} from '../utils/storage';
import { 
  BookOpen, 
  Star, 
  Send, 
  CheckCircle2, 
  Search, 
  Filter, 
  List, 
  Grid, 
  Trash2, 
  Eye, 
  BookMarked, 
  Sparkles, 
  UserCheck,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';

interface StudentJournalViewProps {
  logs: ReadingLog[];
  onAddLog: (newLog: ReadingLog) => void;
  onDeleteLog: (id: string) => void;
  onSelectLog: (log: ReadingLog) => void;
  gasConfig: GASConfig;
}

export const StudentJournalView: React.FC<StudentJournalViewProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
  onSelectLog,
  gasConfig,
}) => {
  const [subTab, setSubTab] = useState<'write' | 'history'>('write');

  // Form State
  const [grade, setGrade] = useState<number>(5);
  const [classNum, setClassNum] = useState<number>(2);
  const [studentName, setStudentName] = useState<string>('');
  const [bookTitle, setBookTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [thoughts, setThoughts] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // History Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStudentOnly, setFilterStudentOnly] = useState<boolean>(false);

  // Load saved student preference on initial mount
  useEffect(() => {
    const pref = getStudentPref();
    setGrade(pref.grade || 5);
    setClassNum(pref.classNum || 2);
    setStudentName(pref.studentName || '');
  }, []);

  const handleStarClick = (num: number) => {
    setRating(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('학생 이름을 입력해 주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }
    if (!summary.trim()) {
      alert('줄거리를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Save student profile preference
    if (rememberMe) {
      saveStudentPref({ grade, classNum, studentName: studentName.trim() });
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: ReadingLog = {
      id: 'LOG_' + Date.now(),
      grade: Number(grade),
      classNum: Number(classNum),
      studentName: studentName.trim(),
      bookTitle: bookTitle.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      summary: summary.trim(),
      thoughts: thoughts.trim(),
      rating: Number(rating),
      createdAt: formattedDate,
    };

    // Save locally
    onAddLog(newLog);

    // Attempt GAS POST send if URL configured
    let gasResultMsg = '';
    if (gasConfig.webAppUrl) {
      const gasSent = await sendLogToGAS(newLog, gasConfig.webAppUrl);
      if (gasSent) {
        gasResultMsg = ' & 구글 시트 전송 완료!';
      } else {
        gasResultMsg = ' (구글 시트는 오프라인 상태이나 내 기록에는 저장되었습니다.)';
      }
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setSubmitMessage(`🎉 독서 기록이 성공적으로 등록되었습니다!${gasResultMsg}`);

    // Reset book form fields (keep student profile)
    setBookTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setThoughts('');
    setRating(5);

    // Auto-scroll or view history option
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStudentOnly && studentName.trim()) {
      return matchesSearch && log.studentName.trim() === studentName.trim();
    }

    return matchesSearch;
  });

  const ratingDescriptions: Record<number, string> = {
    1: '★☆☆☆☆ 아쉬웠어요',
    2: '★★☆☆☆ 보통이에요',
    3: '★★★☆☆ 재미있었어요',
    4: '★★★★☆ 유익하고 훌륭해요',
    5: '★★★★★ 최고의 명작이에요!',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Subtab Switcher */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              오늘도 책 한 권으로 성장해요
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              학생 독서기록 공간 📖
            </h2>
            <p className="text-indigo-100/80 text-xs sm:text-sm mt-1 max-w-xl">
              읽은 책의 소중한 이야기와 내 생각을 자유롭게 작성하고 기록하세요.
            </p>
          </div>

          <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setSubTab('write')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                subTab === 'write'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              독서기록 작성
            </button>
            <button
              onClick={() => setSubTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                subTab === 'history'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              내 독서록 모아보기 ({logs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 text-emerald-900 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-950">{submitMessage}</div>
              <p className="text-xs text-emerald-700 mt-0.5">
                작성한 독서록은 '내 독서록 모아보기' 및 선생님 대시보드에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubTab('history')}
            className="shrink-0 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-emerald-700 transition"
          >
            기록 보러가기 →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WRITE TAB */}
      {/* ========================================================================= */}
      {subTab === 'write' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                새 독서 기록 작성하기
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                책을 읽고 느낀 점을 정성스럽게 작성해 주세요. (* 표시 항목은 필수)
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              실시간 자동 저장 지원
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Information Section */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  학생 정보
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>이 기기에 내 정보(학년/반/이름) 기억하기</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    학년 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>
                        초등학교 {g}학년
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    반 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={classNum}
                    onChange={(e) => setClassNum(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <option key={c} value={c}>
                        {c}반
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="예: 김민준"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Book Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  도서명 (책 제목) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="예: 마당을 나온 암탉"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  지은이 (저자)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 황선미"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  출판사
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="예: 사계절"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/60">
              <label className="block text-xs font-bold text-amber-900 mb-2">
                간단한 책 평가 (별점) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="p-1 hover:scale-125 transition-transform text-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-amber-800 ml-2">
                  {ratingDescriptions[rating]}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  줄거리 정리 <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {summary.length} 자
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="책의 핵심 줄거리나 인상 깊었던 장면을 적어보세요."
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition leading-relaxed resize-y"
              />
            </div>

            {/* Thoughts */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  느낀 점 및 느낀 소감 (깨달음)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {thoughts.length} 자
                </span>
              </div>
              <textarea
                rows={4}
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="책을 읽고 새롭게 깨달은 점, 나의 생각이나 다짐을 자유롭게 적어주세요."
                className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl p-4 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition leading-relaxed resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>전송 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>독서기록 저장하기</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HISTORY TAB */}
      {/* ========================================================================= */}
      {subTab === 'history' && (
        <div className="space-y-6">
          
          {/* Search & Filter Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서명, 이름, 저자로 검색..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {studentName && (
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <input
                    type="checkbox"
                    checked={filterStudentOnly}
                    onChange={(e) => setFilterStudentOnly(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>'<strong>{studentName}</strong>' 학생 기록만 보기</span>
                </label>
              )}

              {/* View toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="카드 그리드 보기"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="리스트 보기"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Log List/Grid Container */}
          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">조회 가능한 독서 기록이 없습니다</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                검색어를 변경하거나 '독서기록 작성' 탭에서 새 독서록을 등록해 보세요.
              </p>
              <button
                onClick={() => setSubTab('write')}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
              >
                + 독서기록 작성하러 가기
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative Left Spine Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-600 group-hover:w-2 transition-all" />

                  <div className="pl-2 space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {log.grade}학년 {log.classNum}반 {log.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400">{log.createdAt.split(' ')[0]}</span>
                    </div>

                    {/* Title & Author */}
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                        {log.bookTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        지은이: {log.author || '미상'} {log.publisher ? `| ${log.publisher}` : ''}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= log.rating ? 'fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-bold text-slate-600 ml-1">
                        {log.rating}.0
                      </span>
                    </div>

                    {/* Summary excerpt */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      "{log.summary}"
                    </p>

                    {/* Praise sticker badge if exists */}
                    {log.badge && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {log.badge}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pl-2 pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> 상세보기
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('이 독서 기록을 삭제하시겠습니까?')) {
                          onDeleteLog(log.id);
                        }
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => onSelectLog(log)}
                    className="p-4 sm:p-5 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-extrabold text-sm">
                        {log.rating}★
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {log.grade}-{log.classNum} {log.studentName}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 hover:text-indigo-600">
                            {log.bookTitle}
                          </h4>
                          <span className="text-xs text-slate-400">({log.author || '저자미상'})</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                          {log.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end text-xs text-slate-400">
                      <span>{log.createdAt.split(' ')[0]}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('이 독서 기록을 삭제하시겠습니까?')) {
                            onDeleteLog(log.id);
                          }
                        }}
                        className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
