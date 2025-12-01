# 🚂 Railway 一键部署指南

## 📋 前置准备

1. **创建 Telegram 机器人**
   - 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)
   - 发送 `/newbot` 创建机器人
   - 获取 Bot Token（类似：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

2. **准备 GitHub 账号**（推荐方法）
   - 如果没有，去 [GitHub](https://github.com) 注册

## 🚀 部署步骤（GitHub 方法 - 最简单）

### 步骤 1：上传代码到 GitHub

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Crypto Quote Bot"

# 在 GitHub 创建新仓库，然后连接
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2：连接 Railway

1. 访问 [Railway](https://railway.app/)
2. 点击 **"Start a New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 授权 GitHub 访问
5. 选择你的仓库

### 步骤 3：配置环境变量

1. 在 Railway 项目页面，点击 **"Variables"** 标签
2. 点击 **"New Variable"**
3. 添加：
   - **Name**: `BOT_TOKEN`
   - **Value**: 你的 Telegram Bot Token
4. 点击 **"Add"**

### 步骤 4：等待部署

Railway 会自动：
- 检测 Node.js 项目
- 安装依赖
- 启动机器人

等待 1-2 分钟，看到 "Deployed successfully" 就完成了！

## 🔍 验证部署

1. 在 Railway 项目页面，点击 **"Deployments"**
2. 查看日志，应该看到：
   ```
   🚀 机器人启动中...
   ✅ 机器人已成功启动！
   ```

3. 在 Telegram 找到你的机器人，发送 `/start` 测试

## 💡 其他部署方法

### 使用 Railway CLI

```bash
# 安装 CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化
railway init

# 设置环境变量
railway variables set BOT_TOKEN=你的Token

# 部署
railway up
```

## 🆓 免费额度说明

Railway 免费计划：
- **$5/月** 免费额度
- 对于这种轻量级机器人，完全够用
- 如果超出，会暂停服务（不会扣费）

## 🐛 常见问题

### 部署失败？
- 检查 `BOT_TOKEN` 是否正确设置
- 查看部署日志中的错误信息
- 确认 `package.json` 格式正确

### 机器人无响应？
- 检查环境变量是否设置
- 查看 Railway 日志
- 确认 Bot Token 有效

### 如何查看日志？
1. 在 Railway 项目页面
2. 点击 **"Deployments"**
3. 点击最新的部署
4. 查看 **"Logs"** 标签

## 📞 需要帮助？

- Railway 文档：https://docs.railway.app/
- Telegram Bot API：https://core.telegram.org/bots/api

---

**部署完成后，你的机器人就可以 24/7 免费运行了！** 🎉


