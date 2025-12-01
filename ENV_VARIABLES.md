# 🔐 环境变量配置说明

本文档说明项目所需的环境变量及其配置方法。

## 📋 环境变量列表

### 必需变量

#### `BOT_TOKEN`
- **类型**: 必需
- **描述**: Telegram 机器人令牌
- **获取方式**:
  1. 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)
  2. 发送 `/newbot` 创建新机器人
  3. 按提示设置机器人名称和用户名
  4. 获取 Token（格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）
- **示例**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 可选变量

#### `BIRDEYE_API_KEY`
- **类型**: 可选
- **描述**: Birdeye API 密钥，用于增强 Solana 代币查询体验
- **获取方式**:
  1. 访问 [Birdeye](https://birdeye.so/)
  2. 注册账号并申请 API Key
- **注意**: 不设置此变量也能正常工作，但某些 Solana 代币查询可能受限
- **示例**: `your_birdeye_api_key_here`

## 🖥️ 本地开发配置

### 创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/macOS
touch .env
```

### 编辑 `.env` 文件

```env
# Telegram Bot 配置
BOT_TOKEN=your_telegram_bot_token_here

# Birdeye API 配置（可选）
BIRDEYE_API_KEY=your_birdeye_api_key_here
```

**重要提示**:
- 将 `your_telegram_bot_token_here` 替换为你的实际 Token
- 如果需要 Birdeye API，将 `your_birdeye_api_key_here` 替换为你的实际 API Key
- 不要将 `.env` 文件提交到 Git（已在 `.gitignore` 中）

## 🚂 Railway 部署配置

### 在 Railway 中设置环境变量

1. **登录 Railway**
   - 访问 [Railway](https://railway.app/)
   - 登录你的账号

2. **进入项目设置**
   - 选择你的项目
   - 点击 **"Variables"** 标签页

3. **添加环境变量**
   - 点击 **"New Variable"** 按钮
   - 输入变量名（如 `BOT_TOKEN`）
   - 输入变量值（你的实际 Token）
   - 点击 **"Add"** 保存

4. **重新部署**
   - Railway 会自动检测环境变量变化
   - 如果需要，可以手动触发重新部署

### 使用 Railway CLI 设置

```bash
# 设置必需变量
railway variables set BOT_TOKEN=你的机器人Token

# 设置可选变量
railway variables set BIRDEYE_API_KEY=你的Birdeye_API_Key

# 查看所有环境变量
railway variables

# 删除环境变量
railway variables delete BOT_TOKEN
```

## 🔒 安全注意事项

1. **不要提交敏感信息**
   - ✅ 确保 `.env` 在 `.gitignore` 中
   - ❌ 不要将 Token 硬编码到代码中
   - ❌ 不要将 `.env` 文件提交到 Git

2. **定期更新 Token**
   - 如果怀疑 Token 泄露，立即在 BotFather 重新生成
   - 更新所有使用该 Token 的环境（本地和 Railway）

3. **保护 API Key**
   - Birdeye API Key 同样需要保密
   - 不要分享给他人或在公开场合展示

4. **环境变量验证**
   - 代码启动时会检查 `BOT_TOKEN` 是否存在
   - 如果缺失，机器人将无法启动

## 📝 环境变量检查清单

部署前请确认：

- [ ] `BOT_TOKEN` 已设置且有效
- [ ] `BIRDEYE_API_KEY` 已设置（如果需要）
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] Railway 环境变量已正确配置
- [ ] 本地和远程环境变量值一致

## 🐛 常见问题

### Q: 如何验证环境变量是否正确设置？

**A**: 
- 本地：检查 `.env` 文件是否存在且包含正确的值
- Railway：在项目 Variables 页面查看，或使用 `railway variables` 命令

### Q: 环境变量设置后需要重启吗？

**A**: 
- Railway 会自动检测环境变量变化并重新部署
- 本地开发需要重启 Node.js 进程（`npm start`）

### Q: 忘记 Token 怎么办？

**A**: 
- 在 BotFather 中发送 `/mybots`
- 选择你的机器人
- 选择 "API Token"
- 可以查看或重新生成 Token

### Q: 多个环境如何管理？

**A**: 
- 本地开发：使用 `.env` 文件
- Railway 生产：使用 Railway Variables
- 可以使用不同的 `.env` 文件（如 `.env.local`, `.env.production`）

---

**配置完成后，你的机器人就可以正常运行了！** 🎉


