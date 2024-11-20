// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoldVerification {
    // Struct to represent a gold asset
    struct GoldAsset {
        uint256 goldId;
        uint256 weight; // in grams
        uint256 purity; // in parts per thousand (e.g., 999 for 99.9% pure)
        address currentOwner;
        address initialOwner; // Address of the first registrant
        string shopId; // ID of the shop that registered the gold
        uint256 registrationDate;
        mapping(string => string) extraData; // For additional metadata

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
    event GoldRegistered(uint256 goldId, address indexed owner, string shopId);
    event GoldTransferred(uint256 goldId, address indexed from, address indexed to);

    // Modifier to check if the caller is the owner of a specific gold asset
    modifier onlyOwner(uint256 goldId) {
        require(goldAssets[goldId].currentOwner == msg.sender, "Not the owner");
        _;
    }

    // Function to register a new gold asset
    function registerGold(
        uint256 weight,
        uint256 purity,
        string memory shopId,
        string[] memory extraKeys,
        string[] memory extraValues
    ) public {
        require(extraKeys.length == extraValues.length, "Mismatched extra data");

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

        // Add extra metadata
        for (uint256 i = 0; i < extraKeys.length; i++) {
            newGold.extraData[extraKeys[i]] = extraValues[i];
        }

        // Emit the event
        emit GoldRegistered(goldId, msg.sender, shopId);
    }

    // Function to transfer ownership of a gold asset
    function transferOwnership(uint256 goldId, address newOwner) public onlyOwner(goldId) {
        require(newOwner != address(0), "Invalid new owner");

        // Update ownership
        address previousOwner = goldAssets[goldId].currentOwner;
        goldAssets[goldId].currentOwner = newOwner;

        // Record the transfer
        goldAssets[goldId].transferHistory.push(TransferRecord({
            from: previousOwner,
            to: newOwner,
            date: block.timestamp
        }));

        // Emit the event
        emit GoldTransferred(goldId, previousOwner, newOwner);
    }

    // Function to get the details of a gold asset
    function getGoldDetails(uint256 goldId) public view returns (
        uint256, uint256, uint256, address, address, string memory, uint256
    ) {
        GoldAsset storage gold = goldAssets[goldId];
        return (
            gold.goldId,
            gold.weight,
            gold.purity,
            gold.currentOwner,
            gold.initialOwner, // Return initial owner
            gold.shopId,
            gold.registrationDate
        );
    }

    // Function to get additional metadata for a gold asset
    function getGoldExtraData(uint256 goldId, string memory key) public view returns (string memory) {
        return goldAssets[goldId].extraData[key];
    }

    // Function to get the ownership transfer history for a gold asset
    function getTransferHistory(uint256 goldId) public view returns (TransferRecord[] memory) {
        return goldAssets[goldId].transferHistory;
    }
}
