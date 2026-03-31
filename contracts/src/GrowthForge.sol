// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./OreNFT.sol";
import "./CardNFT.sol";

contract GrowthForge is Ownable {
    enum GoalStatus {
        Active,     // 进行中
        Completed,  // 已完成
        Abandoned   // 已放弃
    }

    enum GoalCategory {
        Learning,  // 学习
        Fitness,   // 健身
        Creation,  // 创作
        Social     // 社交
    }

    struct Goal {
        uint256 goalId;
        string name;
        string description;
        GoalCategory category;
        OreNFT.OreType oreType;
        uint256 createdAt;
        GoalStatus status;
        uint256 totalOres;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastRecordTime;
    }

    OreNFT public oreNFT;
    CardNFT public cardNFT;

    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;
    uint256 private goalIdCounter;

    event GoalCreated(
        uint256 indexed goalId,
        address indexed owner_,
        string name,
        GoalCategory category
    );

    event OreMinted(
        uint256 indexed goalId,
        uint256 indexed oreTokenId,
        uint8 quality,
        uint256 streak
    );

    event CardForged(
        uint256 indexed cardId,
        address indexed owner_
    );

    constructor(address _oreNFT, address _cardNFT) Ownable(msg.sender) {
        oreNFT = OreNFT(_oreNFT);
        cardNFT = CardNFT(_cardNFT);

        oreNFT.setForgeEngine(address(this));
        cardNFT.setForgeEngine(address(this));
    }

    function createGoal(
        string calldata _name,
        string calldata _description,
        GoalCategory _category
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name required");

        goalIdCounter++;
        uint256 newGoalId = goalIdCounter;

        OreNFT.OreType oreType = _getOreType(_category);

        goals[newGoalId] = Goal({
            goalId: newGoalId,
            name: _name,
            description: _description,
            category: _category,
            oreType: oreType,
            createdAt: block.timestamp,
            status: GoalStatus.Active,
            totalOres: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastRecordTime: 0
        });

        userGoals[msg.sender].push(newGoalId);

        emit GoalCreated(newGoalId, msg.sender, _name, _category);
        return newGoalId;
    }

    function recordDaily(
        uint256 _goalId,
        string calldata _contentHash,
        uint8 _quality
    ) external returns (uint256) {
        Goal storage goal = goals[_goalId];
        require(goal.goalId != 0, "Goal not found");
        require(goal.status == GoalStatus.Active, "Goal not active");

        // 计算连续天数
        uint256 newStreak = _calculateStreak(goal.lastRecordTime, goal.currentStreak);

        // 更新目标状态
        goal.totalOres++;
        goal.currentStreak = newStreak;
        goal.lastRecordTime = block.timestamp;
        if (newStreak > goal.longestStreak) {
            goal.longestStreak = newStreak;
        }

        // 铸造矿石NFT
        uint256 oreTokenId = oreNFT.mintOre(
            msg.sender,
            _goalId,
            goal.oreType,
            _quality,
            _contentHash,
            newStreak
        );

        emit OreMinted(_goalId, oreTokenId, _quality, newStreak);
        return oreTokenId;
    }

    function forgeBasicCard(
        uint256[] calldata _oreIds,
        OreNFT.OreType _expectedType
    ) external returns (uint256) {
        require(_oreIds.length >= 5, "Need at least 5 ores");

        // 验证所有矿石属于同一类型且属于调用者
        for (uint256 i = 0; i < _oreIds.length; i++) {
            require(oreNFT.ownerOf(_oreIds[i]) == msg.sender, "Not ore owner");
            OreNFT.OreMemory ore = oreNFT.getOre(_oreIds[i]);
            require(ore.oreType == _expectedType, "Ore type mismatch");
        }

        // 锻造卡片
        uint256 cardId = cardNFT.forgeCard(
            msg.sender,
            CardNFT.CardRarity.Basic,
            CardNFT.OreType(_expectedType),
            _oreIds
        );

        emit CardForged(cardId, msg.sender);
        return cardId;
    }

    function getUserGoals(address _user) external view returns (uint256[] memory) {
        return userGoals[_user];
    }

    function getGoal(uint256 _goalId) external view returns (Goal memory) {
        require(goals[_goalId].goalId != 0, "Goal not found");
        return goals[_goalId];
    }

    function _getOreType(GoalCategory _category) internal pure returns (OreNFT.OreType) {
        if (_category == GoalCategory.Learning) return OreNFT.OreType.Wisdom;
        if (_category == GoalCategory.Fitness) return OreNFT.OreType.Will;
        if (_category == GoalCategory.Creation) return OreNFT.OreType.Creation;
        return OreNFT.OreType.Connection;
    }

    function _calculateStreak(
        uint256 _lastRecordTime,
        uint256 _currentStreak
    ) internal view returns (uint256) {
        if (_lastRecordTime == 0) {
            return 1; // 第一次记录
        }

        uint256 secondsInDay = 24 * 60 * 60;
        uint256 daysSinceLastRecord = (block.timestamp - _lastRecordTime) / secondsInDay;

        if (daysSinceLastRecord <= 1) {
            return _currentStreak + 1; // 连续或当天
        } else {
            return 1; // 断签，重新开始
        }
    }
}
