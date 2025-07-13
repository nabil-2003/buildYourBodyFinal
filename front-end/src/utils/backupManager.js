// Backup Manager for YouTube Videos
// This utility helps manage and save YouTube API responses to backup data

export const backupManager = {
  // Get current backup data
  getCurrentBackup() {
    try {
      return JSON.parse(localStorage.getItem('youtubeBackupVideos') || '{"videos": []}');
    } catch (error) {
      console.warn('Failed to get backup from localStorage:', error);
      return { videos: [] };
    }
  },

  // Save new videos to backup
  saveToBackup(newVideos) {
    try {
      const currentBackup = this.getCurrentBackup();
      const existingVideoIds = new Set(currentBackup.videos.map(v => v.videoId));
      
      // Filter out duplicates
      const uniqueNewVideos = newVideos.filter(video => !existingVideoIds.has(video.videoId));
      
      if (uniqueNewVideos.length > 0) {
        const updatedBackup = {
          videos: [...currentBackup.videos, ...uniqueNewVideos],
          lastUpdated: new Date().toISOString(),
          totalVideos: currentBackup.videos.length + uniqueNewVideos.length
        };
        
        // Save to localStorage
        localStorage.setItem('youtubeBackupVideos', JSON.stringify(updatedBackup));
        
        return {
          success: true,
          newVideosCount: uniqueNewVideos.length,
          totalVideos: updatedBackup.totalVideos
        };
      }
      
      return {
        success: true,
        newVideosCount: 0,
        totalVideos: currentBackup.videos.length
      };
    } catch (error) {
      console.error('Failed to save to backup:', error);
      return { success: false, error: error.message };
    }
  },

  // Update backup with new videos (replaces existing backup)
  updateBackup(newVideos) {
    try {
      // Limit to 200 videos
      const limitedVideos = newVideos.slice(0, 200);
      
      const updatedBackup = {
        videos: limitedVideos,
        lastUpdated: new Date().toISOString(),
        totalVideos: limitedVideos.length
      };
      
      // Save to localStorage
      localStorage.setItem('youtubeBackupVideos', JSON.stringify(updatedBackup));
      
      return {
        success: true,
        totalVideos: limitedVideos.length
      };
    } catch (error) {
      console.error('Failed to update backup:', error);
      return { success: false, error: error.message };
    }
  },

  // Get backup statistics
  getBackupStats() {
    const backup = this.getCurrentBackup();
    return {
      totalVideos: backup.videos.length,
      lastUpdated: backup.lastUpdated,
      categories: this.getCategoryStats(backup.videos)
    };
  },

  // Get category statistics
  getCategoryStats(videos) {
    const stats = {};
    videos.forEach(video => {
      const category = video.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  },

  // Export backup data for manual saving
  exportBackupData() {
    const backup = this.getCurrentBackup();
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `youtube-backup-videos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  // Clear backup data
  clearBackup() {
    localStorage.removeItem('youtubeBackupVideos');

  }
}; 