import { db } from './firebase';
import {
     doc,
     setDoc,
     getDoc,
     updateDoc,
     increment,
     arrayUnion,
     serverTimestamp,
     Timestamp
} from 'firebase/firestore';

export interface UserAnalytics {
     userId: string;
     name: string;
     totalReactions: number;
     favoriteEmoji: string;
     firstUsed: Timestamp;
     lastUsed: Timestamp;
     reactionHistory: ReactionRecord[];
     emojiStats: Record<string, number>;
}

export interface ReactionRecord {
     emoji: string;
     timestamp: Timestamp;
     sessionId?: string;
}

export class AnalyticsService {
     // Generate unique user ID based on name and first use
     static generateUserId(userName: string): string {
          return `user_${userName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
     }

     // Get or create user analytics
     static async getUserAnalytics(userName: string): Promise<UserAnalytics | null> {
          try {
               // Check if user exists in localStorage first
               const existingUserId = localStorage.getItem('overlayUserId');

               if (existingUserId) {
                    const userRef = doc(db, 'reactions_analytics', 'users', 'data', existingUserId);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                         return userSnap.data() as UserAnalytics;
                    }
               }

               // Create new user if not exists
               const newUserId = this.generateUserId(userName);
               const newUser: UserAnalytics = {
                    userId: newUserId,
                    name: userName,
                    totalReactions: 0,
                    favoriteEmoji: '',
                    firstUsed: serverTimestamp() as Timestamp,
                    lastUsed: serverTimestamp() as Timestamp,
                    reactionHistory: [],
                    emojiStats: {}
               };

               const userRef = doc(db, 'reactions_analytics', 'users', 'data', newUserId);
               await setDoc(userRef, newUser);

               // Store user ID in localStorage
               localStorage.setItem('overlayUserId', newUserId);

               return newUser;
          } catch (error) {
               console.error('Error getting user analytics:', error);
               return null;
          }
     }

     // Track reaction
     static async trackReaction(userName: string, emoji: string): Promise<void> {
          try {
               const userId = localStorage.getItem('overlayUserId');
               if (!userId) return;

               const userRef = doc(db, 'reactions_analytics', 'users', 'data', userId);
               const reactionRecord: ReactionRecord = {
                    emoji,
                    timestamp: new Date() as unknown as Timestamp // Use regular Date instead of serverTimestamp for arrayUnion
               };

               // Update user analytics
               await updateDoc(userRef, {
                    totalReactions: increment(1),
                    lastUsed: serverTimestamp(),
                    reactionHistory: arrayUnion(reactionRecord),
                    [`emojiStats.${emoji}`]: increment(1)
               });

               // Update global stats
               const globalRef = doc(db, 'reactions_analytics', 'global_stats');
               await updateDoc(globalRef, {
                    totalReactions: increment(1),
                    [`popularEmojis.${emoji}`]: increment(1),
                    lastUpdated: serverTimestamp()
               }).catch(async () => {
                    // Create global stats if doesn't exist
                    await setDoc(globalRef, {
                         totalUsers: 1,
                         totalReactions: 1,
                         popularEmojis: { [emoji]: 1 },
                         lastUpdated: serverTimestamp()
                    });
               });

          } catch (error) {
               console.error('Error tracking reaction:', error);
          }
     }
}
