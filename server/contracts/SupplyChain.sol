// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Errors
error NotListed();
error PriceMustNotZero();
error PriceNotMet();
error NotOwner();

contract SupplyChain {
    uint256 public s_tokenIDs;
    struct Data {
        string data;
        uint256 created_at;
    }

    // State Variables
    struct Product {
        string productName;
        string barcode;
        uint256 tokenId;
        uint256 productQuantity;
        string cateory;
        address seller;
    }
    struct Owners {
        address providerAddress;
        address farmerAddress;
        address processorAddress;
        address distributerAddress;
        address retailerAddress;
    }

    // Mappings - To keep track of Products and it's owners
    // Farmers inventory - tokenId => Product
    mapping(uint256 => Data[]) public s_DataProduct;

    mapping(uint256 => Product) public s_providerinventory;

    mapping(uint256 => Product) public s_farmerInventory;
    // Distributer inventory - tokenId => Product
    mapping(uint256 => Product) public s_processorInventory;

    mapping(uint256 => Product) public s_distributerInventory;
    // Token Id to all the owners
    mapping(uint256 => Product) public s_retailerInventory;

    mapping(uint256 => Owners) public s_productOwners;
    // Product Name => List of products in distributers inventory
    // Because retailer may not know the token id
    mapping(uint256 => Product) public s_UserInventory;

    // Events - fire events on state changes
    event ItemListed(
        string indexed productName,
        string indexed barcode,
        uint256 productQuantity,
        address indexed seller,
        Data[] s_DataProduct
    );
    event ItemBought(
        string indexed productName,
        string indexed barcode,
        uint256 productQuantity,
        address indexed seller,
        Data[] s_DataProduct
    );
    event ItemCanceled(
        string indexed productName,
        string indexed barcode,
        address indexed seller,
        Data[] s_DataProduct
    );
    event ItemUpdated(
        string indexed productName,
        string indexed barcode,
        address indexed seller,
        Data[] s_DataProduct
    );
    event ItemPurchased(
        string indexed productName,
        string indexed barcode,
        uint256 productQuantity,
        address indexed seller,
        Data[] s_DataProduct
    );

    // Modifiers
    // Item not listed Yet

    // Can be called only by owner
    modifier isOwner(uint256 _tokenID) {
        Product memory product = s_providerinventory[_tokenID];
        if (product.seller != msg.sender) {
            revert NotOwner();
        }
        _;
    }

    uint randNonce = 0;

    function generateRandomString() public returns (string memory) {
        bytes memory randomBytes = new bytes(6);

        for (uint i = 0; i < 6; i++) {
            uint randomNumber = uint(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % 26;
            randNonce++;
            uint8 convertedRandomNumber = uint8(randomNumber + 65);
            randomBytes[i] = bytes1(convertedRandomNumber);
        }

        return string(randomBytes);
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function listItem(
        string memory _ProductName,
        uint256 _quantity,
        string memory _category
    ) external {
        s_tokenIDs++;
        uint256 currentID = s_tokenIDs;
        Data memory newData = Data("Item Listed", block.timestamp);
        // s_providerinventory[currentID].dataproduct.push(newData);
        string memory barcode = generateRandomString();
        s_providerinventory[currentID] = Product(
            _ProductName,
            barcode,
            currentID,
            _quantity,
            _category,
            msg.sender
        );
        s_DataProduct[currentID].push(newData);
        s_productOwners[currentID].providerAddress = msg.sender;
        emit ItemListed(
            _ProductName,
            barcode,
            _quantity,
            msg.sender,
            s_DataProduct[currentID]
        );
    }

    // Cập nhật data cho sản phẩm
    function updateInfo(
        uint256 _tokenID,
        string memory _data, uint256 _time
    ) external {
        require(  _time <= block.timestamp);
        Data memory data = Data(_data,_time); 
        s_DataProduct[_tokenID].push(data);
    }

    /// @notice Cancel the listing of a product
    /// @param _tokenID - The token id of the product to be canceled
    function cancelItem(uint256 _tokenID) external isOwner(_tokenID) {
        Product memory product = s_providerinventory[_tokenID];
        delete (s_providerinventory[_tokenID]);

        emit ItemCanceled(
            product.productName,
            product.barcode,
            product.seller,
            s_DataProduct[_tokenID]
        );
    }

    // Distributer functions
    /// @notice Buy the product from farmer and add it into distributer's inventory
    /// @param _tokenID - The token id of the product to be bought
    function buyItemfromfamer(uint256 _tokenID) external payable {
        Data memory newdata = Data(
            "Farmer trans to Processor",
            block.timestamp
        );
        s_DataProduct[_tokenID].push(newdata);

        Product memory product = s_processorInventory[_tokenID];
        delete (s_farmerInventory[_tokenID]);
        s_processorInventory[_tokenID] = Product(
            product.productName,
            product.barcode,
            product.tokenId,
            product.productQuantity,
            product.cateory,
            msg.sender
        );
        s_productOwners[_tokenID].processorAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{value: 1}("");
        require(success, "call failed");
        emit ItemBought(
            product.productName,
            product.barcode,
            product.productQuantity,
            msg.sender,
            s_DataProduct[_tokenID]
        );
    }

    function BuyItemfromProvider(uint256 _tokenID) external payable {
        Product memory product = s_providerinventory[_tokenID];

        delete (s_providerinventory[_tokenID]);
        s_farmerInventory[_tokenID] = Product(
            product.productName,
            product.barcode,
            product.tokenId,
            product.productQuantity,
            product.cateory,
            msg.sender
        );
        Data memory newdata = Data(
            "Transfer of seeds to farmers",
            block.timestamp
        );
        s_DataProduct[_tokenID].push(newdata);
        s_productOwners[_tokenID].farmerAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{value: 1}("");
        require(success, "call failed");
        emit ItemBought(
            product.productName,
            product.barcode,
            product.productQuantity,
            msg.sender,
            s_DataProduct[_tokenID]
        );
    }

    function buyItemfromProcessor(uint256 _tokenID) external payable {
        Data memory newdata = Data(
            "Processor trans to Distributor",
            block.timestamp
        );
        s_DataProduct[_tokenID].push(newdata);

        Product memory product = s_distributerInventory[_tokenID];
        delete (s_processorInventory[_tokenID]);
        s_distributerInventory[_tokenID] = Product(
            product.productName,
            product.barcode,
            product.tokenId,
            product.productQuantity,
            product.cateory,
            msg.sender
        );
        s_productOwners[_tokenID].distributerAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{value: 1}("");
        require(success, "call failed");
        emit ItemBought(
            product.productName,
            product.barcode,
            product.productQuantity,
            msg.sender,
            s_DataProduct[_tokenID]
        );
    }

    function buyItemfromdistributor(uint256 _tokenID) external payable {
        Data memory newdata = Data(
            "Distributor trans to ReTailer",
            block.timestamp
        );
        s_DataProduct[_tokenID].push(newdata);

        Product memory product = s_retailerInventory[_tokenID];
       
        delete (s_distributerInventory[_tokenID]);
        s_retailerInventory[_tokenID] = Product(
            product.productName,
            product.barcode,
            product.tokenId,
            product.productQuantity,
            product.cateory,
            msg.sender
        );
        s_productOwners[_tokenID].retailerAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{value: 1}("");
        require(success, "call failed");
        emit ItemBought(
            product.productName,
            product.barcode,
            product.productQuantity,
            msg.sender,
            s_DataProduct[_tokenID]
        );
    }

    // Retailer's Functions
    /// @notice Purchase the item from distributer
    /// @param _tokenID - The token id of the product to be bought
    function purchaseItem(uint256 _tokenID) external payable {
        Product memory product = s_distributerInventory[_tokenID];
        if (msg.value != 1) {
            revert PriceNotMet();
        }
        delete (s_distributerInventory[_tokenID]);

        s_productOwners[product.tokenId].retailerAddress = msg.sender;
        (bool success, ) = payable(product.seller).call{value: 1}("");
        require(success, "call failed");
        emit ItemPurchased(
            product.productName,
            product.barcode,
            product.productQuantity,
            msg.sender,
            s_DataProduct[_tokenID]
        );
    }

    // Getter functions

    function getProviderListing(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_providerinventory[_tokenID];
    }

    function getFarmerInventory(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_farmerInventory[_tokenID];
    }

    function getProcessorInventory(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_processorInventory[_tokenID];
    }

    function getDistributorInventory(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_distributerInventory[_tokenID];
    }

    function getRetailerInventory(
        uint256 _tokenID
    ) external view returns (Product memory) {
        return s_retailerInventory[_tokenID];
    }

    function getAllOwners(
        uint256 _tokenID
    ) external view returns (Owners memory) {
        return s_productOwners[_tokenID];
    }

    function getTokenId() external view returns (uint256) {
        return s_tokenIDs;
    }

    function getData(uint256 _tokenID) external view returns (Data[] memory) {
        return s_DataProduct[_tokenID];
    }
}