import React from 'react';
import { ReadingLog } from '../types';
import { X, BookOpen, Star, User, Calendar, Award, MessageCircle, Printer, Tag } from 'lucide-react';

interface LogDetailModalProps {
  log: ReadingLog | null;
  onClose: () => void;
  onAddBadge?: (logId: string, badge: string, comment: string) => void;
  isTeacher?: boolean;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({
  log,
  onClose,
  onAddBadge,
  isTeacher = false,
}) => {
  const [badgeText, setBadgeText] = React.useState('');
  const [teacherComment, setTeacherComment] = React.useState('');
  const [showTeacherForm, setShowTeacherForm] = React.useState(false);

  React.useEffect(() => {
    if (log) {
      setBadgeText(log.badge || '');
      setTeacherComment(log.teacherComment || '');
    }
  }, [log]);

  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTeacherFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddBadge && log) {
      onAddBadge(log.id, badgeText, teacherComment);
      setShowTeacherForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        id="reading-log-modal" 
        className="bg-white rounded-3xl shadow-xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium mb-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              {log.grade}학년 {log.classNum}반
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {log.studentName} 학생
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1 text-xs text-indigo-200">
              <Calendar className="w-3.5 h-3.5" />
              {log.createdAt}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            {log.bookTitle}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-indigo-100 text-sm">
            <span>지은이: <strong className="text-white">{log.author || '미상'}</strong></span>
            {log.publisher && (
              <>
                <span className="text-white/40">•</span>
                <span>출판사: <strong className="text-white">{log.publisher}</strong></span>
              </>
            )}
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-1 mt-4 bg-white/15 backdrop-blur-md inline-flex px-3.5 py-1.5 rounded-full">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= log.rating
                    ? 'text-amber-300 fill-amber-300'
                    : 'text-white/30'
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-bold text-white">
              {log.rating}.0 / 5.0
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Badge Display */}
          {log.badge && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl text-amber-900">
              <div className="bg-amber-100 text-amber-700 p-2 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">칭찬 스티커</div>
                <div className="font-bold text-amber-900 text-base">{log.badge}</div>
              </div>
            </div>
          )}

          {/* Summary Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              줄거리
            </h3>
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {log.summary || '작성된 줄거리가 없습니다.'}
            </div>
          </div>

          {/* Thoughts Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-violet-500" />
              느낀 점 및 소감
            </h3>
            <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-100/60 text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-wrap">
              {log.thoughts || '작성된 소감이 없습니다.'}
            </div>
          </div>

          {/* Teacher Comment */}
          {log.teacherComment && (
            <div className="bg-violet-50 border border-violet-100 p-4 sm:p-5 rounded-2xl">
              <div className="text-xs font-bold text-violet-600 mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                선생님 피드백 & 한마디
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{log.teacherComment}"
              </p>
            </div>
          )}

          {/* Teacher Editing Form inside modal */}
          {isTeacher && onAddBadge && (
            <div className="border-t border-slate-100 pt-5">
              {!showTeacherForm ? (
                <button
                  onClick={() => setShowTeacherForm(true)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  {log.badge || log.teacherComment ? '칭찬 칭호 / 피드백 수정하기' : '선생님 칭찬 스티커 및 피드백 남기기'}
                </button>
              ) : (
                <form onSubmit={handleSaveTeacherFeedback} className="bg-slate-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="text-xs font-bold text-indigo-900">선생님 칭찬 스티커 및 한마디 남기기</div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">칭찬 칭호 (예: 다독왕 🏆, 생각으뜸 💡)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {['다독왕 🏆', '생각으뜸 💡', '감성폭발 🎨', '꾸준함상 🌟', '최고의평론가 📖'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBadgeText(preset)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            badgeText === preset
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="직접 입력도 가능합니다"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">선생님 한마디 코멘트</label>
                    <textarea
                      value={teacherComment}
                      onChange={(e) => setTeacherComment(e.target.value)}
                      rows={2}
                      placeholder="학생의 성장과 진정성 있는 소감을 응원해 주세요."
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTeacherForm(false)}
                      className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="text-xs px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                      저장하기
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-6 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            인쇄 / PDF 저장
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white font-medium text-xs rounded-xl hover:bg-indigo-700 transition shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
