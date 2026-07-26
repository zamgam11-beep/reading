import React, { useMemo } from 'react';
import { ReadingLog, StudentStats } from '../types';
import { 
  Crown, 
  Trophy, 
  Award, 
  Sparkles, 
  Target, 
  BookOpen, 
  Flame, 
  Star, 
  CheckCircle2, 
  Medal,
  Quote
} from 'lucide-react';

interface ReadingKingViewProps {
  logs: ReadingLog[];
  onSelectLog?: (log: ReadingLog) => void;
}

export const ReadingKingView: React.FC<ReadingKingViewProps> = ({ logs, onSelectLog }) => {

  // Calculate monthly stats by student
  const studentStats: StudentStats[] = useMemo(() => {
    const statsMap: Record<string, StudentStats> = {};

    logs.forEach((log) => {
      const key = `${log.grade}-${log.classNum}-${log.studentName}`;
      if (!statsMap[key]) {
        statsMap[key] = {
          studentName: log.studentName,
          grade: log.grade,
          classNum: log.classNum,
          count: 0,
          latestBook: log.bookTitle,
          avgRating: 0,
        };
      }
      statsMap[key].count += 1;
      statsMap[key].avgRating += log.rating;
    });

    return Object.values(statsMap)
      .map((stat) => ({
        ...stat,
        avgRating: Number((stat.avgRating / stat.count).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating);
  }, [logs]);

  const top1 = studentStats[0];
  const top2 = studentStats[1];
  const top3 = studentStats[2];

  // Target Goal Calculation (e.g. Goal 100 books)
  const MONTHLY_GOAL = 100;
  const currentTotal = logs.length;
  const goalPercentage = Math.min(Math.round((currentTotal / MONTHLY_GOAL) * 100), 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200 border border-white/10">
            <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
            우리 학급 이달의 명예의 전당
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            🏆 이달의 독서왕을 소개합니다!
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            꾸준히 책을 읽고 생각을 나누며 성장하는 우리 반 멋진 친구들의 독서 랭킹과 이달의 달성 목표입니다.
          </p>
        </div>
      </div>

      {/* Class Monthly Reading Goal Progress Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              학급 월간 독서 목표 달성률
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              우리 반 친구들이 힘을 합쳐 목표 {MONTHLY_GOAL}권 읽기에 도전하고 있어요!
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600">{currentTotal}</span>
            <span className="text-sm font-bold text-slate-400"> / {MONTHLY_GOAL} 권 ({goalPercentage}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden p-1 border border-slate-200/60 relative">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500 h-full rounded-full transition-all duration-1000 relative"
            style={{ width: `${goalPercentage}%` }}
          >
            <div className="absolute top-0 bottom-0 right-1 w-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Flame className="w-4 h-4 text-amber-500" />
            현재 목표 달성까지 <strong className="text-indigo-600">{Math.max(0, MONTHLY_GOAL - currentTotal)}권</strong> 남았습니다.
          </span>
          <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
            {goalPercentage >= 100 ? '🎉 목표 완벽 달성!' : '🔥 화이팅! 달성 진행 중'}
          </span>
        </div>
      </div>

      {/* Hall of Fame - Top 3 Podium Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          명예의 전당 Top 3 👑
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* 2nd Place */}
          {top2 ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition text-center space-y-4 relative overflow-hidden order-2 md:order-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 font-black text-xl flex items-center justify-center mx-auto shadow-inner">
                🥈 2위
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {top2.grade}학년 {top2.classNum}반
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">{top2.studentName}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  최근 읽은 책: <span className="font-semibold text-slate-700">{top2.latestBook}</span>
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-around">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">읽은 책</div>
                  <div className="text-lg font-black text-slate-800">{top2.count} 권</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">평균 별점</div>
                  <div className="text-lg font-black text-amber-500">★ {top2.avgRating}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-200 text-center text-slate-400 order-2 md:order-1">
              준비 중 (2위)
            </div>
          )}

          {/* 1st Place (Gold Center Podium) */}
          {top1 ? (
            <div className="bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl hover:shadow-2xl transition text-center space-y-4 relative overflow-hidden order-1 md:order-2 transform md:-translate-y-2">
              <div className="absolute top-2 right-3 text-amber-200/30">
                <Crown className="w-24 h-24" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-300 text-amber-950 font-black text-2xl flex items-center justify-center mx-auto shadow-lg border-2 border-white">
                👑 1위
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 bg-amber-200 px-3 py-1 rounded-full shadow-xs">
                  {top1.grade}학년 {top1.classNum}반 독서왕
                </span>
                <h4 className="text-2xl font-black text-white mt-2.5">{top1.studentName}</h4>
                <p className="text-xs text-amber-100 mt-1">
                  최근 읽은 책: <span className="font-bold text-white">{top1.latestBook}</span>
                </p>
              </div>
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-around">
                <div>
                  <div className="text-[11px] uppercase font-bold text-amber-200">총 읽은 책</div>
                  <div className="text-2xl font-black text-amber-300">{top1.count} 권</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <div className="text-[11px] uppercase font-bold text-amber-200">평균 별점</div>
                  <div className="text-2xl font-black text-amber-300">★ {top1.avgRating}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200 text-center text-slate-400 order-1 md:order-2">
              독서왕 도전자를 기다립니다!
            </div>
          )}

          {/* 3rd Place */}
          {top3 ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition text-center space-y-4 relative overflow-hidden order-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center mx-auto shadow-inner">
                🥉 3위
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {top3.grade}학년 {top3.classNum}반
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">{top3.studentName}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  최근 읽은 책: <span className="font-semibold text-slate-700">{top3.latestBook}</span>
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-around">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">읽은 책</div>
                  <div className="text-lg font-black text-slate-800">{top3.count} 권</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">평균 별점</div>
                  <div className="text-lg font-black text-amber-500">★ {top3.avgRating}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-200 text-center text-slate-400 order-3">
              준비 중 (3위)
            </div>
          )}

        </div>
      </div>

      {/* Complete Student Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              전체 학생 독서 활동 랭킹
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              독서 기록 수 기준 전체 참가 학생 누적 순위입니다.
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl">
            총 {studentStats.length}명 참여 중
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">순위</th>
                <th className="px-6 py-3.5">학년/반</th>
                <th className="px-6 py-3.5">학생 이름</th>
                <th className="px-6 py-3.5">독서 권수</th>
                <th className="px-6 py-3.5">평균 별점</th>
                <th className="px-6 py-3.5">최근 읽은 도서</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {studentStats.map((stat, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4 font-black">
                    {idx === 0 ? (
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-black text-xs">🥇 1위</span>
                    ) : idx === 1 ? (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-black text-xs">🥈 2위</span>
                    ) : idx === 2 ? (
                      <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg font-black text-xs">🥉 3위</span>
                    ) : (
                      <span className="text-slate-400 pl-2">{idx + 1}위</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {stat.grade}학년 {stat.classNum}반
                  </td>
                  <td className="px-6 py-4 font-extrabold text-indigo-900">
                    {stat.studentName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {stat.count} 권
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber-500 font-bold">
                    ★ {stat.avgRating}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {stat.latestBook}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Praise Badges & Quote Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Badges Explanation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            칭찬 스티커 뱃지 종류 안내
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <div className="font-extrabold text-amber-900">다독왕 🏆</div>
              <p className="text-amber-800/80 mt-1">책을 많이 읽고 풍부한 기량을 쌓은 학생</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
              <div className="font-extrabold text-indigo-900">생각으뜸 💡</div>
              <p className="text-indigo-800/80 mt-1">깊이 있는 질문과 통찰력 있는 소감</p>
            </div>
            <div className="bg-violet-50 p-3 rounded-2xl border border-violet-100">
              <div className="font-extrabold text-violet-900">감성폭발 🎨</div>
              <p className="text-violet-800/80 mt-1">책의 감동을 따뜻하게 글로 표현</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
              <div className="font-extrabold text-emerald-900">꾸준함상 🌟</div>
              <p className="text-emerald-800/80 mt-1">매일 일관되게 책 읽는 습관을 실천</p>
            </div>
          </div>
        </div>

        {/* Inspirational Reading Quote Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-md">
          <Quote className="w-16 h-16 text-white/10 absolute top-4 right-4" />
          <div className="space-y-3 relative z-10">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              오늘의 독서 명언
            </span>
            <blockquote className="text-base sm:text-lg font-serif italic text-indigo-100 leading-relaxed">
              "한 권의 책을 읽는 것은 한 사람의 소중한 삶과 새로운 세상을 만나는 아름다운 여행입니다."
            </blockquote>
          </div>
          <p className="text-xs text-indigo-300 font-medium mt-6 relative z-10">
            — 우리반 전자 독서기록장
          </p>
        </div>

      </div>

    </div>
  );
};
