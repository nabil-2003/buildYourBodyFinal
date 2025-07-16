import React, { useState, useEffect, useCallback } from 'react';
// import anime from 'animejs';
import Header from '../components/Header';
import VideoModal from '../components/VideoModal';
import backupVideos from '../data/backupVideos.json';
import { backupManager } from '../utils/backupManager';

// YouTube API configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const MAX_BACKUP_VIDEOS = 200;

// Fitness search terms for different categories
const FITNESS_SEARCH_TERMS = {
  strength: ['strength training', 'weight lifting', 'muscle building'],
  cardio: ['cardio workout', 'hiit training', 'aerobic exercise'],
  flexibility: ['yoga workout', 'stretching routine', 'flexibility training'],
  nutrition: ['fitness nutrition', 'workout diet', 'healthy eating'],
  beginner: ['beginner workout', 'easy fitness', 'basic exercise'],
  advanced: ['advanced workout', 'intense training', 'hard fitness']
};

const TrainingVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Videos', icon: '🎯' },
    { id: 'strength', name: 'Strength Training', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '❤️' },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'advanced', name: 'Advanced', icon: '🔥' }
  ];

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let videoList = [];
      
      // Try YouTube API first
      if (YOUTUBE_API_KEY) {
        try {
          // Search for fitness videos across YouTube
          const searchTerm = selectedCategory === 'all' 
            ? 'fitness workout training' 
            : FITNESS_SEARCH_TERMS[selectedCategory]?.[0] || 'fitness workout training';
            
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&maxResults=50&order=relevance&type=video&videoDuration=medium&key=${YOUTUBE_API_KEY}`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
              // Fetch video details for all videoIds
              const videoIds = data.items.map(item => item.id.videoId).join(",");
              let detailsMap = {};
              if (YOUTUBE_API_KEY && videoIds) {
                try {
                  const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
                  const detailsData = await detailsRes.json();
                  if (detailsData.items) {
                    detailsMap = Object.fromEntries(detailsData.items.map(item => [item.id, item]));
                  }
                } catch {}
              }
              // Helper to format ISO 8601 duration (e.g. PT10M30S)
              function formatDuration(isoDuration) {
                if (!isoDuration) return '';
                const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (!match) return '';
                const [, h, m, s] = match.map(x => x ? parseInt(x) : 0);
                return [h, m, s]
                  .map((v, i) => (i === 0 && v === 0 ? null : v.toString().padStart(2, '0')))
                  .filter(Boolean)
                  .join(':');
              }
              // Transform YouTube data to our format with real stats
              const transformedVideos = data.items.map((item) => {
                const details = detailsMap[item.id.videoId];
                return {
                  id: item.id.videoId,
                  videoId: item.id.videoId,
                  title: item.snippet.title,
                  description: item.snippet.description,
                  thumbnail: item.snippet.thumbnails.high.url,
                  duration: details ? formatDuration(details.contentDetails.duration) : '10:00',
                  views: details ? parseInt(details.statistics.viewCount) : (Math.floor(Math.random() * 100000) + 1000),
                  publishedAt: details ? details.snippet.publishedAt : null,
                  category: getCategoryFromTitle(item.snippet.title),
                  videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
                };
              });
              // Limit to 200 videos and save to backup
              const limitedVideos = transformedVideos.slice(0, MAX_BACKUP_VIDEOS);
              backupManager.updateBackup(limitedVideos);
              videoList = limitedVideos;
            }
          }
        } catch (apiError) {
          // API failed, fallback to backup
        }
      }
      
      // If no videos from API, use backup
      if (videoList.length === 0) {
        const backupData = backupManager.getCurrentBackup();
        videoList = backupData.videos.length > 0 ? backupData.videos : backupVideos.videos;
      }
      
      // Filter by category
      const filteredVideos = selectedCategory === 'all' 
        ? videoList 
        : videoList.filter(video => video.category === selectedCategory);
      
      setVideos(filteredVideos);
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Helper function to categorize videos based on title
  const getCategoryFromTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('strength') || lowerTitle.includes('weight') || lowerTitle.includes('muscle')) {
      return 'strength';
    } else if (lowerTitle.includes('cardio') || lowerTitle.includes('hiit') || lowerTitle.includes('aerobic')) {
      return 'cardio';
    } else if (lowerTitle.includes('yoga') || lowerTitle.includes('stretch') || lowerTitle.includes('flexibility')) {
      return 'flexibility';
    } else if (lowerTitle.includes('nutrition') || lowerTitle.includes('diet') || lowerTitle.includes('meal')) {
      return 'nutrition';
    } else if (lowerTitle.includes('beginner') || lowerTitle.includes('easy') || lowerTitle.includes('basic')) {
      return 'beginner';
    } else if (lowerTitle.includes('advanced') || lowerTitle.includes('hard') || lowerTitle.includes('intense')) {
      return 'advanced';
    } else {
      return 'strength'; // Default category
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Animation effects
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.video-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    // Page title animation
    setTimeout(() => {
      document.querySelectorAll('.videos-hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.videos-hero-subtitle').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    // Category buttons animation
    setTimeout(() => {
      document.querySelectorAll('.category-btn').forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 500);

    // Scroll-triggered video cards animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('video-card')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe video cards for scroll animations
    document.querySelectorAll('.video-card').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [videos]); // Re-run when videos change

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="videos-hero-title text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Training Videos
            </h1>
            <p className="videos-hero-subtitle text-xl text-gray-300 max-w-2xl mx-auto">
              Access our comprehensive library of fitness training videos to enhance your workout routine
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            

          </div>

          {/* Videos Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-400 text-xl mb-4">{error}</div>
                <button
                  onClick={fetchVideos}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="video-card bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          {video.views?.toLocaleString()} vues
                        </span>
                        <span className="text-gray-400 text-sm">
                          {video.duration}
                        </span>
                        {video.publishedAt && (
                          <span className="text-gray-400 text-sm">
                            {new Date(video.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-orange-500 text-sm font-medium">
                          {categories.find(cat => cat.id === video.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {videos.length === 0 && !loading && !error && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-xl mb-4">No videos found for this category</div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                >
                  View All Videos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        video={selectedVideo}
      />
    </div>
  );
};

export default TrainingVideos; 
