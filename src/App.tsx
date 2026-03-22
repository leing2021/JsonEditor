import { useState } from 'react';
import VanillaJSONEditor from './components/VanillaJSONEditor';
import { FileJson, Search, Loader2, ChevronRight, ChevronLeft, ArrowRightLeft, CheckCircle2, Columns } from 'lucide-react';

export default function App() {
  const [leftContent, setLeftContent] = useState<any>({
    json: {
      greeting: '你好，世界！',
      description: '这是一个基于 svelte-jsoneditor 的 React 封装。',
      features: [
        '支持树状视图、文本视图和表格视图',
        '极简 Shadcn UI 风格设计',
        '保留了原版所有的强大功能（排序、过滤、撤销等）',
        '按需展开的双栏对比编辑',
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
  
  // 控制右侧对比框是否显示
  const [showCompare, setShowCompare] = useState(false);

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
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-gray-200 flex flex-col">
      {/* Header - Shadcn Style Horizontal Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-3 w-1/4">
          <div className="bg-gray-100 p-1.5 rounded-md border border-gray-200 shadow-sm">
            <FileJson className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </div>
          <h1 className="text-sm md:text-base font-semibold tracking-tight text-gray-900 hidden sm:block">
            JSON Editor
          </h1>
        </div>

        {/* URL Input */}
        <form onSubmit={handleFetchUrl} className="flex-1 max-w-lg mx-4 relative flex justify-center">
          <div className="relative flex items-center w-full h-9 rounded-md bg-gray-50 border border-gray-200 overflow-hidden focus-within:ring-1 focus-within:ring-gray-400 focus-within:border-gray-400 transition-all shadow-sm">
            <div className="pl-3 pr-2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入 URL 获取 JSON 数据..."
              className="flex-1 h-full bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="h-full px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent border-l border-gray-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '获取'}
            </button>
          </div>
          {error && (
            <div className="absolute top-full left-0 w-full mt-1 text-xs text-red-500 bg-red-50 py-1.5 px-3 rounded-md border border-red-100 z-10 shadow-sm">
              {error}
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 border h-9 px-3 md:px-4 ${
              showCompare 
                ? 'bg-gray-100 text-gray-900 border-gray-200 shadow-inner' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden md:inline">{showCompare ? '关闭对比' : '对比模式'}</span>
          </button>
        </div>
      </header>

      {/* Main Content - Breathing Room & Centered */}
      <main className={`flex-1 w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-500 ease-in-out ${showCompare ? 'max-w-7xl' : 'max-w-4xl'}`}>
        
        {/* Mobile Tabs (Only visible when compare is active) */}
        {showCompare && (
          <div className="md:hidden flex bg-gray-100 p-1 rounded-lg shrink-0 order-1">
            <button 
              onClick={() => setMobileTab('left')} 
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${mobileTab === 'left' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              左侧数据
            </button>
            <button 
              onClick={() => setMobileTab('right')} 
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${mobileTab === 'right' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              右侧数据
            </button>
          </div>
        )}

        {/* Left Editor */}
        <div className={`order-3 md:order-1 flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] ${(!showCompare || mobileTab === 'left') ? 'flex' : 'hidden md:flex'}`}>
          <VanillaJSONEditor
            content={leftContent}
            onChange={setLeftContent}
          />
        </div>

        {/* Middle Actions (Only visible when compare is active) */}
        {showCompare && (
          <div className="order-2 flex md:flex-col justify-center items-center gap-2 md:gap-3 py-2 md:py-0 shrink-0">
            <button
              onClick={copyToRight}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-500 transition-all"
              title="复制到右侧"
            >
              <ChevronRight className="w-4 h-4 hidden md:block" />
              <ChevronRight className="w-4 h-4 block md:hidden" />
            </button>
            
            <button
              onClick={copyToLeft}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-500 transition-all"
              title="复制到左侧"
            >
              <ChevronLeft className="w-4 h-4 hidden md:block" />
              <ChevronLeft className="w-4 h-4 block md:hidden" />
            </button>

            <div className="w-px h-4 bg-gray-200 md:w-6 md:h-px my-1"></div>

            <div className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-md shadow-sm border ${isEqual ? 'bg-green-50 border-green-200 text-green-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`} title={isEqual ? '内容一致' : '内容不同'}>
              {isEqual ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
          </div>
        )}

        {/* Right Editor (Only visible when compare is active) */}
        {showCompare && (
          <div className={`order-4 md:order-3 flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] ${mobileTab === 'right' ? 'flex' : 'hidden md:flex'}`}>
            <VanillaJSONEditor
              content={rightContent}
              onChange={setRightContent}
            />
          </div>
        )}

      </main>
    </div>
  );
}
