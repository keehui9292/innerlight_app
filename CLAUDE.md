# Conversation Summary

## Current Session
**Date**: 2025-10-23
**Branch**: main

## Recent Changes

### Focus-Aware Polling (Latest)
Implemented screen focus detection to stop API polling when users navigate away from screens.

#### Changes Made:

1. **ChatListScreen** (`src/screens/main/ChatListScreen.tsx:4,121-137`)
   - Added `useFocusEffect` from `@react-navigation/native`
   - Replaced `useEffect` with `useFocusEffect` for polling lifecycle
   - Polling starts when screen gains focus
   - Polling stops when screen loses focus
   - Added cleanup logs for debugging

2. **ChatDetailScreen** (`src/screens/main/ChatDetailScreen.tsx:4,55-71`)
   - Added `useFocusEffect` and `useCallback` imports
   - Replaced `useEffect` with `useFocusEffect` for polling lifecycle
   - Polling starts when screen gains focus
   - Polling stops when screen loses focus
   - Added cleanup logs for debugging

#### Benefits:
- **Reduced server load**: No API calls when screen not visible
- **Better battery life**: No background polling
- **Improved performance**: Fewer concurrent timers
- **Smart behavior**: Automatic start/stop based on navigation

### Chat Polling Optimization (Previous)
Implemented optimized polling mechanism to reduce server load and improve app performance.

#### Changes Made:

1. **useUnreadCount Hook** (`src/hooks/useUnreadCount.ts:4`)
   - Increased polling interval from 10s to 30s
   - Added comment noting optimization with 10s cache

2. **ChatDetailScreen** (`src/screens/main/ChatDetailScreen.tsx:54-81`)
   - Added `lastMessageIdRef` to track message state
   - Implemented `checkForNewMessages()` lightweight check (3s interval)
   - Only fetches full messages when new messages are detected
   - Prevents unnecessary full message fetches

3. **ChatListScreen** (`src/screens/main/ChatListScreen.tsx:32-60`)
   - Added optimized polling with `checkForUpdates()`
   - Implemented fallback mechanism if optimized endpoint unavailable
   - Added fetch deduplication (prevents concurrent fetches)
   - Rate limiting: max 1 fetch per 3s
   - Smart polling: only fetch when `has_updates` is true
   - Tracks `lastUpdateTimestamp` to prevent redundant fetches
   - Auto-disables optimized polling after 3 failed checks

4. **ApiService** (`src/services/apiService.ts:717-734`)
   - Added `checkChatUpdates()` - lightweight endpoint for chat list updates
   - Added `checkNewMessages(chatId)` - lightweight endpoint for message updates
   - Both endpoints return minimal data for efficient polling

### Benefits:
- **Reduced server load**: Lightweight checks instead of full data fetches
- **Better UX**: 3-5s polling for responsiveness
- **Graceful fallback**: Falls back to direct polling if optimized endpoints unavailable
- **Prevention of redundant fetches**: Deduplication and rate limiting

## Modified Files:
- `src/hooks/useUnreadCount.ts`
- `src/screens/main/ChatDetailScreen.tsx`
- `src/screens/main/ChatListScreen.tsx`
- `src/services/apiService.ts`

## Git Status:
All files modified but not yet committed.
