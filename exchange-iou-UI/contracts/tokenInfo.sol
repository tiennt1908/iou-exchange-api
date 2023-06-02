interface IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external;
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external;
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}
contract TokenInfo{
  function getTokenInfo(address token) external view returns(string memory name, string memory symbol, uint8 decimal, uint256 totalSupply) {
    name = IERC20(token).name();
    symbol = IERC20(token).symbol();
    decimal = IERC20(token).decimals();
    totalSupply = IERC20(token).totalSupply();
    return(
      name,
      symbol,
      decimal,
      totalSupply
    );
  }
}