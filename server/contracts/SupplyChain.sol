// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Errors
error NotListed();
error PriceMustNotZero();
error PriceNotMet();
error NotOwner();

contract SupplyChain {
    uint256 public s_tokenIDs;
    struct Data{
        string data;
        uint256 created_at;
    }
    // State Variables
    struct Product {
        string productName;
        uint256 tokenId;
        uint256 productQuantity;
        uint256 productPrice;
        string cateory;
        address seller;
        Data[] DataProduct;
    }
    struct Owners {
        address farmerAddress;
        address distributerAddress;
        address retailerAddress;
    }

    // Mappings - To keep track of Products and it's owners
    // Farmers inventory - tokenId => Product
    mapping(uint256 => Product) public s_farmerInventory;
    // Distributer inventory - tokenId => Product
    mapping(uint256 => Product) public s_distributerInventory;
    // Token Id to all the owners
    mapping(uint256 => Owners) public s_productOwners;
    // Product Name => List of products in distributers inventory
    // Because retailer may not know the token id
    mapping(string => Product) public s_productDistributer;

    mapping(uint256 =>Product) public s_UserInventory;

    mapping(uint256 => Data[]) public DataProduct;

    // Events - fire events on state changes
    event ItemListed(
        string indexed productName,
        uint256 indexed tokenId,
        uint256 productQuantity,
        uint256 productPrice,
        address indexed seller,
        Data[] DataProduct

    );
    event ItemBought(
        string indexed productName,
        uint256 indexed tokenId,
        uint256 productQuantity,
        uint256 productPrice,
        address indexed seller,
        Data[] DataProduct
    );
    event ItemCanceled(
        string indexed productName,
        uint256 indexed tokenId,
        address indexed seller,
        Data[] DataProduct
    );
    event ItemUpdated(
        string indexed productName,
        uint256 indexed tokenId,
        address indexed seller,
        Data[] DataProduct
    );
    event ItemPurchased(
        string indexed productName,
        uint256 indexed tokenId,
        uint256 productQuantity,
        uint256 productPrice,
        address indexed seller,
        Data[] DataProduct
    );

    // Modifiers
    // Item not listed Yet
    modifier notListed(uint256 _tokenID) {
        Product memory product = s_farmerInventory[_tokenID];
        if (product.productPrice < 0) {
            revert NotListed();
        }
        _;
    }

    // Can be called only by owner
    modifier isOwner(uint256 _tokenID) {
        Product memory product = s_farmerInventory[_tokenID];
        if (product.seller != msg.sender) {
            revert NotOwner();
        }
        _;
    }
    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }
    // Functions
    /// @notice List the product details on the marketplace
    /// @param _ProductName - Name of the product
    /// @param _quantity - Quantity of product to be sold
    /// @param _price price of the product to be sold
    function listItem(
        string memory _ProductName,
        uint256 _quantity,
        uint256 _price,
        string memory _category
    ) external {
        if (_price <= 0) {
            revert PriceMustNotZero();
        }
        s_tokenIDs++;
        uint256 currentID = s_tokenIDs;
        Data memory newData = Data("Item Listed",block.timestamp);
        DataProduct[currentID].push(newData);
        s_farmerInventory[currentID] = Product(
            _ProductName,
            currentID,
            _quantity,
            _price,
            _category,
            msg.sender,
            DataProduct[currentID]

        );
        s_productOwners[currentID].farmerAddress = msg.sender;
        emit ItemListed(_ProductName, currentID, _quantity, _price, msg.sender,DataProduct[currentID]);
    }

    /// @notice Update the price of an already listed product
    /// @param _tokenID - The token id of the product to be updated
    /// @param _newPrice - The price to which you want to update it.
    function updateListing(
        uint256 _tokenID,
        uint256 _newPrice
    ) external notListed(_tokenID) isOwner(_tokenID) {
        s_farmerInventory[_tokenID].productPrice = _newPrice;
        Data memory newData = Data("Item Update Price",block.timestamp);
        DataProduct[_tokenID].push(newData);

    }
    function updateInfo(
        uint256 _tokenID,
        Data memory _data
    ) external notListed(_tokenID) isOwner(_tokenID){
        require(_data.created_at <= block.timestamp);
        DataProduct[_tokenID].push(_data);
    }

    /// @notice Cancel the listing of a product
    /// @param _tokenID - The token id of the product to be canceled
    function cancelItem(
        uint256 _tokenID
    ) external notListed(_tokenID) isOwner(_tokenID) {
        Product memory product = s_farmerInventory[_tokenID];
        delete (s_farmerInventory[_tokenID]);
        
        emit ItemCanceled(product.productName, _tokenID, product.seller,DataProduct[_tokenID]);
    }

    // Distributer functions
    /// @notice Buy the product from farmer and add it into distributer's inventory
    /// @param _tokenID - The token id of the product to be bought
    function buyItem(uint256 _tokenID) external payable notListed(_tokenID) {
        Product memory product = s_farmerInventory[_tokenID];
        if (msg.value != product.productPrice) {
            revert PriceNotMet();
        }
        delete (s_farmerInventory[_tokenID]);
        uint256 newPrice = (product.productPrice +
            (product.productPrice * 20) /
            100);
        s_distributerInventory[_tokenID] = Product(
            product.productName,
            product.tokenId,
            product.productQuantity,
            newPrice,
            product.cateory,
            msg.sender,
            product.DataProduct
        );
        s_productOwners[product.tokenId].distributerAddress = msg.sender;
        s_productDistributer[product.productName] = Product(
            product.productName,
            product.tokenId,
            product.productQuantity,
            newPrice,
            product.cateory,
            msg.sender,
            product.DataProduct
        );
        (bool success, ) = payable(product.seller).call{
            value: product.productPrice
        }("");
        require(success, "call failed");
        emit ItemBought(
            product.productName,
            product.tokenId,
            product.productQuantity,
            newPrice,
            msg.sender,
            product.DataProduct
        );
    }

    // Retailer's Functions
    /// @notice Purchase the item from distributer
    /// @param _tokenID - The token id of the product to be bought
    function purchaseItem(uint256 _tokenID) external payable {
        Product memory product = s_distributerInventory[_tokenID];
        if (product.productPrice < 0) {
            revert NotListed();
        }
        if (msg.value != product.productPrice) {
            revert PriceNotMet();
        }
        delete (s_distributerInventory[_tokenID]);
        delete (s_productDistributer[product.productName]);
        s_productOwners[product.tokenId].retailerAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{
            value: product.productPrice
        }("");
        require(success, "call failed");
        emit ItemPurchased(
            product.productName,
            product.tokenId,
            product.productQuantity,
            product.productPrice,
            msg.sender,
            product.DataProduct
        );
    }

    // Getter functions

    function getFarmersListing(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_farmerInventory[_tokenID];
    }

    function getDistributerInventory(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_distributerInventory[_tokenID];
    }

    function getAllOwners(
        uint256 _tokenID
    ) external view returns (Owners memory) {
        return s_productOwners[_tokenID];
    }

    function searchDistributer(
        string memory _productName
    ) external view returns (Product memory) {
        return s_productDistributer[_productName];
    }

    function getTokenId() external view returns (uint256) {
        return s_tokenIDs;
    }
}
