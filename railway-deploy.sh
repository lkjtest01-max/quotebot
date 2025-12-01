#!/bin/bash

# Railway 部署脚本
# 用于快速设置和部署到 Railway

set -e

echo "🚀 Railway 部署脚本"
echo "===================="
echo ""

# 检查 Railway CLI 是否安装
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo "正在安装 Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI 安装完成"
    echo ""
fi

# 检查是否已登录
if ! railway whoami &> /dev/null; then
    echo "🔐 请先登录 Railway"
    railway login
    echo ""
fi

# 检查项目是否已初始化
if [ ! -f ".railway" ]; then
    echo "📦 初始化 Railway 项目..."
    railway init
    echo ""
fi

# 检查环境变量
echo "🔍 检查环境变量..."
echo ""

if [ -z "$BOT_TOKEN" ]; then
    echo "⚠️  未检测到 BOT_TOKEN 环境变量"
    read -p "请输入你的 Telegram Bot Token: " bot_token
    if [ -n "$bot_token" ]; then
        railway variables set BOT_TOKEN="$bot_token"
        echo "✅ BOT_TOKEN 已设置"
    else
        echo "❌ BOT_TOKEN 不能为空，部署终止"
        exit 1
    fi
else
    echo "✅ BOT_TOKEN 已存在"
fi

echo ""

# 询问是否设置 BIRDEYE_API_KEY
read -p "是否设置 BIRDEYE_API_KEY？(可选，按 Enter 跳过): " birdeye_key
if [ -n "$birdeye_key" ]; then
    railway variables set BIRDEYE_API_KEY="$birdeye_key"
    echo "✅ BIRDEYE_API_KEY 已设置"
fi

echo ""
echo "🚀 开始部署到 Railway..."
railway up

echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 查看日志：railway logs"
echo "🌐 打开项目：railway open"
echo ""


