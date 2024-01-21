// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {ICreditDelegationToken} from "@aave/core-v3/contracts/interfaces/ICreditDelegationToken.sol";

contract CirqlProtocol is ERC4626, Ownable {
  // Any ERC20 token: DAI, USDC, AAVE, etc.
  IERC20 public immutable asset;
  // GHO token
  IERC20 public immutable ghoToken;
  // GHO Debt Token
  ICreditDelegationToken public immutable ghoDebtToken;
  // Aave V3 pool
  IPool public immutable pool;

  constructor(
    address _asset,
    string memory _name,
    string memory _symbol,
    address _pool,
    address _ghoDebtToken
  ) ERC4626(_asset) ERC20(_name, _symbol) {
    pool = IPool(_pool);
    ghoDebtToken = ICreditDelegationToken(_ghoDebtToken);
  }

  /**
   * @notice function to deposit assets and receive vault tokens in exchange
   * @param _assets amount of the asset token
   */
  function _deposit(uint _assets) public {
    require(_assets > 0, "Deposit less than Zero");
    shareHolders[msg.sender] = shareHolders[msg.sender] + deposit(_assets, msg.sender);

    // Approve the pool to invest the asset
    SafeERC20.safeApprove(IERC20(asset()), address(pool), _assets);
    pool.supply(asset(), _assets, address(this), 0);
  }

  /**
   * @notice Function to allow msg.sender to withdraw their deposit plus accrued interest
   * @param _shares amount of shares the user wants to convert
   * @param _receiver address of the user who will receive the assets
   */
  function _withdraw(uint _shares, address _receiver) public {
    require(_shares > 0, "withdraw must be greater than Zero");
    require(_receiver != address(0), "Zero Address");
    require(shareHolders[msg.sender] >= _shares, "Not enough shares");
    redeem(_shares, _receiver, msg.sender);
    shareHolders[msg.sender] -= _shares;

    // Withdraw from the pool
    pool.withdraw(asset(), type(uint).max, address(this));
  }

  /**
   * @notice Returns the total balance of a user
   * @param _user Address of the user
   */
  function totalAssetsOfUser(address _user) public view returns (uint256) {
    return shareHolders[_user];
  }

  function _decimalsOffset() internal pure override returns (uint8) {
    return 3;
  }

  function lend(address _borrower, uint amountInGho) external {
    // 1. Approve GHO Debt Token to spend GHO
    ghoDebtToken.approveDelegation(_borrower, amountInGho);
  }
}
