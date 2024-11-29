// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoldVerification {
    // Struct to represent a gold asset
    struct GoldAsset {
        uint256 goldId;
        uint16 weight; // in grams, maximum 99999 grams
        uint8 purity; // in percentage, 0 - 100
        address currentOwner;
        address initialOwner; // Address of the first registrant
        bytes15 shopId; // PAN string
        uint256 registrationDate;
        bytes3 goldType; // Type of gold (e.g., 24K, 22K)
        bytes1 bisHallmark; // BIS Hallmark, 1-byte alphanumeric code
        // Array to hold ownership transfer details
        TransferRecord[] transferHistory;
    }

    // Struct to represent ownership transfer details
    struct TransferRecord {
        address from;
        address to;
        uint256 date; // timestamp of the transfer
    }

    // Mapping from goldId to GoldAsset
    mapping(uint256 => GoldAsset) public goldAssets;

    // Counter for generating unique gold IDs
    uint256 public goldCounter;

    // Events
    event GoldRegistered(uint256 goldId, address indexed owner, bytes15 shopId);
    event GoldTransferred(uint256 goldId, address indexed from, address indexed to);

    // Function to register a new gold asset
    function registerGold(
        uint16 weight,
        uint8 purity,
        bytes15 shopId,
        bytes3 goldType,
        bytes1 bisHallmark
    ) public {
        // Generate a unique ID for the gold asset
        uint256 goldId = uint256(keccak256(abi.encodePacked(block.timestamp, goldCounter, shopId)));
        goldCounter++;

        // Create the GoldAsset struct
        GoldAsset storage newGold = goldAssets[goldId];
        newGold.goldId = goldId;
        newGold.weight = weight;
        newGold.purity = purity;
        newGold.currentOwner = msg.sender;
        newGold.initialOwner = msg.sender; // Set initial owner
        newGold.shopId = shopId;
        newGold.registrationDate = block.timestamp;
        newGold.goldType = goldType;
        newGold.bisHallmark = bisHallmark;

        // Emit the event
        emit GoldRegistered(goldId, msg.sender, shopId);
    }

    // Function to transfer ownership of a gold asset
    function transferOwnership(uint256 goldId, address newOwner) public {
        GoldAsset storage gold = goldAssets[goldId];
        require(msg.sender == gold.currentOwner, "Only the current owner can transfer ownership");
        gold.transferHistory.push(TransferRecord({
            from: gold.currentOwner,
            to: newOwner,
            date: block.timestamp
        }));
        gold.currentOwner = newOwner;
        emit GoldTransferred(goldId, msg.sender, newOwner);
    }

    // Function to get the details of a gold asset
    function getGoldDetails(uint256 goldId) public view returns (
        uint256, uint16, uint8, address, address, bytes15, uint256, bytes3, bytes1
    ) {
        GoldAsset storage gold = goldAssets[goldId];
        return (
            gold.goldId,
            gold.weight,
            gold.purity,
            gold.currentOwner,
            gold.initialOwner, // Return initial owner
            gold.shopId,
            gold.registrationDate,
            gold.goldType,
            gold.bisHallmark
        );
    }

    // Function to get the ownership transfer history for a gold asset
    function getTransferHistory(uint256 goldId) public view returns (TransferRecord[] memory) {
        return goldAssets[goldId].transferHistory;
    }

    // Modifier to check if the caller is the owner of a specific gold asset
    modifier onlyOwner(uint256 goldId) {
        require(goldAssets[goldId].currentOwner == msg.sender, "Not the owner");
        _;
    }
}
