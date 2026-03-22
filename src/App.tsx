import { useState } from 'react';
import VanillaJSONEditor from './components/VanillaJSONEditor';
import { FileJson, Search, Loader2, ChevronRight, ChevronLeft, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [leftContent, setLeftContent] = useState<any>({
    json: {
      greeting: '你好，世界！',
      description: '这是一个基于 svelte-jsoneditor 的 React 封装。',
      features: [
        '支持树状视图、文本视图和表格视图',
        'Bundlephobia 风格的 UI 设计',
        '保留了原版所有的强大功能（排序、过滤、撤销等）',
        '双栏对比编辑',
        '完美适配移动端与桌面端'
      ],
      isAwesome: true
    }
  });

  const [rightContent, setRightContent] = useState<any>({
    text: '{\n  "placeholder": "在此处粘贴或编辑 JSON"\n}'
  });

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileTab, setMobileTab] = useState<'left' | 'right'>('left');

  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('网络请求失败');
      const data = await response.json();
      setLeftContent({ json: data });
      setUrl('');
      setMobileTab('left'); // Switch to left tab on mobile to show fetched data
    } catch (err: any) {
      setError(err.message || '无法解析 JSON 数据');
    } finally {
      setLoading(false);
    }
  };

  const copyToRight = () => {
    setRightContent(leftContent);
    setMobileTab('right'); // Switch to right tab on mobile to show copied data
  };
  
  const copyToLeft = () => {
    setLeftContent(rightContent);
    setMobileTab('left'); // Switch to left tab on mobile to show copied data
  };

  const checkEqual = () => {
    try {
      const getObj = (c: any) => {
        if (!c) return undefined;
        if ('json' in c) return c.json;
        if ('text' in c) return JSON.parse(c.text);
        return undefined;
      };
      const leftObj = getObj(leftContent);
      const rightObj = getObj(rightContent);
      return JSON.stringify(leftObj) === JSON.stringify(rightObj);
    } catch {
      return false;
    }
  };

  const isEqual = checkEqual();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-[#e0e0e0] flex flex-col">
      {/* Header */}
      <header className="pt-4 pb-4 md:pt-8 md:pb-6 px-4 md:px-6 text-center max-w-4xl mx-auto w-full shrink-0">
        <div className="flex justify-center mb-2 md:mb-4">
          <div className="bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-gray-100">
            <FileJson className="w-6 h-6 md:w-8 md:h-8 text-[#1a1a1a]" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 md:mb-3 text-[#1a1a1a]">
          JSON 编辑器
        </h1>
        <p className="text-sm md:text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed mb-4 md:mb-6 hidden md:block">
          完整保留原版功能，支持双栏对比与数据同步，完美适配全终端。
        </p>
        
        {/* URL Input */}
        <form onSubmit={handleFetchUrl} className="relative max-w-xl mx-auto">
          <div className="relative flex items-center w-full h-10 md:h-12 rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <div className="pl-3 md:pl-4 pr-2 md:pr-3 text-gray-400">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入 URL 获取 JSON 数据到左侧..."
              className="flex-1 h-full bg-transparent text-sm md:text-base outline-none placeholder:text-gray-400 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="h-full px-4 md:px-6 text-sm md:text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent border-l border-gray-100"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '获取'}
            </button>
          </div>
          {error && (
            <div className="absolute top-full left-0 w-full mt-1 md:mt-2 text-xs md:text-sm text-red-500 bg-red-50 py-1.5 md:py-2 px-3 md:px-4 rounded-lg border border-red-100 z-10">
              {error}
            </div>
          )}
        </form>
      </header>

      {/* Main Content - Dual Pane (Responsive) */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-2 sm:px-4 pb-4 md:pb-8 flex flex-col md:flex-row gap-2 md:gap-4 min-h-0">
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex bg-gray-200/50 p-1 rounded-xl shrink-0 order-1">
          <button 
            onClick={() => setMobileTab('left')} 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mobileTab === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            左侧数据
          </button>
          <button 
            onClick={() => setMobileTab('right')} 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mobileTab === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            右侧数据
          </button>
        </div>

        {/* Middle Actions */}
        <div className="order-2 flex md:flex-col justify-center items-center gap-2 md:gap-3 py-1 md:py-0 md:px-1 shrink-0">
          <button
            onClick={copyToRight}
            className="flex items-center gap-1 p-2 md:p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all group relative"
            title="复制到右侧"
          >
            <span className="text-xs font-medium md:hidden pl-1">左至右</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 hidden md:block" />
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 block md:hidden" />
          </button>
          
          <button
            onClick={copyToLeft}
            className="flex items-center gap-1 p-2 md:p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all group relative"
            title="复制到左侧"
          >
            <span className="text-xs font-medium md:hidden pl-1">右至左</span>
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 hidden md:block" />
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 block md:hidden" />
          </button>

          <div className="w-px h-6 bg-gray-200 md:w-6 md:h-px my-0.5 md:my-1"></div>

          <div className="flex md:flex-col items-center gap-1.5">
            <div className={`p-2 md:p-2.5 rounded-xl shadow-sm border ${isEqual ? 'bg-green-50 border-green-200 text-green-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`} title={isEqual ? '内容一致' : '内容不同'}>
              {isEqual ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
            <span className={`text-[10px] font-medium ${isEqual ? 'text-green-600' : 'text-amber-600'}`}>
              {isEqual ? '匹配' : '不匹配'}
            </span>
          </div>
        </div>

        {/* Left Editor */}
        <div className={`order-3 md:order-1 flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-220px)] ${mobileTab === 'left' ? 'flex' : 'hidden md:flex'}`}>
          <VanillaJSONEditor
            content={leftContent}
            onChange={setLeftContent}
          />
        </div>

        {/* Right Editor */}
        <div className={`order-4 md:order-3 flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-220px)] ${mobileTab === 'right' ? 'flex' : 'hidden md:flex'}`}>
          <VanillaJSONEditor
            content={rightContent}
            onChange={setRightContent}
          />
        </div>

      </main>
    </div>
  );
}
