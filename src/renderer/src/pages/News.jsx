import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Search } from 'lucide-react';
import '../assets/main.css';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data.Data);
        setError(null);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
        <div className="text-[var(--text-color)] text-xl">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 bg-red-100 px-4 py-2 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 custom-scrollbar h-[94vh] overflow-auto">
      <div className="mx-auto pt-8">
        <div className="flex items-center justify-end mb-4">    
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--secondary-bg-color)] text-[var(--text-color)]" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--secondary-bg-color)] border-[var(--border-color)] rounded-lg placeholder-[var(--text-color)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-6 custom-scrollbar gap-8">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className=" rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow opacity-70"
            >
              <img
                src={article.imageurl}
                alt={article.title}
                className="w-full h-20 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800';
                }}
              />
              
              <div className="p-6 h-40">
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src={article.source_info.img}
                    alt={article.source_info.name}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=50';
                    }}
                  />
                  <span className="text-sm text-[var(--text-color)]">
                    {article.source_info.name}
                  </span>
                  <span className="text-sm text-[var(--text-color)]">•</span>
                  <span className="text-sm text-[var(--text-color)]">
                    {new Date(article.published_on * 1000).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className="text-md font-bold text-[var(--text-color)] mb-3">
                  {article.title}
                </h2>
                
                <p className="text-[var(--text-color)] mb-4 line-clamp-3">
                  {article.body}
                </p>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--text-color)]"
                >
                  Read more
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
export default News;