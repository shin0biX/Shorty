import { useState } from 'react';
import { Link, Copy, Check, AlertCircle, Loader2, Link2, Lock } from 'lucide-react';
import { shortenUrl } from '../api';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shortUrl, setShortUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setIsCopied(false);

    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url); // Basic validation
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);

    try {
      const data = await shortenUrl(url, alias, password);
      setShortUrl(data.short_url);
      setUrl('');
      setAlias('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100/50 dark:border-gray-800/50 relative overflow-hidden transition-colors duration-300">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500"></div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-4 shadow-inner dark:shadow-none transition-colors duration-300">
            <Link className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2 transition-colors duration-300">
            Shorten Your Link
          </h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Create clean, memorable links in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors duration-300">
              Destination URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="alias" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors duration-300">
              Custom Alias <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 dark:text-gray-500 font-medium select-none">
                /
              </span>
              <input
                id="alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-custom-name"
                className="block w-full pl-8 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors duration-300">
              Password Protect <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for public link"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl text-white font-semibold text-lg bg-gray-900 dark:bg-purple-600 hover:bg-gray-800 dark:hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-purple-600 dark:focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">Your short link is ready</h3>
            <div className="flex items-center gap-3 p-2 pr-2.5 bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-2xl group transition-all hover:bg-purple-50/80 dark:hover:bg-purple-900/40">
              <div className="flex-1 min-w-0 pl-3">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-medium truncate block hover:text-purple-700 transition-colors"
                >
                  {shortUrl}
                </a>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isCopied
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-transparent'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200/60 dark:border-gray-700'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
