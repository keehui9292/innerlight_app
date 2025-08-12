#!/bin/bash

# Innerlight Community App - Startup Script

echo "🚀 Starting Innerlight Community App..."
echo "================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Kill any existing processes on common ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true
lsof -ti:19000 | xargs kill -9 2>/dev/null || true
lsof -ti:19001 | xargs kill -9 2>/dev/null || true
lsof -ti:19002 | xargs kill -9 2>/dev/null || true

echo "🌟 Starting Expo development server..."
echo ""
echo "📱 Available commands:"
echo "  Press 'w' to open in web browser"
echo "  Press 'i' to open iOS simulator (requires Xcode)"
echo "  Press 'a' to open Android emulator (requires Android Studio)"
echo "  Press 'r' to reload"
echo "  Press 'q' to quit"
echo ""

# Start the development server
npx expo start