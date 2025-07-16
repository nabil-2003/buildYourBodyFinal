// ... نفس الاستيرادات بدون تغيير
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import VideoModal from '../components/VideoModal';
import backupVideos from '../data/backupVideos.json';
import { backupManager } from '../utils/backupManager';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const MAX_BACKUP_VIDEOS = 200;

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
      return 'strength';
    }
  };

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let videoList = [];

      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing.");
        throw new Error("API key is not defined.");
      }

      const searchTerm = selectedCategory === 'all'
        ? 'fitness workout training'
        : FITNESS_SEARCH_TERMS[selectedCategory]?.[0] || 'fitness workout training';

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&maxResults=50&order=relevance&type=video&videoDuration=medium&key=${YOUTUBE_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("YouTube API Error Response:", errorText);
        throw new Error("YouTube API request failed.");
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const transformedVideos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          duration: '10:00',
          views: Math.floor(Math.random() * 100000) + 1000,
          category: getCategoryFromTitle(item.snippet.title),
          videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        const limitedVideos = transformedVideos.slice(0, MAX_BACKUP_VIDEOS);
        backupManager.updateBackup(limitedVideos);
        videoList = limitedVideos;
      }

      if (videoList.length === 0) {
        const backupData = backupManager.getCurrentBackup();
        videoList = backupData.videos.length > 0 ? backupData.videos : backupVideos.videos;
      }

      const filteredVideos = selectedCategory === 'all'
        ? videoList
        : videoList.filter(video => video.category === selectedCategory);

      setVideos(filteredVideos);
    } catch (err) {
      console.error("Fetch Videos Error:", err);
      setError("An error occurred while fetching videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // الباقي من الكود (العرض، الأنيميشن، وواجهة المستخدم) يبقى كما هو بدون تغيير

  return (
    // ... نفس JSX كما في كودك السابق
    // مكون <Header />, category buttons, video grid, VideoModal, إلخ.
    // لا حاجة لتكراره كاملاً إذا لم تكن هناك تغييرات عليه.
    // استخدم نفس JSX واجعل فقط `fetchVideos` محدثاً بالتحسينات أعلاه.
  );
};

export default TrainingVideos;
