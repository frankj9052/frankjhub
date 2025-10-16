#!/usr/bin/env bash
set -euo pipefail

APP="main-server"
USER="ubuntu"
HOST="ec2-98-81-80-209.compute-1.amazonaws.com"
KEY="${HOME}/keys/aws-ec2-frankjhub.pem"

# 本地路径
LOCAL_DIR="/root/projects/frankjhub/apps/${APP}/"
# 远端路径
REMOTE_DIR="/home/ubuntu/projects/frankjhub/apps/${APP}/"

# nvm node 目录 & pm2 绝对路径
NODE_BIN_DIR="/home/ubuntu/.nvm/versions/node/v22.16.0/bin"
PM2_BIN="${NODE_BIN_DIR}/pm2"

# 1️⃣ 停止远端 PM2 进程
echo "▶️ Stopping PM2 process on remote..."
ssh -i "$KEY" "$USER@$HOST" \
  "export PATH='${NODE_BIN_DIR}':\$PATH; '${PM2_BIN}' stop '${APP}'"

# 2️⃣ 同步目录（完全镜像）
echo "▶️ Syncing ${LOCAL_DIR} → ${USER}@${HOST}:${REMOTE_DIR}"
rsync -avh --progress --delete \
  -e "ssh -i ${KEY}" \
  "${LOCAL_DIR}" \
  "${USER}@${HOST}:${REMOTE_DIR}"

# 3️⃣ 启动 PM2
echo "▶️ Restarting PM2 process on remote..."
ssh -i "$KEY" "$USER@$HOST" \
  "export PATH='${NODE_BIN_DIR}':\$PATH; '${PM2_BIN}' restart '${APP}'"

echo "✅ Done. ${APP} successfully deployed to ${HOST}:${REMOTE_DIR}"