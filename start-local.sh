#!/bin/bash

echo "=== Alcheme 本地部署脚本 ==="

# 检查是否安装了依赖
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
    echo "安装根目录依赖..."
    npm install
fi

# 启动后端服务
echo "启动后端服务..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
fi
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 检查 anvil 是否在运行
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Anvil 已在运行"
else
    echo "启动 Anvil..."
    anvil &
    ANVIL_PID=$!
    sleep 2
fi

# 部署合约
echo "部署合约..."
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

cd ..

echo ""
echo "=== 部署完成 ==="
echo ""
echo "服务已启动："
echo "- 后端: http://localhost:3001"
echo "- Anvil: http://127.0.0.1:8545"
echo ""
echo "请复制合约地址，然后运行前端："
echo "  cd frontend && npm run dev"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap "kill $BACKEND_PID $ANVIL_PID 2>/dev/null; exit" SIGINT SIGTERM

# 保持脚本运行
wait
