require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// 价格缓存（3秒）
const priceCache = new Map();
const CACHE_TTL = 3000; // 3秒

// 主流币映射（CoinGecko ID）
const MAIN_COINS = {
  'BTC': 'bitcoin',
  'BITCOIN': 'bitcoin',
  'ETH': 'ethereum',
  'ETHEREUM': 'ethereum',
  'SOL': 'solana',
  'SOLANA': 'solana',
  'BNB': 'binancecoin',
  'BINANCE': 'binancecoin',
  'ADA': 'cardano',
  'CARDANO': 'cardano',
  'XRP': 'ripple',
  'RIPPLE': 'ripple',
  'DOGE': 'dogecoin',
  'DOGECOIN': 'dogecoin',
  'MATIC': 'matic-network',
  'POLYGON': 'matic-network',
  'AVAX': 'avalanche-2',
  'AVALANCHE': 'avalanche-2',
  'DOT': 'polkadot',
  'POLKADOT': 'polkadot',
  'LINK': 'chainlink',
  'CHAINLINK': 'chainlink',
  'UNI': 'uniswap',
  'UNISWAP': 'uniswap',
  'ATOM': 'cosmos',
  'COSMOS': 'cosmos',
  'LTC': 'litecoin',
  'LITECOIN': 'litecoin',
  'BCH': 'bitcoin-cash',
  'BITCOIN CASH': 'bitcoin-cash',
  'XLM': 'stellar',
  'STELLAR': 'stellar',
  'ALGO': 'algorand',
  'ALGORAND': 'algorand',
  'VET': 'vechain',
  'VECHAIN': 'vechain',
  'ICP': 'internet-computer',
  'INTERNET COMPUTER': 'internet-computer',
  'FIL': 'filecoin',
  'FILECOIN': 'filecoin',
  'TRX': 'tron',
  'TRON': 'tron',
  'ETC': 'ethereum-classic',
  'ETHEREUM CLASSIC': 'ethereum-classic',
  'XMR': 'monero',
  'MONERO': 'monero',
  'EOS': 'eos',
  'AAVE': 'aave',
  'MKR': 'maker',
  'MAKER': 'maker',
  'COMP': 'compound-governance-token',
  'COMPOUND': 'compound-governance-token',
  'YFI': 'yearn-finance',
  'SNX': 'havven',
  'SUSHI': 'sushi',
  'CRV': 'curve-dao-token',
  '1INCH': '1inch',
  'BAL': 'balancer',
  'BAND': 'band-protocol',
  'BAT': 'basic-attention-token',
  'ZRX': '0x',
  'ENJ': 'enjincoin',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'GALA': 'gala',
  'CHZ': 'chiliz',
  'FLOW': 'flow',
  'THETA': 'theta-token',
  'ZIL': 'zilliqa',
  'WAVES': 'waves',
  'NEAR': 'near',
  'FTM': 'fantom',
  'FANTOM': 'fantom',
  'HBAR': 'hedera-hashgraph',
  'HEDERA': 'hedera-hashgraph',
  'EGLD': 'elrond-erd-2',
  'ELROND': 'elrond-erd-2',
  'ZEC': 'zcash',
  'ZCASH': 'zcash',
  'DASH': 'dash',
  'NEO': 'neo',
  'QTUM': 'qtum',
  'IOTA': 'iota',
  'ONT': 'ontology',
  'ONTOLOGY': 'ontology',
  'ZEN': 'zencash',
  'SC': 'siacoin',
  'SIACOIN': 'siacoin',
  'STORJ': 'storj',
  'OMG': 'omisego',
  'OMISEGO': 'omisego',
  'KNC': 'kyber-network-crystal',
  'KLAY': 'klay-token',
  'KLAYTN': 'klay-token',
  'RUNE': 'thorchain',
  'THORCHAIN': 'thorchain',
  'ROSE': 'oasis-network',
  'OASIS': 'oasis-network',
  'CELO': 'celo',
  'AR': 'arweave',
  'ARWEAVE': 'arweave',
  'REN': 'republic-protocol',
  'RENBTC': 'renbtc',
  'WBTC': 'wrapped-bitcoin',
  'WRAPPED BITCOIN': 'wrapped-bitcoin',
  'USTC': 'terrausd',
  'LUNA': 'terra-luna',
  'TERRA': 'terra-luna',
  'UST': 'terrausd',
  'LUNC': 'terra-luna',
  'PEPE': 'pepe',
  'BONK': 'bonk',
  'SHIB': 'shiba-inu',
  'SHIBA': 'shiba-inu',
  'SHIBA INU': 'shiba-inu',
  'FLOKI': 'floki',
  'DOGE': 'dogecoin',
  'WIF': 'dogwifhat',
  'DOGWIFHAT': 'dogwifhat'
};

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 带重试的请求函数
async function requestWithRetry(requestFn, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await delay(delayMs);
    }
  }
}

// 检查缓存
function getCached(key) {
  const cached = priceCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

// 设置缓存
function setCache(key, data) {
  priceCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// 检测链类型
function detectChain(input) {
  const upperInput = input.toUpperCase().trim();
  
  // 主流币原生链
  if (upperInput === 'BTC' || upperInput === 'BITCOIN') {
    return 'Bitcoin';
  }
  if (upperInput === 'ETH' || upperInput === 'ETHEREUM') {
    return 'Ethereum';
  }
  if (upperInput === 'SOL' || upperInput === 'SOLANA') {
    return 'Solana';
  }
  
  // 合约地址检测
  if (input.startsWith('0x') || input.startsWith('0X')) {
    // 以太坊地址（0x开头，42字符）
    if (input.length === 42) {
      return 'Ethereum';
    }
  }
  
  // Solana地址（base58，通常32-44字符）
  if (input.length >= 32 && input.length <= 44 && /^[A-Za-z0-9]+$/.test(input)) {
    // 排除明显的以太坊地址
    if (!input.startsWith('0x')) {
      return 'Solana';
    }
  }
  
  return null;
}

// 从 CoinGecko 获取主流币价格
async function fetchFromCoinGecko(coinId) {
  try {
    const cacheKey = `coingecko_${coinId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await requestWithRetry(async () => {
      return await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    }, 3, 2000);
    
    if (response.data && response.data[coinId]) {
      const data = response.data[coinId];
      const result = {
        price: data.usd || 0,
        priceChange24h: data.usd_24h_change || 0,
        marketCap: data.usd_market_cap || 0,
        source: 'CoinGecko'
      };
      setCache(cacheKey, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    return null;
  }
}

// 从 CoinGecko 获取代币详细信息（通过搜索）
async function fetchTokenInfoFromCoinGecko(symbol) {
  try {
    const cacheKey = `coingecko_info_${symbol}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await requestWithRetry(async () => {
      return await axios.get(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(symbol)}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    }, 3, 2000);
    
    if (response.data && response.data.coins && response.data.coins.length > 0) {
      const coin = response.data.coins[0];
      const coinId = coin.id;
      
      // 获取价格数据
      const priceData = await fetchFromCoinGecko(coinId);
      if (priceData) {
        const result = {
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          coinId: coinId,
          ...priceData
        };
        setCache(cacheKey, result);
        return result;
      }
    }
    return null;
  } catch (error) {
    console.error('CoinGecko search error:', error.message);
    return null;
  }
}

// 从 DexScreener 获取代币数据（合约地址）
async function fetchFromDexScreener(input, detectedChain) {
  try {
    const cacheKey = `dexscreener_${input}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    
    const cleanInput = input.trim();
    let pairs = [];
    
    // 如果是地址格式，直接查询
    if (cleanInput.startsWith('0x') || cleanInput.length >= 32) {
      try {
        const response = await requestWithRetry(async () => {
          return await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${cleanInput}`, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        }, 3, 2000);
        
        if (response.data && response.data.pairs && Array.isArray(response.data.pairs)) {
          pairs = response.data.pairs;
        }
      } catch (e) {
        // 地址查询失败
      }
    }
    
    // 如果不是地址或地址查询失败，尝试搜索
    if (pairs.length === 0) {
      try {
        const searchResponse = await requestWithRetry(async () => {
          return await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(cleanInput)}`, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        }, 3, 2000);
        
        if (searchResponse.data && searchResponse.data.pairs && Array.isArray(searchResponse.data.pairs)) {
          pairs = searchResponse.data.pairs;
        }
      } catch (e) {
        // 搜索失败
      }
    }
    
    if (!pairs || pairs.length === 0) {
      return null;
    }
    
    // 找到流动性最好的交易对
    const bestPair = pairs
      .filter(pair => pair.liquidity && pair.liquidity.usd)
      .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0] || pairs[0];
    
    if (!bestPair) {
      return null;
    }
    
    const chainMap = {
      'ethereum': 'Ethereum',
      'solana': 'Solana',
      'bsc': 'BSC',
      'base': 'Base',
      'arbitrum': 'Arbitrum',
      'polygon': 'Polygon',
      'avalanche': 'Avalanche',
      'optimism': 'Optimism',
      'fantom': 'Fantom',
      'cronos': 'Cronos',
      'gnosis': 'Gnosis',
      'moonbeam': 'Moonbeam',
      'moonriver': 'Moonriver',
      'celo': 'Celo',
      'aurora': 'Aurora',
      'harmony': 'Harmony',
      'metis': 'Metis',
      'boba': 'Boba',
      'okc': 'OKC',
      'heco': 'HECO',
      'kava': 'Kava',
      'mantle': 'Mantle',
      'linea': 'Linea',
      'zksync': 'zkSync',
      'scroll': 'Scroll',
      'blast': 'Blast',
      'mode': 'Mode',
      'zora': 'Zora',
      'opbnb': 'opBNB',
      'mantle': 'Mantle',
      'manta': 'Manta',
      'merlin': 'Merlin',
      'bouncebit': 'BounceBit',
      'bitcoin': 'Bitcoin'
    };
    
    const chain = chainMap[bestPair.chainId] || detectedChain || bestPair.chainId || 'Unknown';
    const token = bestPair.baseToken || bestPair.quoteToken;
    
    const result = {
      name: token.name || 'Unknown',
      symbol: token.symbol || 'UNKNOWN',
      price: parseFloat(bestPair.priceUsd) || 0,
      priceChange24h: parseFloat(bestPair.priceChange?.h24 || 0),
      marketCap: parseFloat(bestPair.marketCap) || 0,
      liquidity: parseFloat(bestPair.liquidity?.usd || 0),
      chain: chain,
      dexScreenerUrl: `https://dexscreener.com/${bestPair.chainId}/${bestPair.pairAddress}`,
      birdeyeUrl: chain === 'Solana' ? `https://birdeye.so/token/${token.address}` : `https://birdeye.so/token/${token.address}?chain=${bestPair.chainId}`,
      aveUrl: `https://ave.ai/token/${token.address}?chain=${bestPair.chainId}`,
      source: 'DexScreener'
    };
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('DexScreener API error:', error.message);
    return null;
  }
}

// 从 Birdeye 获取代币数据（主要用于 Solana）
async function fetchFromBirdeye(input, detectedChain) {
  try {
    const cacheKey = `birdeye_${input}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    
    const cleanInput = input.trim();
    const isAddress = cleanInput.length >= 32 || cleanInput.startsWith('0x') || cleanInput.startsWith('0X');
    
    if (isAddress) {
      // 使用重试机制查询价格
      const priceResponse = await requestWithRetry(async () => {
        return await axios.get(`https://public-api.birdeye.so/defi/price?address=${cleanInput}`, {
          timeout: 10000,
          headers: {
            'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      }, 3, 2000);
      
      const priceData = priceResponse.data;
      
      if (priceData && priceData.data && priceData.data.value) {
        const priceInfo = priceData.data.value;
        
        // 尝试获取代币详细信息
        let tokenInfo = null;
        try {
          const infoResponse = await requestWithRetry(async () => {
            return await axios.get(`https://public-api.birdeye.so/defi/token_overview?address=${cleanInput}`, {
              timeout: 10000,
              headers: {
                'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
          }, 3, 2000);
          
          if (infoResponse.data && infoResponse.data.data) {
            tokenInfo = infoResponse.data.data;
          }
        } catch (e) {
          // 忽略详细信息获取错误
        }
        
        const name = tokenInfo?.name || priceInfo.name || 'Unknown';
        const symbol = tokenInfo?.symbol || priceInfo.symbol || 'UNKNOWN';
        const chain = detectedChain || tokenInfo?.chain || 'Solana';
        
        const result = {
          name: name,
          symbol: symbol,
          price: parseFloat(priceInfo.price || 0),
          priceChange24h: parseFloat(priceInfo.priceChange24h || priceInfo.priceChange24hPercent || 0),
          marketCap: parseFloat(priceInfo.mc || priceInfo.marketCap || 0),
          liquidity: parseFloat(priceInfo.liquidity || 0),
          chain: chain,
          dexScreenerUrl: chain === 'Solana' ? `https://dexscreener.com/solana/${cleanInput}` : `https://dexscreener.com/${chain.toLowerCase()}/${cleanInput}`,
          birdeyeUrl: `https://birdeye.so/token/${cleanInput}`,
          aveUrl: `https://ave.ai/token/${cleanInput}?chain=${chain.toLowerCase()}`,
          source: 'Birdeye'
        };
        
        setCache(cacheKey, result);
        return result;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Birdeye API error:', error.message);
    return null;
  }
}

// 处理代币查询（主逻辑）
async function handleTokenQuery(ctx, input) {
  try {
    // 显示"正在查询"消息
    const loadingMsg = await ctx.reply('🔍 正在查询代币信息...');
    
    const cleanInput = input.trim().toUpperCase();
    let tokenData = null;
    
    // 1. 检测链类型
    const detectedChain = detectChain(input);
    
    // 2. 如果是主流币，优先使用 CoinGecko
    if (MAIN_COINS[cleanInput]) {
      const coinId = MAIN_COINS[cleanInput];
      const coingeckoData = await fetchFromCoinGecko(coinId);
      
      if (coingeckoData) {
        // 获取代币名称和符号
        const coinInfo = await fetchTokenInfoFromCoinGecko(coinId);
        
        tokenData = {
          name: coinInfo?.name || cleanInput,
          symbol: coinInfo?.symbol || cleanInput,
          price: coingeckoData.price,
          priceChange24h: coingeckoData.priceChange24h,
          marketCap: coingeckoData.marketCap,
          liquidity: 0, // CoinGecko 不提供流动性数据
          chain: detectedChain || (cleanInput === 'BTC' || cleanInput === 'BITCOIN' ? 'Bitcoin' : cleanInput === 'ETH' || cleanInput === 'ETHEREUM' ? 'Ethereum' : cleanInput === 'SOL' || cleanInput === 'SOLANA' ? 'Solana' : 'Unknown'),
          dexScreenerUrl: `https://dexscreener.com/search?q=${encodeURIComponent(input)}`,
          birdeyeUrl: detectedChain === 'Solana' ? `https://birdeye.so/token/${input}` : `https://birdeye.so/search?q=${encodeURIComponent(input)}`,
          aveUrl: `https://ave.ai/search?q=${encodeURIComponent(input)}`,
          source: 'CoinGecko'
        };
      }
    }
    
    // 3. 如果不是主流币或 CoinGecko 失败，尝试通过 CoinGecko 搜索
    if (!tokenData) {
      const coinInfo = await fetchTokenInfoFromCoinGecko(input);
      if (coinInfo && coinInfo.price) {
        tokenData = {
          name: coinInfo.name,
          symbol: coinInfo.symbol,
          price: coinInfo.price,
          priceChange24h: coinInfo.priceChange24h,
          marketCap: coinInfo.marketCap,
          liquidity: 0,
          chain: detectedChain || 'Unknown',
          dexScreenerUrl: `https://dexscreener.com/search?q=${encodeURIComponent(input)}`,
          birdeyeUrl: detectedChain === 'Solana' ? `https://birdeye.so/token/${input}` : `https://birdeye.so/search?q=${encodeURIComponent(input)}`,
          aveUrl: `https://ave.ai/search?q=${encodeURIComponent(input)}`,
          source: 'CoinGecko'
        };
      }
    }
    
    // 4. 如果是合约地址或 CoinGecko 没有数据，尝试 DexScreener
    if (!tokenData && (input.startsWith('0x') || input.length >= 32)) {
      tokenData = await fetchFromDexScreener(input, detectedChain);
    }
    
    // 5. 如果 DexScreener 也没有，尝试 Birdeye（主要用于 Solana）
    if (!tokenData) {
      tokenData = await fetchFromBirdeye(input, detectedChain);
    }
    
    // 6. 最后尝试 DexScreener 搜索（非地址格式）
    if (!tokenData && !input.startsWith('0x') && input.length < 32) {
      tokenData = await fetchFromDexScreener(input, detectedChain);
    }
    
    // 删除加载消息
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    } catch (e) {
      // 忽略删除消息的错误
    }
    
    if (!tokenData) {
      return ctx.reply('❌ 未找到该代币的信息\n\n请检查：\n• 代币名称或符号是否正确\n• 合约地址是否完整\n• 是否支持该链（ETH、Solana、Base等）');
    }
    
    const { name, symbol, price, priceChange24h, marketCap, liquidity, chain, dexScreenerUrl, birdeyeUrl, aveUrl } = tokenData;
    
    // 格式化数字
    const formatNumber = (num) => {
      if (!num || num === 0) return 'N/A';
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
      return `$${num.toFixed(2)}`;
    };
    
    const formatPrice = (num) => {
      if (!num) return 'N/A';
      if (num < 0.01) return `$${num.toFixed(8)}`;
      if (num < 1) return `$${num.toFixed(6)}`;
      return `$${num.toFixed(4)}`;
    };
    
    const changeEmoji = priceChange24h >= 0 ? '📈' : '📉';
    const changeColor = priceChange24h >= 0 ? '🟢' : '🔴';
    
    const message = `💰 <b>${name}</b> (${symbol})
━━━━━━━━━━━━━━━━━━
💵 当前价格: <b>${formatPrice(price)}</b>
${changeEmoji} 24h涨幅: <b>${changeColor} ${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%</b>
💼 市值: <b>${formatNumber(marketCap)}</b>
💧 流动性: <b>${formatNumber(liquidity)}</b>
🔗 链: <b>${chain}</b>
━━━━━━━━━━━━━━━━━━`;
    
    // 创建内联键盘按钮
    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.url('📊 DexScreener', dexScreenerUrl),
        Markup.button.url('🔍 Birdeye', birdeyeUrl)
      ],
      [Markup.button.url('🚀 Ave.ai', aveUrl)]
    ]);
    
    await ctx.replyWithHTML(message, buttons);
  } catch (error) {
    console.error('Error handling token query:', error);
    ctx.reply('❌ 获取代币信息时出错，请稍后再试。');
  }
}

// 处理 /start 命令
bot.start((ctx) => {
  const message = `🚀 欢迎使用加密货币智能报价机器人！

📌 使用方法：
• 直接发送代币名称、符号或合约地址
• 使用命令：/price BTC
• 支持 BTC、ETH、SOL 等主流币和所有链上的合约代币

💡 示例：
• BTC（Bitcoin，~$91k）
• ETH（Ethereum）
• SOL（Solana）
• PEPE（Ethereum 链）
• BONK（Solana 链）
• 0x1234...（合约地址）

⚡ 秒回实时价格、涨幅、市值、流动性！`;
  ctx.reply(message);
});

// 处理 /help 命令
bot.help((ctx) => {
  const message = `📖 使用帮助：

🔍 查询方式：
1. 直接发送：BTC、ETH、PEPE 等
2. 使用命令：/price BTC
3. 发送合约地址（支持多链）

📊 返回信息：
• 当前价格（USD）
• 24小时涨幅
• 市值
• 流动性
• 一键跳转按钮

🌐 支持平台：
• CoinGecko（主流币）
• DexScreener
• Birdeye
• Ave.ai`;
  ctx.reply(message);
});

// 处理 /price 命令
bot.command('price', async (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!input) {
    return ctx.reply('❌ 请提供代币名称、符号或合约地址\n\n示例：/price BTC');
  }
  await handleTokenQuery(ctx, input);
});

// 处理普通文本消息（排除命令）
bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  // 忽略以 / 开头的命令（除了已处理的）
  if (text.startsWith('/')) {
    return;
  }
  await handleTokenQuery(ctx, text);
});

// 错误处理
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('❌ 发生错误，请稍后再试。');
});

// 启动机器人
console.log('🚀 机器人启动中...');
bot.launch()
  .then(() => {
    console.log('✅ 机器人已成功启动！');
  })
  .catch((err) => {
    console.error('❌ 启动失败:', err);
    process.exit(1);
  });

// 优雅关闭
process.once('SIGINT', () => {
  console.log('\n🛑 正在关闭机器人...');
  bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('\n🛑 正在关闭机器人...');
  bot.stop('SIGTERM');
  process.exit(0);
});
