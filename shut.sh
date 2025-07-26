#!/bin/bash

# Script'in çalıştığı dizini al
BASEDIR=$(dirname "$(realpath "$0")")

echo "🚀 Stopping core and client processes..."

# Core ve client process PID'lerini bulup SIGINT at
pkill -f "python3 run.py"   # core backend
pkill -f "npm run dev"      # client frontend

sleep 2

echo "Gopying files to GIT..."

cd "$BASEDIR"

# Git add, commit ve push
DATE=$(date '+%Y-%m-%d_%H-%M-%S')
git add .
git commit -m "sistemdeki tarih_saat: $DATE"
git push -u origin main

echo -e "\033[1;31m👹 I AM KILLING THE TERMINALS!!! 👹\033[0m"

# Terminal pencerelerini onay sormadan kapatıp Terminal app’i kapatıyoruz
osascript <<EOF
tell application "Terminal"
    repeat with w in windows
        close w saving no
    end repeat
    quit
end tell
EOF

echo "✅ Day Completed!"

echo -e "\033[1;36m"
cat << "EOF"
░█████████  ░██                      ░██                                           
░██     ░██                          ░██                                           
░██     ░██ ░██ ░████████  ░███████  ░██  ░███████   ░███████  ░██░████  ░███████  
░█████████  ░██░██    ░██ ░██    ░██ ░██ ░██    ░██ ░██    ░██ ░███     ░██    ░██ 
░██   ░██   ░██░██    ░██ ░█████████ ░██ ░██        ░██    ░██ ░██      ░█████████ 
░██    ░██  ░██░██   ░███ ░██        ░██ ░██    ░██ ░██    ░██ ░██      ░██        
░██     ░██ ░██ ░█████░██  ░███████  ░██  ░███████   ░███████  ░██       ░███████  
                      ░██                                                          
                ░███████                                                           
EOF
echo -e "\033[0m"

echo -e "Have a good day Oggy!"
