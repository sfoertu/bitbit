// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title BitbitAccessControl — Multi-sig (2/3) pause + timelock
/// @notice Kritik parametreler (komisyon, yetkili adres) timelock ile korunur
contract BitbitAccessControl {
    // ─── State ────────────────────────────────────────────────────────

    address[3] public owners;
    uint256 public constant THRESHOLD = 2;
    uint256 public constant MIN_DELAY = 1 hours;
    uint256 public constant MAX_DELAY = 72 hours;

    bool public paused;

    mapping(address => bool) public isOwner;
    mapping(bytes32 => bool) public pendingPauses;
    mapping(address => bool) public pauseSigners;

    uint256 public timelockDelay;
    mapping(bytes32 => uint256) public timelockTimestamp;
    mapping(bytes32 => bool) public timelockExists;

    // ─── Events ───────────────────────────────────────────────────────

    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event PauseRequested(address indexed owner, bytes32 indexed txHash);
    event PauseExecuted(bytes32 indexed txHash);
    event UnpauseExecuted(bytes32 indexed txHash);
    event TimelockRequested(
        bytes32 indexed txHash,
        uint256 executeAfter,
        string description
    );
    event TimelockExecuted(bytes32 indexed txHash);
    event DelayUpdated(uint256 oldDelay, uint256 newDelay);

    // ─── Errors ───────────────────────────────────────────────────────

    error NotOwner();
    error NotPaused();
    error AlreadyPaused();
    error AlreadySigned();
    error ThresholdNotMet();
    error TxAlreadyExecuted();
    error TimelockNotReady();
    error TimelockNotQueued();
    error InvalidDelay();
    error InvalidOwner();

    // ─── Modifiers ────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (!isOwner[msg.sender]) revert NotOwner();
        _;
    }

    modifier whenPaused() {
        if (!paused) revert NotPaused();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert AlreadyPaused();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────

    constructor(address[3] memory _owners, uint256 _initialDelay) {
        if (_initialDelay < MIN_DELAY || _initialDelay > MAX_DELAY) {
            revert InvalidDelay();
        }

        for (uint256 i = 0; i < 3; i++) {
            if (_owners[i] == address(0)) revert InvalidOwner();
            // Tekrarlanan adres kontrolü
            for (uint256 j = i + 1; j < 3; j++) {
                if (_owners[i] == _owners[j]) revert InvalidOwner();
            }
            owners[i] = _owners[i];
            isOwner[_owners[i]] = true;
            emit OwnerAdded(_owners[i]);
        }

        timelockDelay = _initialDelay;
    }

    // ─── Pause ────────────────────────────────────────────────────────

    /// @notice Pause imzası tetikler (2/3 gerekli)
    function requestPause() external onlyOwner whenNotPaused {
        bytes32 txHash = keccak256(abi.encodePacked("pause", msg.sender));

        if (pendingPauses[txHash]) revert AlreadySigned();
        pendingPauses[txHash] = true;
        pauseSigners[msg.sender] = true;

        emit PauseRequested(msg.sender, txHash);

        // Say — threshold'a ulaşıldı mı?
        uint256 count = 0;
        for (uint256 i = 0; i < 3; i++) {
            if (pauseSigners[owners[i]]) count++;
        }

        if (count >= THRESHOLD) {
            paused = true;

            // İmzaları temizle
            for (uint256 i = 0; i < 3; i++) {
                bytes32 h = keccak256(abi.encodePacked("pause", owners[i]));
                delete pendingPauses[h];
                pauseSigners[owners[i]] = false;
            }

            emit PauseExecuted(txHash);
        }
    }

    /// @notice Sistemi un-pause eder (herhangi bir owner)
    function unpause() external onlyOwner whenPaused {
        bytes32 txHash = keccak256(abi.encodePacked("unpause", block.timestamp));
        paused = false;
        emit UnpauseExecuted(txHash);
    }

    // ─── Timelock ─────────────────────────────────────────────────────

    /// @notice Timelock ile parametre değişikliği talep et
    /// @param txHash İşlemin benzersiz hash'i
    /// @param description Değişikliğin açıklaması
    function requestTimelockChange(
        bytes32 txHash,
        string calldata description
    ) external onlyOwner {
        if (timelockExists[txHash]) revert TxAlreadyExecuted();

        uint256 executeAfter = block.timestamp + timelockDelay;
        timelockTimestamp[txHash] = executeAfter;
        timelockExists[txHash] = true;

        emit TimelockRequested(txHash, executeAfter, description);
    }

    /// @notice Timelock süresi dolmuşsa değişikliği uygula
    function executeTimelockChange(bytes32 txHash) external onlyOwner {
        if (!timelockExists[txHash]) revert TimelockNotQueued();
        if (block.timestamp < timelockTimestamp[txHash]) revert TimelockNotReady();

        delete timelockExists[txHash];
        delete timelockTimestamp[txHash];

        emit TimelockExecuted(txHash);
    }

    /// @notice Timelock_DELAY'i güncelle (timelock ile korunmalı)
    function updateDelay(uint256 newDelay) external onlyOwner {
        if (newDelay < MIN_DELAY || newDelay > MAX_DELAY) revert InvalidDelay();

        uint256 oldDelay = timelockDelay;
        timelockDelay = newDelay;

        emit DelayUpdated(oldDelay, newDelay);
    }

    // ─── View ─────────────────────────────────────────────────────────

    function getOwners() external view returns (address[3] memory) {
        return owners;
    }

    function isTimelockReady(
        bytes32 txHash
    ) external view returns (bool) {
        return timelockExists[txHash] &&
            block.timestamp >= timelockTimestamp[txHash];
    }
}
