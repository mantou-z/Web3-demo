# 使用方法
后端:
cd backend
从.env.example复制命名为.env，如果需要ai生成文字则添加openai的api-key，如果需要在线生成图片则设置USE_AI_IMAGES=true
npm install  #如果环境配置已完成，跳过此步骤
node src/index.js


合约：(任选其一)
1.使用本地测试（anvil+metamask+remix）
anvil   #启动anvil网络
remix编译合约并使用custom网络进行部署
将合约地址复制，粘贴到frontend/.env中
2.使用avalanche fuji测试网上的合约进行交互
cd frontend
从.env.example复制命名为.env，添加WalletConnect Project ID和AlchemeSBT Contract Address


前端：
cd frontend
npm install  #如果环境配置已完成，跳过此步骤
rm -rf .next  #如果不需要清除缓存，跳过此步骤
npm run build
npm run dev -- -p 3001