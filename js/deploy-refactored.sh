#!/bin/bash

# Deployment script for refactored code
# This script backs up the original and replaces with refactored version

echo "🚀 Starting deployment of refactored code..."

# Backup original file
if [ -f "bustling-world-v2.js" ]; then
    echo "📦 Backing up original bustling-world-v2.js..."
    cp bustling-world-v2.js bustling-world-v2-original.js
    echo "✅ Backup created: bustling-world-v2-original.js"
fi

# Replace with refactored version
if [ -f "bustling-world-v2-refactored.js" ]; then
    echo "🔄 Replacing with refactored version..."
    cp bustling-world-v2-refactored.js bustling-world-v2.js
    echo "✅ Refactored version deployed"
else
    echo "❌ Error: bustling-world-v2-refactored.js not found"
    exit 1
fi

echo "✨ Deployment complete!"
echo ""
echo "To revert if needed, run:"
echo "  cp bustling-world-v2-original.js bustling-world-v2.js"