'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalyticsService, UserAnalytics } from '../lib/analytics';

export const useAnalytics = (userName: string | null) => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

  const initializeUserAnalytics = useCallback(async () => {
    if (!userName || !isAnalyticsEnabled) return;

    try {
      const analytics = await AnalyticsService.getUserAnalytics(userName);
      setUserAnalytics(analytics);
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
      setIsAnalyticsEnabled(false);
    }
  }, [userName, isAnalyticsEnabled]);

  useEffect(() => {
    // Check if Firebase is configured
    const checkFirebaseConfig = () => {
      const hasConfig = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                       process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      setIsAnalyticsEnabled(!!hasConfig);
      return !!hasConfig;
    };

    if (userName && checkFirebaseConfig()) {
      initializeUserAnalytics();
    }
  }, [userName, initializeUserAnalytics]);

  const trackReaction = async (emoji: string) => {
    if (!userName || !isAnalyticsEnabled) return;

    try {
      await AnalyticsService.trackReaction(userName, emoji);
    } catch (error) {
      console.error('Failed to track reaction:', error);
    }
  };

  return {
    userAnalytics,
    isAnalyticsEnabled,
    trackReaction,
    initializeUserAnalytics
  };
};
