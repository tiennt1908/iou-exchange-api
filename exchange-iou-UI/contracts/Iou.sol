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
  struct User{
    uint256 totalPair;
    mapping(uint256 => uint256) pairID;//index->pairID
    mapping(address => mapping(uint256 => uint256)) totalSupplyCollateral;//officialToken->PairId->Collateral
  }
  struct Pair{
    address creator;
    uint256 id;
    address officialToken;
    uint256 totalSupplyOfficialToken; //1 officialToken === 1 promiseToken
    address promiseToken;
    uint256 totalSupplyPromiseToken;
    address collateralToken;
    uint256 totalSupplyCollateralToken;
    uint256 deadline; // time to pay the officialToken
    bool isPublicPool;
  }
  uint256 lastPairID;
  mapping(address => User) users;
  mapping(uint256 => Pair) pairs;//  id -> Pair

  function getPairById(uint256 id) external view returns(Pair memory){
    return pairs[id];
  }
  function getUserTotalPair(address user) external view returns(uint256){
    return users[user].totalPair;
  }
  function getUserPairIDs(address user, uint256[] memory index) external view returns(uint256[] memory){
    uint256 length = index.length;
    uint256 i = 0;
    uint256[] memory ids = new uint256[](length);
    for(i = 0; i < length; i++){
      ids[i] = users[user].pairID[index[i]];
    }
    return ids;
  }
  function getTotalSupplyCollateral(address user, address token, uint256 pairID) external view returns(uint256){
    return users[user].totalSupplyCollateral[token][pairID];
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
    uint256 nextPairID = lastPairID + 1;
    lastPairID = nextPairID;
    pairs[nextPairID] = Pair(msg.sender, nextPairID, officialToken, 0, promiseToken, totalSupplyPromiseToken, collateralToken, amountCollateral, deadline, isPublicPool);
    //update user
    uint256 nextTotalPair = users[msg.sender].totalPair + 1;
    users[msg.sender].totalPair = nextTotalPair;
    users[msg.sender].pairID[nextTotalPair] = nextPairID;
    users[msg.sender].totalSupplyCollateral[officialToken][nextPairID] += amountCollateral;
    
    IERC20(collateralToken).transferFrom(msg.sender, address(this), amountCollateral);
    IERC20(promiseToken).transfer(msg.sender, totalSupplyPromiseToken);
  }
  function supplyCollateral(uint256 pairID, uint256 amount) external{
    Pair memory pair = pairs[pairID];
    uint256 maxTotalSupplyOfficialToken = IERC20(pair.officialToken).totalSupply();
    uint256 promiseTokenAmount = (pair.totalSupplyPromiseToken * amount) / pair.totalSupplyCollateralToken;
    uint256 totalSupplyPromiseToken = pairs[pairID].totalSupplyPromiseToken + promiseTokenAmount;
    
    require(totalSupplyPromiseToken <= maxTotalSupplyOfficialToken, "Fully.");
    require(pair.deadline > block.timestamp,"Time up");
    if(!pair.isPublicPool){
      require(pair.creator == msg.sender, "This Pool not public.");
    }
    IERC20(pair.collateralToken).transferFrom(msg.sender, address(this), amount);
    pairs[pairID].totalSupplyCollateralToken += amount;
    pairs[pairID].totalSupplyPromiseToken = totalSupplyPromiseToken;

    //user
    users[msg.sender].totalSupplyCollateral[pair.officialToken][pairID] += amount;
    IERC20(pair.promiseToken).mint(msg.sender, promiseTokenAmount);
  }
  function removeCollateral(uint256 pairID, uint256 amount) external{
    //-totalSupplyCollateral
    Pair memory pair = pairs[pairID];
    uint256 totalSupplyCollateral = users[msg.sender].totalSupplyCollateral[pair.officialToken][pairID];
    require(totalSupplyCollateral > 0 && totalSupplyCollateral <= amount, "Nothing to remove.");
    require(pair.deadline > block.timestamp,"Time up");
    if(!pair.isPublicPool){
      require(pair.creator == msg.sender, "This Pool not public.");
    }
    IERC20(pair.promiseToken).transferFrom(msg.sender, address(this), amount);
    IERC20(pair.promiseToken).burn(amount);
    
    uint256 percent = amount * 10**18 / pair.totalSupplyPromiseToken;
    uint256 collateralAmountExit = (percent * pair.totalSupplyCollateralToken) / 10**18;
    //update pool
    pairs[pairID].totalSupplyCollateralToken -= collateralAmountExit;
    pairs[pairID].totalSupplyPromiseToken -= amount;
    //user
    users[msg.sender].totalSupplyCollateral[pair.officialToken][pairID] -= collateralAmountExit;
    IERC20(pair.collateralToken).transfer(msg.sender, collateralAmountExit);
  }
  function supplyOfficialToken(uint256 pairID, uint256 amount) external{
    Pair memory pair = pairs[pairID];
    uint256 totalSupplyCollateral = users[msg.sender].totalSupplyCollateral[pair.officialToken][pairID];
    uint256 maxPercent = totalSupplyCollateral * 10**18 / pair.totalSupplyCollateralToken;
    uint256 maxSupplyOfficialToken = (maxPercent * pair.totalSupplyPromiseToken) / 10**18;

    uint256 percent = amount * 10**18 / pair.totalSupplyPromiseToken; 
    uint256 collateralAmountExit = (percent * pair.totalSupplyCollateralToken) / 10**18;
    require(pair.deadline > block.timestamp, "Time up.");
    require(amount <= maxSupplyOfficialToken && amount > 0, "Fully.");
    //only Supplier
    IERC20(pair.officialToken).transferFrom(msg.sender, address(this), amount);
    //update pool
    pairs[pairID].totalSupplyOfficialToken += amount;
    pairs[pairID].totalSupplyCollateralToken -= collateralAmountExit;
    //user
    users[msg.sender].totalSupplyCollateral[pair.officialToken][pairID] -= collateralAmountExit;
    IERC20(pair.collateralToken).transfer(msg.sender, collateralAmountExit);
  }
  function redeem(uint256 pairID, uint256 amount) external{ //promise Token
    Pair memory pair = pairs[pairID];
    require(amount > 0 ,"Nothing to redeem.");
    require(pair.deadline < block.timestamp,"It's too early to redeem.");
    IERC20(pair.promiseToken).transferFrom(msg.sender, address(this), amount);
    IERC20(pair.promiseToken).burn(amount);
    uint256 percent = amount * 10**18 / pair.totalSupplyPromiseToken;
    uint256 collateralAmountExit = (percent * pair.totalSupplyCollateralToken) / 10**18;
    uint256 officialTokenAmountExit = (percent * pair.totalSupplyOfficialToken) / 10**18;
    //update pool
    pairs[pairID].totalSupplyPromiseToken -= amount;

    if(officialTokenAmountExit > 0){
      pairs[pairID].totalSupplyOfficialToken -= officialTokenAmountExit;
      IERC20(pair.officialToken).transfer(msg.sender, officialTokenAmountExit);
    }
    if(collateralAmountExit > 0){
      pairs[pairID].totalSupplyCollateralToken -= collateralAmountExit;
      IERC20(pair.collateralToken).transfer(msg.sender, collateralAmountExit);
    }
  }
}