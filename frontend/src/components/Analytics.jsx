import { useState } from 'react';
import { BarChart3, AlertCircle, Loader2, Link2, MousePointerClick, ArrowUpRight } from 'lucide-react';
import { getAnalytics } from '../api';

export default function Analytics() {
  const [shortCode, setShortCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setData(null);

    const cleanCode = shortCode.trim().split('/').pop();

    if (!cleanCode) {
      setError('Please enter a valid short code or URL');
      return;
    }

    setIsLoading(true);

    try {
      const analyticsData = await getAnalytics(cleanCode);
      setData(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100/50 dark:border-gray-800/50 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-4 shadow-inner dark:shadow-none transition-colors duration-300">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2 transition-colors duration-300">
            Track Analytics
          </h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Enter your short code to view real-time clicks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="shortCode" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors duration-300">
              Short Link or Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="shortCode"
                type="text"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="e.g. alias123 or https://shorty.ujjawalcodes.site/alias123"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
            className="w-full relative flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl text-white font-semibold text-lg bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              'View Analytics'
            )}
          </button>
        </form>

        {data && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-5 flex flex-col justify-center items-center text-center transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center mb-3">
                  <MousePointerClick className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Clicks</h4>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {data.clicks}
                </p>
              </div>
              
              <div className="bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 flex flex-col justify-center transition-colors">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Destination</h4>
                <a 
                  href={data.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="break-all line-clamp-3">{data.original_url}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Advanced Demographics */}
            {data.clicks > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800/50">
                
                {/* Devices */}
                {data.devices && Object.keys(data.devices).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Devices</h4>
                    <div className="space-y-3">
                      {Object.entries(data.devices).sort((a,b)=>b[1]-a[1]).map(([name, count]) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{Math.round((count/data.clicks)*100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(count/data.clicks)*100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Browsers */}
                {data.browsers && Object.keys(data.browsers).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Browsers</h4>
                    <div className="space-y-3">
                      {Object.entries(data.browsers).sort((a,b)=>b[1]-a[1]).map(([name, count]) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{Math.round((count/data.clicks)*100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(count/data.clicks)*100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* OS */}
                {data.os && Object.keys(data.os).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Operating Systems</h4>
                    <div className="space-y-3">
                      {Object.entries(data.os).sort((a,b)=>b[1]-a[1]).map(([name, count]) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{Math.round((count/data.clicks)*100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(count/data.clicks)*100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countries */}
                {data.countries && Object.keys(data.countries).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Countries</h4>
                    <div className="space-y-3">
                      {Object.entries(data.countries).sort((a,b)=>b[1]-a[1]).map(([name, count]) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{Math.round((count/data.clicks)*100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: `${(count/data.clicks)*100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
