#!/bin/bash

echo "=== Growth Forge 本地部署脚本 ==="

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
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

echo ""
echo "=== 部署完成 ==="
echo "请复制上方输出的合约地址到 frontend/src/contracts/addresses.ts"
echo ""
echo "然后运行: cd frontend && npm run dev"
