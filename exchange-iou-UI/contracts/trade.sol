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
contract TradeData{
  event OrderHistory(
    uint256 indexed orderId, 
    address indexed maker,
    address indexed taker,
    address tokenIn, 
    address tokenOut, 
    uint256 tokenInAmount,
    uint256 tokenOutAmount,
    uint256 status,
    uint256 datetime
  );
  uint256 public eventCount;
  mapping(uint256 => uint256) public pastEvents;//index -> block number

  struct Order{
    uint256 id;
    address maker;
    address tokenIn;
    address tokenOut;
    uint256 tokenInAmount;
    uint256 tokenOutAmount; //promise
    uint256 tokenInAmountSold;
    uint256 createAt;
    uint256 status; //0 - null 1 - Open 2 - Completed 3 - cancel
  }
  uint256 lastOrderId;
  mapping(uint256 => Order) orders;
  
  uint256 maxOrder = 50;// 50/pair
  mapping(address => mapping(address => mapping(address => mapping(uint256 => uint256)))) myOpenOrders; // user address -> tokenIN/tokenOUT->index->orderId

}
contract Trade is TradeData{
  function emitOrderHistoryEvent(uint256 orderId, address maker, address taker, address tokenIn, address tokenOut, uint256 tokenInAmount, uint256 tokenOutAmount, uint256 status) internal{
    uint256 nextEventId = eventCount + 1;
    eventCount = nextEventId;
    pastEvents[nextEventId] = block.number;
    emit OrderHistory(orderId, maker, taker, tokenIn, tokenOut, tokenInAmount, tokenOutAmount, status, block.timestamp);
  }
  function setOrder(address tokenIn, address tokenOut, uint256 tokenInAmount, uint256 tokenOutAmount, uint256 orderIndex) external{
    Order memory order = orders[myOpenOrders[msg.sender][tokenIn][tokenOut][orderIndex]];

    require(orderIndex <= maxOrder, "out of range");
    require(order.status != 1, "Order is opening");
    require(tokenIn != tokenOut, "tokenIn != tokenOut");
    require(tokenInAmount > 0, "tokenInAmount > 0");

    IERC20(tokenIn).transferFrom(msg.sender, address(this), tokenInAmount);
    uint256 nextId = lastOrderId + 1;
    lastOrderId = nextId;
    orders[nextId] = Order(nextId, msg.sender, tokenIn, tokenOut, tokenInAmount, tokenOutAmount, 0, block.timestamp, 1);

    //update users order
    myOpenOrders[msg.sender][tokenIn][tokenOut][orderIndex] = nextId;

    emitOrderHistoryEvent(nextId, msg.sender, address(0), tokenIn, tokenOut, tokenInAmount, tokenOutAmount, 1);
  }
  function buy(uint256 orderId, uint256 amount) public{
    Order memory order = orders[orderId];
    require(amount > 0, "amount > 0");
    require(order.status == 1, "order close");
    uint256 remainAmount = order.tokenInAmount - order.tokenInAmountSold;
    uint256 amountPayable = 0;
    uint256 matchAmount = amount;
    
    if(amount >= remainAmount){
      matchAmount = remainAmount;
      orders[orderId].status = 2;
    }
    
    amountPayable = matchAmount * order.tokenOutAmount / order.tokenInAmount;
    orders[orderId].tokenInAmountSold += amount;
    IERC20(order.tokenOut).transferFrom(msg.sender, order.maker, amountPayable);
    
    emitOrderHistoryEvent(orderId, order.maker, msg.sender, order.tokenIn, order.tokenOut, order.tokenInAmount, order.tokenOutAmount, 2);
  }
  function cancel(uint256 orderId) public{
    Order memory order = orders[orderId];
    require(order.status == 1, "order close");
    require(order.maker == msg.sender, "Not owner");
    orders[orderId].status = 3;
    uint256 tokenOut = order.tokenInAmount - order.tokenInAmountSold;
    IERC20(order.tokenIn).transfer(order.maker, tokenOut);

    emitOrderHistoryEvent(orderId, address(0), address(0), address(0), address(0), 0, 0, 3);
  }
  
  function buyByOrderIds(uint256[] memory ids, uint256[] memory amounts) external{
    uint256 length = ids.length;
    uint256 i = 0;
    require(length == amounts.length, "Error length.");
    for(i = 0; i < length; i++){
      buy(ids[i], amounts[i]);
    }
  }
  function cancelByOrderIds(uint256[] memory ids) external{
    uint256 length = ids.length;
    uint256 i = 0;
    for(i = 0; i < length; i++){
      cancel(ids[i]);
    }
  }

  function getMyOpenOrderIds(address user, address tokenIn, address tokenOut, uint256[] memory index) external view returns(uint256[] memory){
    uint256 length = index.length;
    uint256 i = 0;
    uint256[] memory orderIds = new uint256[](length);
    for(i = 0; i < length; i++){
      orderIds[i] = myOpenOrders[user][tokenIn][tokenOut][index[i]];
    }
    return orderIds;
  }
  function getOrderById(uint256 id) external view returns(Order memory){
    return orders[id];
  }
  function getOrderByIds(uint256[] memory ids) external view returns(Order[] memory){
    uint256 length = ids.length;
    uint256 i = 0;
    Order[] memory listOrder = new Order[](length);
    for(i = 0; i < length; i++){
      listOrder[i] = orders[ids[i]];
    }
    return listOrder;
  }
}