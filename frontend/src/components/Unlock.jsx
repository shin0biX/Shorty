import { useState } from 'react';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { unlockUrl } from '../api';

export default function Unlock({ shortCode }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);

    try {
      const data = await unlockUrl(shortCode, password);
      // Redirect to the original URL
      window.location.href = data.original_url;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100/50 dark:border-gray-800/50 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 mb-4 shadow-inner dark:shadow-none transition-colors duration-300">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2 transition-colors duration-300">
            Protected Link
          </h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            This link requires a password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors duration-300">
              Enter Password
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
                placeholder="••••••••"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                required
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
            className="w-full relative flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl text-white font-semibold text-lg bg-gray-900 dark:bg-red-600 hover:bg-gray-800 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-red-600 dark:focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Unlocking...
              </>
            ) : (
              'Unlock Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
