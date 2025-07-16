import React, { useEffect, useState } from 'react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const VideoModal = ({ isOpen, onClose, video }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch only views and duration from YouTube API
  useEffect(() => {
    if (!isOpen || !video || !video.videoId || !YOUTUBE_API_KEY) {
      setVideoData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${video.videoId}&key=${YOUTUBE_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setVideoData(data.items[0]);
        } else {
          setVideoData(null);
          setError('Video data not found.');
        }
      })
      .catch(() => setError('Failed to fetch video data.'))
      .finally(() => setLoading(false));
  }, [isOpen, video]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Player */}

        <div className="relative w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            {video.title}
          </h2>
          {loading ? (
            <div className="text-gray-400 mb-4">Loading video data...</div>
          ) : error ? (
            <div className="text-red-400 mb-4">{error}</div>
          ) : videoData ? (
            <div className="flex items-center gap-4 text-gray-400 mb-4">
              <span>{parseInt(videoData.statistics.viewCount).toLocaleString()} vues</span>
              <span>•</span>
              <span>{formatDuration(videoData.contentDetails.duration)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-gray-400 mb-4">
              <span>{video.views} vues</span>
              <span>•</span>
              <span>{video.duration}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 
