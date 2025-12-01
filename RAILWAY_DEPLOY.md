# 🚂 Railway 部署配置指南

本文档详细说明如何在 Railway 上部署加密货币报价机器人。

## 📋 目录

- [环境变量配置](#环境变量配置)
- [部署方法](#部署方法)
- [配置文件说明](#配置文件说明)
- [故障排除](#故障排除)

## 🔐 环境变量配置

### 必需环境变量

#### `BOT_TOKEN`
- **描述**: Telegram 机器人令牌
- **获取方式**:
  1. 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)
  2. 发送 `/newbot` 创建新机器人
  3. 按提示设置机器人名称和用户名
  4. 获取 Token（格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）
- **在 Railway 中设置**:
  1. 进入项目页面
  2. 点击 **"Variables"** 标签
  3. 点击 **"New Variable"**
  4. 名称：`BOT_TOKEN`
  5. 值：你的 Token
  6. 点击 **"Add"**

### 可选环境变量

#### `BIRDEYE_API_KEY`
- **描述**: Birdeye API 密钥（用于增强 Solana 代币查询）
- **获取方式**:
  1. 访问 [Birdeye](https://birdeye.so/)
  2. 注册账号并申请 API Key
- **注意**: 不设置此变量也能正常工作，但某些 Solana 代币查询可能受限
- **在 Railway 中设置**: 同 `BOT_TOKEN` 设置方法

## 🚀 部署方法

### 方法一：通过 GitHub 部署（推荐）

#### 步骤 1：准备代码仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加文件（注意：不要提交 .env 文件）
git add .
git commit -m "Initial commit: Crypto Quote Bot"

# 推送到 GitHub
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

**重要**: 确保 `.gitignore` 文件包含 `.env`，避免泄露敏感信息。

#### 步骤 2：连接 Railway

1. 访问 [Railway](https://railway.app/)
2. 使用 GitHub 账号登录
3. 点击 **"New Project"**
4. 选择 **"Deploy from GitHub repo"**
5. 授权 GitHub 访问
6. 选择你的仓库

#### 步骤 3：配置环境变量

按照上面的[环境变量配置](#环境变量配置)说明设置 `BOT_TOKEN` 和可选的 `BIRDEYE_API_KEY`。

#### 步骤 4：等待部署

Railway 会自动：
- 检测 Node.js 项目
- 运行 `npm install` 安装依赖
- 执行 `npm start` 启动机器人

等待 1-2 分钟，看到 "Deployed successfully" 就完成了！

### 方法二：使用 Railway CLI 部署

#### 步骤 1：安装 Railway CLI

```bash
npm install -g @railway/cli
```

#### 步骤 2：登录 Railway

```bash
railway login
```

#### 步骤 3：初始化项目

```bash
railway init
```

#### 步骤 4：设置环境变量

```bash
# 设置必需的环境变量
railway variables set BOT_TOKEN=你的机器人Token

# 可选：设置 Birdeye API Key
railway variables set BIRDEYE_API_KEY=你的Birdeye_API_Key
```

#### 步骤 5：部署

```bash
railway up
```

### 方法三：使用部署脚本（自动化）

#### Windows (PowerShell)

```powershell
.\railway-deploy.ps1
```

#### Linux/macOS (Bash)

```bash
chmod +x railway-deploy.sh
./railway-deploy.sh
```

## 📄 配置文件说明

### `railway.json`

Railway 项目配置文件，包含构建和部署设置：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**配置说明**:
- `builder`: 使用 NIXPACKS 自动检测 Node.js 项目
- `buildCommand`: 构建时执行的命令
- `startCommand`: 启动服务时执行的命令
- `restartPolicyType`: 重启策略（失败时重启）
- `restartPolicyMaxRetries`: 最大重试次数

### `.env.example`

环境变量模板文件，用于本地开发：

```env
BOT_TOKEN=your_telegram_bot_token_here
BIRDEYE_API_KEY=your_birdeye_api_key_here
```

**使用方法**:
```bash
# 复制模板文件
cp .env.example .env

# 编辑 .env 文件，填入实际值
# 注意：不要将 .env 文件提交到 Git
```

## 🔍 验证部署

### 1. 查看部署日志

在 Railway 项目页面：
1. 点击 **"Deployments"** 标签
2. 选择最新的部署
3. 查看 **"Logs"** 标签

应该看到：
```
🚀 机器人启动中...
✅ 机器人已成功启动！
```

### 2. 测试机器人

在 Telegram 中：
1. 找到你的机器人
2. 发送 `/start` 命令
3. 应该收到欢迎消息
4. 发送 `BTC` 测试查询功能

## 🐛 故障排除

### 部署失败

**问题**: Railway 部署失败

**解决方案**:
1. 检查 `package.json` 格式是否正确
2. 确认 Node.js 版本兼容（需要 >= 18.0.0）
3. 查看部署日志中的错误信息
4. 确认代码没有语法错误

### 机器人无响应

**问题**: 部署成功但机器人不响应

**解决方案**:
1. 检查 `BOT_TOKEN` 是否正确设置
2. 确认环境变量已保存并重新部署
3. 查看 Railway 日志是否有错误
4. 验证 Bot Token 是否有效（在 BotFather 中检查）

### 环境变量未生效

**问题**: 设置了环境变量但未生效

**解决方案**:
1. 确认环境变量名称拼写正确（区分大小写）
2. 设置环境变量后，Railway 会自动重新部署
3. 如果没有自动部署，手动触发重新部署
4. 检查日志确认环境变量是否被读取

### 查询功能异常

**问题**: 机器人响应但查询不到代币信息

**解决方案**:
1. 检查网络连接（Railway 服务是否正常运行）
2. 查看日志中的 API 错误信息
3. 确认代币名称/地址正确
4. 某些新代币可能还未被 API 索引

### 查看实时日志

```bash
# 使用 Railway CLI
railway logs

# 或使用 -f 参数实时跟踪
railway logs -f
```

## 💰 免费额度说明

Railway 免费计划：
- **$5/月** 免费额度
- 对于这种轻量级机器人，完全够用
- 如果超出，会暂停服务（不会扣费）
- 可以在项目设置中查看使用情况

## 🔒 安全提示

1. **不要提交敏感信息**:
   - 确保 `.env` 在 `.gitignore` 中
   - 不要将 Token 硬编码到代码中

2. **定期更新 Token**:
   - 如果怀疑 Token 泄露，立即在 BotFather 重新生成
   - 更新 Railway 中的环境变量

3. **保护 API Key**:
   - Birdeye API Key 同样需要保密
   - 不要分享给他人

## 📚 相关资源

- [Railway 官方文档](https://docs.railway.app/)
- [Telegram Bot API 文档](https://core.telegram.org/bots/api)
- [Node.js 版本要求](https://nodejs.org/)

## 🆘 获取帮助

如果遇到问题：
1. 查看 Railway 部署日志
2. 检查环境变量配置
3. 参考本文档的故障排除部分
4. 查看 Railway 官方文档

---

**部署完成后，你的机器人就可以 24/7 免费运行了！** 🎉


