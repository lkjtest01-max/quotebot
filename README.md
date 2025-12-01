# 🚀 加密货币智能报价机器人

一个功能强大的 Telegram 加密货币报价机器人，支持多链代币查询，秒回实时价格信息！

## ✨ 功能特性

- 🔍 **智能识别**：支持代币名称、符号、合约地址
- 🌐 **多链支持**：ETH、Solana、Base、BSC、Arbitrum、Polygon 等主流链
- ⚡ **秒回数据**：实时价格、24h涨幅、市值、流动性
- 🔗 **一键跳转**：快速访问 DexScreener、Birdeye、Ave.ai
- 💬 **全场景支持**：私聊和群聊都可用
- 🆓 **完全免费**：使用公开 API，无需付费

## 📋 使用方法

### 方式一：直接发送
```
BTC
ETH
PEPE
0x1234... (合约地址)
```

### 方式二：使用命令
```
/price BTC
/price PEPE
/price 0x1234...
```

## 🛠️ 本地运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env`，并填入你的 Telegram Bot Token：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
BOT_TOKEN=你的机器人Token
```

### 3. 获取 Bot Token
1. 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)
2. 发送 `/newbot` 创建新机器人
3. 按提示设置名称和用户名
4. 获取 Token 并填入 `.env` 文件

### 4. 启动机器人
```bash
npm start
```

## 🚂 部署到 Railway（免费永久运行）

### 方法一：通过 GitHub 部署（推荐）

#### 步骤 1：创建 GitHub 仓库
1. 在 GitHub 创建新仓库
2. 将代码推送到仓库：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

#### 步骤 2：连接 Railway
1. 访问 [Railway](https://railway.app/)
2. 使用 GitHub 账号登录
3. 点击 **"New Project"**
4. 选择 **"Deploy from GitHub repo"**
5. 选择你的仓库

#### 步骤 3：配置环境变量
1. 在 Railway 项目页面，点击 **"Variables"** 标签
2. 添加环境变量：
   - **Key**: `BOT_TOKEN`
   - **Value**: 你的 Telegram Bot Token
3. 点击 **"Add"**

#### 步骤 4：部署
Railway 会自动检测 Node.js 项目并开始部署。等待部署完成即可！

### 方法二：通过 Railway CLI 部署

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
railway variables set BOT_TOKEN=你的机器人Token
```

#### 步骤 5：部署
```bash
railway up
```

## 📊 数据源

- **DexScreener API**: 主要数据源，支持多链
- **Birdeye API**: 补充数据源，主要用于 Solana

## 🔧 技术栈

- **Node.js**: 运行环境
- **Telegraf**: Telegram Bot 框架
- **Axios**: HTTP 请求库
- **dotenv**: 环境变量管理

## 📝 注意事项

1. **免费额度**：Railway 免费计划每月有 $5 额度，对于这种轻量级机器人完全够用
2. **API 限制**：DexScreener 和 Birdeye 的公开 API 可能有速率限制，建议不要过于频繁查询
3. **Token 安全**：不要将 `.env` 文件提交到 Git，Token 泄露后需要立即在 BotFather 重新生成

## 🐛 故障排除

### 机器人无响应
- 检查 `BOT_TOKEN` 是否正确
- 查看 Railway 日志：在项目页面点击 **"Deployments"** → **"View Logs"**

### 查询不到代币信息
- 确认代币名称/符号正确
- 确认合约地址完整且正确
- 某些新代币可能还未被索引

### Railway 部署失败
- 确认 `package.json` 中的 `engines.node` 版本
- 检查代码是否有语法错误
- 查看 Railway 部署日志

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受使用！如有问题，欢迎反馈！** 🎉


