# Railway 部署脚本 (PowerShell)
# 用于快速设置和部署到 Railway

Write-Host "🚀 Railway 部署脚本" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# 检查 Railway CLI 是否安装
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI 已安装" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI 未安装" -ForegroundColor Red
    Write-Host "正在安装 Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI 安装完成" -ForegroundColor Green
    Write-Host ""
}

# 检查是否已登录
try {
    railway whoami | Out-Null
    Write-Host "✅ 已登录 Railway" -ForegroundColor Green
} catch {
    Write-Host "🔐 请先登录 Railway" -ForegroundColor Yellow
    railway login
    Write-Host ""
}

# 检查项目是否已初始化
if (-not (Test-Path ".railway")) {
    Write-Host "📦 初始化 Railway 项目..." -ForegroundColor Yellow
    railway init
    Write-Host ""
}

# 检查环境变量
Write-Host "🔍 检查环境变量..." -ForegroundColor Cyan
Write-Host ""

$botToken = $env:BOT_TOKEN
if ([string]::IsNullOrEmpty($botToken)) {
    Write-Host "⚠️  未检测到 BOT_TOKEN 环境变量" -ForegroundColor Yellow
    $botToken = Read-Host "请输入你的 Telegram Bot Token"
    if (-not [string]::IsNullOrEmpty($botToken)) {
        railway variables set BOT_TOKEN="$botToken"
        Write-Host "✅ BOT_TOKEN 已设置" -ForegroundColor Green
    } else {
        Write-Host "❌ BOT_TOKEN 不能为空，部署终止" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ BOT_TOKEN 已存在" -ForegroundColor Green
}

Write-Host ""

# 询问是否设置 BIRDEYE_API_KEY
$birdeyeKey = Read-Host "是否设置 BIRDEYE_API_KEY？(可选，按 Enter 跳过)"
if (-not [string]::IsNullOrEmpty($birdeyeKey)) {
    railway variables set BIRDEYE_API_KEY="$birdeyeKey"
    Write-Host "✅ BIRDEYE_API_KEY 已设置" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 开始部署到 Railway..." -ForegroundColor Cyan
railway up

Write-Host ""
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📊 查看日志：railway logs" -ForegroundColor Cyan
Write-Host "🌐 打开项目：railway open" -ForegroundColor Cyan
Write-Host ""


