# 使用方法
后端:
cd backend
npm install  #如果环境配置已完成，跳过此步骤
node src/index.js


合约：
使用本地测试（anvil+metamask+remix）
anvil   #启动anvil网络
remix编译合约并使用custom网络进行部署
将合约地址复制，粘贴到frontend/.env中


前端：
cd frontend
npm install  #如果环境配置已完成，跳过此步骤
rm -rf .next  #如果需要清除缓存，可使用该指令
npm run build
npm run dev -- -p 3000