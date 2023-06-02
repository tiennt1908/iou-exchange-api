pragma solidity ^0.8.12;
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
contract TokenERC20{
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    address public creator;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping(address => uint256) internal balances;
    mapping(address => mapping (address => uint256)) internal allowances;

    constructor(address _creator, string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply){
      creator = _creator;
      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      mint(creator, _totalSupply);
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    function allowance(address owner, address spender) public view returns (uint256){
        return allowances[owner][spender];
    }
    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0));

        balances[from] = balances[from] - value;
        balances[to] = balances[to] + value;
        emit Transfer(from, to, value);
    }
    function transfer(address to, uint256 value) public{
        _transfer(msg.sender, to, value);
    }
    function approve(address spender, uint256 value) public{
        require(msg.sender != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }
    function transferFrom(address from, address to, uint256 amount) public{
        require(amount <= balances[from]);
        require(amount <= allowances[from][msg.sender]);
        allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
    }
    function mint(address to, uint256 amount) public{
        require(msg.sender == creator, "Only creator");
        require(to != address(0), "ERC20: mint to the zero address");

        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    function burn(uint256 amount) public{
        totalSupply -= amount;
        balances[msg.sender] -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
contract IOU{
  event CreateToken(
    address indexed token
  );
  event SupplyCollateral(
    address indexed promiseToken,
    address indexed collateralToken,
    uint256 amount
  );
  event RemoveCollateral(
    address indexed promiseToken,
    address indexed collateralToken,
    uint256 amount
  );
  event SupplyOfficialToken(
    address indexed promiseToken,
    address indexed officialToken,
    uint256 amount
  );
  event RedeemToken(
    address indexed promiseToken,
    address indexed officialToken,
    address indexed collateralToken,
    uint256 officialTokenAmount,
    uint256 collateralTokenAmount
  );
  
  uint256 public eventCount;
  mapping(uint256 => uint256) public pastEvents;//index -> block number
  
  struct User{
    uint256 totalContract;
    mapping(uint256 => address) tokenCreated;//index->contract
    mapping(address => mapping(address => uint256)) totalSupplyCollateral;//officialToken->promiseToken->Collateral
  }
  struct TokenInfo{
    address creator;
    address officialToken;
    uint256 totalSupplyOfficialToken; //1 officialToken === 1 promiseToken
    address promiseToken;
    uint256 totalSupplyPromiseToken;
    address collateralToken;
    uint256 totalSupplyCollateralToken;
    uint256 deadline; // time to pay the officialToken
    bool isPublicPool;
  }
  mapping(address => User) users;
  mapping(address => TokenInfo) tokens;//  contract promise token -> Pair

  function getTokenIou(address tokenContract) external view returns(TokenInfo memory){
    return tokens[tokenContract];
  }
  function getUserTotalContract(address user) external view returns(uint256){
    return users[user].totalContract;
  }
  function getUserTokenCreateds(address user, uint256[] memory index) external view returns(address[] memory){
    uint256 length = index.length;
    uint256 i = 0;
    address[] memory tokenCreateds = new address[](length);
    for(i = 0; i < length; i++){
      tokenCreateds[i] = users[user].tokenCreated[index[i]];
    }
    return tokenCreateds;
  }
  function getUserCollateral(address user, address officalToken, address promiseToken) external view returns(uint256){
    return users[user].totalSupplyCollateral[officalToken][promiseToken];
  }
  function createFutureToken(uint256 totalSupplyPromiseToken, uint256 deadline, address officialToken, address collateralToken, uint256 amountCollateral, bool isPublicPool) external{
    uint256 maxTotalSupplyOfficialToken = IERC20(officialToken).totalSupply();
    string memory name = string.concat(IERC20(officialToken).name(), " (IOU)");
    string memory symbol = string.concat("iou",IERC20(officialToken).symbol());
    uint8 decimal = IERC20(officialToken).decimals();

    require(totalSupplyPromiseToken <= maxTotalSupplyOfficialToken, "Fully.");
    require(totalSupplyPromiseToken > 0 ,"totalSupplyPromiseToken can't zero");
    require(amountCollateral > 0 ,"amountCollateral can't zero");
    require(officialToken != address(0) ,"officialToken can't zero");
    require(collateralToken != address(0) ,"collateralToken can't zero");
    require(deadline > block.timestamp ,"deadline must be greater than current time");

    address promiseToken = address(new TokenERC20(address(this), name, symbol, decimal, totalSupplyPromiseToken));
    tokens[promiseToken] = TokenInfo(msg.sender, officialToken, 0, promiseToken, totalSupplyPromiseToken, collateralToken, amountCollateral, deadline, isPublicPool);
    //update user
    uint256 nextTotalContract = users[msg.sender].totalContract + 1;
    users[msg.sender].totalContract = nextTotalContract;
    users[msg.sender].tokenCreated[nextTotalContract] = promiseToken;
    users[msg.sender].totalSupplyCollateral[officialToken][promiseToken] += amountCollateral;
    
    IERC20(collateralToken).transferFrom(msg.sender, address(this), amountCollateral);
    IERC20(promiseToken).transfer(msg.sender, totalSupplyPromiseToken);

    //mark event
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit CreateToken(promiseToken);
  }
  function supplyCollateral(address tokenContract, uint256 amount) external{
    TokenInfo memory tokenInfo = tokens[tokenContract];
    uint256 maxTotalSupplyOfficialToken = IERC20(tokenInfo.officialToken).totalSupply();
    uint256 promiseTokenAmount = (tokenInfo.totalSupplyPromiseToken * amount) / tokenInfo.totalSupplyCollateralToken;
    uint256 totalSupplyPromiseToken = tokenInfo.totalSupplyPromiseToken + promiseTokenAmount;
    
    require(totalSupplyPromiseToken <= maxTotalSupplyOfficialToken, "Fully.");
    require(tokenInfo.deadline > block.timestamp,"Time up");
    if(!tokenInfo.isPublicPool){
      require(tokenInfo.creator == msg.sender, "This Pool not public.");
    }
    IERC20(tokenInfo.collateralToken).transferFrom(msg.sender, address(this), amount);
    tokens[tokenContract].totalSupplyCollateralToken += amount;
    tokens[tokenContract].totalSupplyPromiseToken = totalSupplyPromiseToken;

    //user
    users[msg.sender].totalSupplyCollateral[tokenInfo.officialToken][tokenContract] += amount;
    IERC20(tokenInfo.promiseToken).mint(msg.sender, promiseTokenAmount);

    //mark event
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit SupplyCollateral(tokenContract, tokenInfo.collateralToken, amount);
  }
  function removeCollateral(address tokenContract, uint256 amount) external{
    //-totalSupplyCollateral
    TokenInfo memory tokenInfo = tokens[tokenContract];
    uint256 totalSupplyCollateral = users[msg.sender].totalSupplyCollateral[tokenInfo.officialToken][tokenContract];
    require(totalSupplyCollateral > 0 && totalSupplyCollateral >= amount, "Nothing to remove.");
    require(tokenInfo.deadline > block.timestamp,"Time up");
    if(!tokenInfo.isPublicPool){
      require(tokenInfo.creator == msg.sender, "This Pool not public.");
    }
    IERC20(tokenInfo.promiseToken).transferFrom(msg.sender, address(this), amount);
    IERC20(tokenInfo.promiseToken).burn(amount);
    
    uint256 percent = amount * 10**18 / tokenInfo.totalSupplyPromiseToken;
    uint256 collateralAmountExit = (percent * tokenInfo.totalSupplyCollateralToken) / 10**18;
    //update pool
    tokens[tokenContract].totalSupplyCollateralToken -= collateralAmountExit;
    tokens[tokenContract].totalSupplyPromiseToken -= amount;
    //user
    users[msg.sender].totalSupplyCollateral[tokenInfo.officialToken][tokenContract] -= collateralAmountExit;
    IERC20(tokenInfo.collateralToken).transfer(msg.sender, collateralAmountExit);

    //mark event
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit RemoveCollateral(tokenContract, tokenInfo.collateralToken, collateralAmountExit);
  }
  function supplyOfficialToken(address tokenContract, uint256 amount) external{
    TokenInfo memory tokenInfo = tokens[tokenContract];
    uint256 totalSupplyCollateral = users[msg.sender].totalSupplyCollateral[tokenInfo.officialToken][tokenContract];
    uint256 maxPercent = totalSupplyCollateral * 10**18 / tokenInfo.totalSupplyCollateralToken;
    uint256 maxSupplyOfficialToken = (maxPercent * tokenInfo.totalSupplyPromiseToken) / 10**18;

    uint256 percent = amount * 10**18 / tokenInfo.totalSupplyPromiseToken; 
    uint256 collateralAmountExit = (percent * tokenInfo.totalSupplyCollateralToken) / 10**18;
    require(tokenInfo.deadline > block.timestamp, "Time up.");
    require(amount <= maxSupplyOfficialToken && amount > 0, "Fully.");
    //only Supplier
    IERC20(tokenInfo.officialToken).transferFrom(msg.sender, address(this), amount);
    //update pool
    tokens[tokenContract].totalSupplyOfficialToken += amount;
    tokens[tokenContract].totalSupplyCollateralToken -= collateralAmountExit;
    //user
    users[msg.sender].totalSupplyCollateral[tokenInfo.officialToken][tokenContract] -= collateralAmountExit;
    IERC20(tokenInfo.collateralToken).transfer(msg.sender, collateralAmountExit);

    //mark event
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit SupplyOfficialToken(tokenContract, tokenInfo.officialToken, amount);
  }
  function redeem(address tokenContract, uint256 amount) external{ //promise Token
    TokenInfo memory tokenInfo = tokens[tokenContract];
    require(amount > 0 ,"Nothing to redeem.");
    require(tokenInfo.deadline < block.timestamp,"It's too early to redeem.");
    IERC20(tokenInfo.promiseToken).transferFrom(msg.sender, address(this), amount);
    IERC20(tokenInfo.promiseToken).burn(amount);
    uint256 percent = amount * 10**18 / tokenInfo.totalSupplyPromiseToken;
    uint256 collateralAmountExit = (percent * tokenInfo.totalSupplyCollateralToken) / 10**18;
    uint256 officialTokenAmountExit = (percent * tokenInfo.totalSupplyOfficialToken) / 10**18;
    //update pool
    tokens[tokenContract].totalSupplyPromiseToken -= amount;

    if(officialTokenAmountExit > 0){
      tokens[tokenContract].totalSupplyOfficialToken -= officialTokenAmountExit;
      IERC20(tokenInfo.officialToken).transfer(msg.sender, officialTokenAmountExit);
    }
    if(collateralAmountExit > 0){
      tokens[tokenContract].totalSupplyCollateralToken -= collateralAmountExit;
      IERC20(tokenInfo.collateralToken).transfer(msg.sender, collateralAmountExit);
    }

    //mark event
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit RedeemToken(tokenContract, tokenInfo.officialToken, tokenInfo.collateralToken, officialTokenAmountExit, collateralAmountExit);
  }
}