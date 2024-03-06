// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./base/SuperTokenBase.sol";

contract Dallor is SuperTokenBase, Ownable {
	/// @notice Thrown when supply limit would be exceeded
	error SupplyCapped();

	/// @notice supply cap
	uint256 public maxSupply;

	/// @notice Address to pay from
	address public addressToPay;

	/// @notice User payment information
	struct UserToPay {
		address publicAddress;
		uint256 id;
		uint256 pendingPayment;
		uint256 dallorBalance;
	}

	/// @notice Initializes the super token only once IF it does not exceed supply cap
	/// @param factory Super Token factory for initialization
	/// @param name Name of Super Token
	/// @param symbol Symbol of Super Token
	/// @param _maxSupply Immutable max supply
	/// @param _addressToPay Address from which payments are made
	function initialize(
		address factory,
		string memory name,
		string memory symbol,
		uint256 _maxSupply,
		address _addressToPay
	) external {
		_initialize(factory, name, symbol);
		maxSupply = _maxSupply;
		addressToPay = _addressToPay;
		_mint(addressToPay, 100000 * 10 ** 18, "");
	}

	/// @notice Mints tokens to recipient if caller is the minter AND max supply will not be exceeded
	/// @param amount amount of tokens to mint
	function mint(uint256 amount) public onlyOwner {
		if (_totalSupply() + amount > maxSupply) revert SupplyCapped();
		_mint(addressToPay, amount, "");
	}

	/// @notice Burns tokens from caller
	/// @param amount amount of tokens to burn
	/// @param userData optional user data for IERC777Sender callbacks
	function burn(uint256 amount, bytes memory userData) public {
		_burn(msg.sender, amount, userData);
	}

	/// @notice Transfers tokens from addressToPay to another address
	/// @param to Recipient of the tokens
	/// @param amount Amount of tokens to transfer
	function transferFromAddressToPay(
		address to,
		uint256 amount
	) public onlyOwner {
		_transferFrom(addressToPay, owner(), to, amount);
	}

	/// @notice Pays users according to their pending payments
	/// @param userToPayList Array of users to pay
	function payUsers(UserToPay[] memory userToPayList) public onlyOwner {
		for (uint256 i = 0; i < userToPayList.length; i++) {
			transferFromAddressToPay(
				userToPayList[i].publicAddress,
				userToPayList[i].pendingPayment
			);
		}
	}
}
