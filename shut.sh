#!/bin/bash

BASEDIR=$(dirname "$(realpath "$0")")

echo "🚀 Stopping core and client processes..."

PY_PID=$(pgrep -f "python3 run.py")
if [ -n "$PY_PID" ]; then
  echo "🐍 Sending SIGINT to Python backend (PID $PY_PID)..."
  kill -SIGINT $PY_PID
  sleep 2

  if kill -0 $PY_PID 2>/dev/null; then
    echo "🐍 Python still alive, sending SIGTERM..."
    kill -SIGTERM $PY_PID
    sleep 2
  fi

  if kill -0 $PY_PID 2>/dev/null; then
    echo "🐍 Python still alive, sending SIGKILL!"
    kill -SIGKILL $PY_PID
  fi

  echo "🐍 Python backend process stopped."
else
  echo "🐍 Python backend process not found."
fi

CLIENT_PID=$(pgrep -f "npm run dev")
if [ -n "$CLIENT_PID" ]; then
  echo "💻 Sending SIGINT to client (PID $CLIENT_PID)..."
  kill -SIGINT $CLIENT_PID
  sleep 2

  if kill -0 $CLIENT_PID 2>/dev/null; then
    echo "💻 Client still alive, sending SIGTERM..."
    kill -SIGTERM $CLIENT_PID
    sleep 2
  fi

  if kill -0 $CLIENT_PID 2>/dev/null; then
    echo "💻 Client still alive, sending SIGKILL!"
    kill -SIGKILL $CLIENT_PID
  fi

  echo "💻 Client process stopped."
else
  echo "💻 Client process not found."
fi

sleep 2

echo "💾 Committing to GIT..."

cd "$BASEDIR"

DATE=$(date '+%Y-%m-%d_%H-%M-%S')
git add .
git commit -m "LastWorkAt: $DATE"
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
