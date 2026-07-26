import React, { useState } from 'react';
import { GASConfig } from '../types';
import { GAS_CODE_TEMPLATE } from '../utils/gasScript';
import { testGASConnection } from '../utils/storage';
import { 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  Link2, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  FileSpreadsheet, 
  HelpCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface GASSettingsViewProps {
  gasConfig: GASConfig;
  onSaveGASConfig: (config: GASConfig) => void;
  onSyncFromGAS?: () => void;
}

export const GASSettingsView: React.FC<GASSettingsViewProps> = ({
  gasConfig,
  onSaveGASConfig,
  onSyncFromGAS,
}) => {
  const [webAppUrl, setWebAppUrl] = useState<string>(gasConfig.webAppUrl || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const trimmedUrl = webAppUrl.trim();
    const result = await testGASConnection(trimmedUrl);

    setIsTesting(false);
    setTestResult(result);

    // Save configuration
    onSaveGASConfig({
      webAppUrl: trimmedUrl,
      lastTestedAt: new Date().toLocaleString('ko-KR'),
      isConnected: result.success,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
          <Settings className="w-3.5 h-3.5 text-indigo-400" />
          구글 앱스 스크립트(GAS) 자동 연동
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          구글 스프레드시트 연동 설정 ⚙️
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
          학생들이 작성한 독서 기록이 선생님의 구글 시트(Google Sheet)에 행(Row)으로 자동 저장되도록 간편 연동을 지원합니다.
        </p>
      </div>

      {/* Step 1 & 2 Tutorial & Code Copy Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg mb-2">
            STEP 1
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            구글 시트 연동 코드 (Code.gs) 복사하기
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            아래 스크립트 코드를 복사하여 구글 시트의 [확장 프로그램] → [Apps Script] 창에 그대로 붙여넣으세요.
          </p>
        </div>

        {/* Code Container with Copy Button */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
          {/* Code Bar Header */}
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Code.gs</span>
            </div>
            
            <button
              onClick={handleCopyCode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sans font-bold text-xs transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>코드 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code.gs 코드 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Code Display */}
          <div className="p-4 max-h-80 overflow-y-auto text-slate-300 leading-relaxed space-y-1">
            <pre className="whitespace-pre-wrap">{GAS_CODE_TEMPLATE}</pre>
          </div>
        </div>
      </div>

      {/* Step 2: Deployment Guide */}
      <div className="bg-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-indigo-100 space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-lg">
          STEP 2
        </div>
        <h3 className="text-base font-extrabold text-indigo-950">
          구글 앱스 스크립트 배포 가이드 (4단계)
        </h3>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-900 font-medium">
          <li className="bg-white p-3.5 rounded-2xl border border-indigo-100/80 shadow-xs flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
            <span>구글 시트를 열고 상단 메뉴 <strong>[확장 프로그램] → [Apps Script]</strong>를 클릭합니다.</span>
          </li>
          <li className="bg-white p-3.5 rounded-2xl border border-indigo-100/80 shadow-xs flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
            <span>기존 코드를 지우고 위에서 복사한 <strong>Code.gs</strong> 전체 코드를 붙여넣고 저장(Ctrl+S)합니다.</span>
          </li>
          <li className="bg-white p-3.5 rounded-2xl border border-indigo-100/80 shadow-xs flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
            <span>우측 상단 <strong>[배포] → [새 배포]</strong>를 누르고 유형을 <strong>'웹 앱'</strong>으로 선택합니다.</span>
          </li>
          <li className="bg-white p-3.5 rounded-2xl border border-indigo-100/80 shadow-xs flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
            <span>액세스 권한을 <strong>'모든 사용자 (Anyone)'</strong>로 설정 후 배포하여 발급된 <strong>웹 앱 URL</strong>을 복사합니다.</span>
          </li>
        </ol>
      </div>

      {/* Step 3: Input URL & Connection Test Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg mb-2">
              STEP 3
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-600" />
              웹 앱 URL(Web App URL) 등록 및 테스트
            </h3>
          </div>

          {gasConfig.isConnected && (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              구글 시트 연동 활성화 상태
            </span>
          )}
        </div>

        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              구글 앱스 스크립트 웹 앱 URL (Web App URL)
            </label>
            <input
              type="url"
              required
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isTesting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-sm transition disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>연동 상태 확인 중...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>URL 저장 및 연동 테스트</span>
                </>
              )}
            </button>

            {onSyncFromGAS && gasConfig.webAppUrl && (
              <button
                type="button"
                onClick={onSyncFromGAS}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>시트 데이터 불러오기</span>
              </button>
            )}
          </div>
        </form>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium border flex items-start gap-3 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-extrabold text-sm mb-0.5">
                {testResult.success ? '연동 테스트 성공' : '연동 테스트 안내'}
              </div>
              <p className="leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
