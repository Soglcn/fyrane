#!/bin/bash

BASEDIR=$(dirname "$(realpath "$0")")

echo "🚀 Stopping core and client processes..."

# Python backend kill
PY_PID=$(pgrep -f "python3 run.py")
if [ -n "$PY_PID" ]; then
  kill -SIGINT $PY_PID
  echo "🐍 Python backend stopped (PID $PY_PID)."
else
  echo "🐍 Python backend process not found."
fi

# Client kill
CLIENT_PID=$(pgrep -f "npm run dev")
if [ -n "$CLIENT_PID" ]; then
  kill -SIGINT $CLIENT_PID
  echo "💻 Client stopped (PID $CLIENT_PID)."
else
  echo "💻 Client process not found."
fi

sleep 3

echo "💾 Committing to GIT..."

cd "$BASEDIR"

DATE=$(date '+%Y-%m-%d_%H-%M-%S')
git add .
git commit -m "LastOneAt: $DATE"
git push -u origin main

echo -e "\033[1;31m👹 I AM KILLING THE TERMINALS!!! 👹\033[0m"

osascript <<EOF
tell application "Terminal"
  repeat with w in windows
    repeat with t in tabs of w
      try
        do script "exit" in t
      end try
    end repeat
  end repeat
  delay 2
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
