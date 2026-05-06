import { useState, useEffect } from 'react';
import UrlShortener from './components/UrlShortener';
import Analytics from './components/Analytics';
import Unlock from './components/Unlock';
import { Sun, Moon, Link2, BarChart3 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('shorten'); // 'shorten' | 'analytics'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 selection:bg-purple-200 dark:selection:bg-purple-900/50 selection:text-purple-900 dark:selection:text-purple-100 flex flex-col relative transition-colors duration-300">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-[120px]" />
      </div>

      <header className="relative z-10 w-full py-6 px-6 lg:px-8 flex justify-between items-center max-w-7xl mx-auto border-b border-gray-100/50 dark:border-gray-800/50 mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
            Shorty
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            aria-label="GitHub Repository"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white transition-colors duration-300">Short links,</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-indigo-400">
              big results.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
            A powerful URL shortener that helps you create short, recognizable links to share with your audience.
          </p>
        </div>

        {/* Tab Toggle - Only show if not on unlock page */}
        {!window.location.pathname.startsWith('/unlock/') && (
          <div className="mb-10 w-full max-w-xl mx-auto flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 inline-flex shadow-sm transition-colors duration-300">
              <button
                onClick={() => setActiveTab('shorten')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'shorten'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Shorten
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
        )}

        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both mb-12">
          {window.location.pathname.startsWith('/unlock/') ? (
            <Unlock shortCode={window.location.pathname.split('/')[2]} />
          ) : activeTab === 'shorten' ? (
            <UrlShortener />
          ) : (
            <Analytics />
          )}
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-gray-400 dark:text-gray-600 transition-colors duration-300 mt-auto">
        <p>© {new Date().getFullYear()} Shorty. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

