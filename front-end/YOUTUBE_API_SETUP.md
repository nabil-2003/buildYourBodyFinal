# YouTube API Setup Guide

## Getting Your YouTube API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project or Select Existing**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing one

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. **Restrict Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173/*` for development)
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"

## How It Works

The app searches for general fitness videos on YouTube based on the selected category:

- **All Videos**: "fitness workout"
- **Strength Training**: "strength training workout"
- **Cardio**: "cardio fitness workout"
- **Flexibility**: "yoga flexibility stretching"
- **Nutrition**: "fitness nutrition diet"
- **Beginner**: "beginner fitness workout"
- **Advanced**: "advanced fitness training"

No specific channel is required - it finds the best fitness videos from across YouTube!

## Environment Variables

Create a `.env` file in your `front-end` directory:

```env
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your_actual_api_key_here
```

## Features

- **Automatic Fallback**: If the API fails or credentials are missing, the app will use backup videos
- **Video Modal**: Click any video to open it in a modal with YouTube player
- **Category Filtering**: Videos are automatically categorized based on title keywords
- **Responsive Design**: Works on all devices

## Backup Videos

The app includes a backup JSON file (`src/data/backupVideos.json`) with 12 sample fitness videos that will be displayed if:
- YouTube API key is missing
- Channel ID is missing
- API request fails
- No videos are found

## Troubleshooting

1. **API Quota Exceeded**: YouTube API has daily limits. Check your quota in Google Cloud Console
2. **No Videos Found**: Check the console logs to see the API response and search queries
3. **CORS Issues**: Ensure your API key restrictions allow your domain
4. **Debug Mode**: Check browser console for detailed API response logs

## Security Notes

- Never commit your `.env` file to version control
- Use API key restrictions to limit usage
- Monitor your API usage in Google Cloud Console 