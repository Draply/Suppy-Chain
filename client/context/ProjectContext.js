import React, { useState, createContext, useEffect } from "react";
import ContractABI from "../constants/ContractABI.json";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const ProjectContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const ABI = ContractABI.abi;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [distributerInventory, setDistributerInventory] = useState([]);
  const [processorInventory, setProcessorInventory] = useState([]);
  const [productDistributer, setProductDistributer] = useState([]);
  const [allOwners, setAllOwners] = useState([]);
  const [isSingedIn, setIsSignedIn] = useState(false);
  const [userProfession, setUserProfession] = useState();
  const [stateChanged, setStateChanged] = useState(false);
  const [retailInventory, setRetailInventory] = useState([]);
  const [farmerInventory, setFarmerInventory] = useState([]);
  const [providerInventory, setProviderInventory] = useState([]);

  /**
   * Prompts user to connect their MetaMask wallet
   * @param {*} metamask Injected MetaMask code from the browser
   */
  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return toast.error("Please install Metamask First");

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      checkUser();

      toast.success("Wallet Connected!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Checks if MetaMask is installed and an account is connected
   * @param {*} metamask Injected MetaMask code from the browser
   * @returns
   */
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return toast.error("Please install Metamask First");

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        checkUser();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const signInUser = async (
    name,
    location,
    profession,
    walletAddress,
    contactNo,
    emailAddress
  ) => {
    try {
      if (!name || !location || !profession || !contactNo || !emailAddress) {
        toast.error("Please Provide All The Details");
      }
      await addDoc(collection(db, "users"), {
        UserName: name,
        userLocation: location,
        userProf: profession,
        userAddress: walletAddress,
        userContactNo: contactNo,
        userEmail: emailAddress,
      });
      setIsSignedIn(true);
      setUserProfession(profession);
      toast.success("Singned In!!");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const checkUser = async () => {
    try {
      if (typeof currentAccount !== "undefined") {
        const response = await getDocs(
          query(
            collection(db, "users"),
            where("userAddress", "==", currentAccount)
          )
        );
        response.forEach((user) => {
          setIsSignedIn(true);
          setUserProfession(user.data().userProf);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const load = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
    SupplyChain.on("ItemListed", () => {
      toast.success("Item Listed Successfully");
      getAllProducts();
    });
  };

  React.useEffect(() => {
    load().catch((err) => {
      console.log("Load Error", err);
    });
    return () => {};
  }, [currentAccount]);

  React.useEffect(() => {
    window.ethereum.on("accountsChanged", async () => {
      connectWallet();
    });
  }, []);

  const listProduct = async (name, quantity, category) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          console.log(name, quantity, category);

          if (!name || !quantity || !category) {
            toast.error("Please Provide All The Details");
          }

          let listTheItem = await SupplyChain.listItem(
            name,
            quantity,
            category
          );

          toast.loading("Listing Your Item...", { duration: 6000 });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllProducts = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 1; index <= tokenId; index++) {
            let getItem = await SupplyChain.getProviderListing(index);
            if (getItem.tokenId._hex > 0) {
              // setAllProducts((prev) => [getItem, ...prev]);
              prod = [getItem, ...prod];
            }
            setAllProducts(prod);
          }

          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancelProduct = async (tokenNumber) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let cancelItem = await SupplyChain.cancelItem(tokenNumber);
          toast.loading("Canceling Item", { duration: 4000 });
          SupplyChain.on("ItemCanceled", () => {
            toast.success("Item Canceled!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error("Cancel error!");
    }
  };

  const updateInfo = async (tokenNumber, newdata, newdate) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let updateListing = await SupplyChain.updateInfo(
            tokenNumber,
            newdata,
            newdate
          );
          toast.loading("Updating Infor", { duration: 4000 });
          SupplyChain.on("ItemUpdated", () => {
            toast.success("Price Update");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDistributerInventory = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 0; index <= Number(tokenId); index++) {
            let getItem = await SupplyChain.getDistributorInventory(
              Number(index)
            );
            if (getItem.tokenId._hex > 0) {
              prod = [getItem, ...prod];
            }
          }
          setDistributerInventory(prod);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getProcessorInventory = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 0; index <= Number(tokenId); index++) {
            let getItem = await SupplyChain.getProcessorInventory(
              Number(index)
            );
            if (getItem.tokenId._hex > 0) {
              prod = [getItem, ...prod];
            }
          }
          setProcessorInventory(prod);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // TODO
  const getFarmerInventory = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 0; index <= Number(tokenId); index++) {
            let getItem = await SupplyChain.getFarmerInventory(Number(index));
            if (getItem.tokenId._hex > 0) {
              prod = [getItem, ...prod];
            }
          }
          setFarmerInventory(prod);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // TODO
  const getRetailInventory = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 0; index <= Number(tokenId); index++) {
            let getItem = await SupplyChain.getRetailInventory(Number(index));
            if (getItem.tokenId._hex > 0) {
              prod = [getItem, ...prod];
            }
          }
          setRetailInventory(prod);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // TODO
  const getProviderInventory = async () => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          setIsLoading(true);

          let tokenId = await SupplyChain.getTokenId();
          let prod = [];
          for (let index = 0; index <= Number(tokenId); index++) {
            let getItem = await SupplyChain.getProviderListing(Number(index));
            if (getItem.tokenId._hex > 0) {
              prod = [getItem, ...prod];
            }
          }
          setProviderInventory(prod);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const buyProduct = async (tokenNumber) => {
  //   try {
  //     if (
  //       typeof window.ethereum !== "undefined" ||
  //       typeof window.web3 !== "undefined"
  //     ) {
  //       const { ethereum } = window;
  //       if (ethereum) {
  //         const provider = new ethers.providers.Web3Provider(ethereum);
  //         const signer = provider.getSigner();
  //         const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
  //         let token = parseInt(tokenNumber);
  //         console.log(token);

  //         toast.loading("Buying product...", { duration: 4000 });
  //         SupplyChain.on("ItemBought", () => {
  //           toast.success("Item Bought! Added to Your inventory");
  //           setStateChanged(!stateChanged);
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const purchaseProduct = async (tokenNumber, price) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          let purchaseItem = await SupplyChain.purchaseItem(tokenNumber, {
            value: price,
          });
          toast.loading("Processing Your Purchase...", { duration: 4000 });
          SupplyChain.on("ItemPurchased", () => {
            toast.success("Item Purchased!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getOwners = async (tokenNumber) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);

          let getOwners = await SupplyChain.getAllOwners(tokenNumber);
          setAllOwners(getOwners);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDistributer = async (productName) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let getDistributerProdutcs = await SupplyChain.searchDistributer(
            productName
          );
          setProductDistributer(getDistributerProdutcs);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const updateData = async (tokenNumber, data) => {
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let updateData = await SupplyChain.updateInfo(tokenNumber, data);
          toast.loading("Updating Data", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const buyItemfromprovider = async (tokenNumber) => {
    // Provider to Farmer
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let fromprovider = await SupplyChain.BuyItemfromProvider(tokenNumber);
          toast.loading("Buying ..", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const buyItemfromfamer = async (tokenNumber) => {
    //Farmer to  Processors
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let fromfarmer = await SupplyChain.buyItemfromfamer(tokenNumber);
          toast.loading("Buying ..", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const buyItemfromProcessor = async (tokenNumber) => {
    //processors to distributor
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let fromprocessor = await SupplyChain.buyItemfromProcessor(
            tokenNumber
          );
          toast.loading("Buying ..", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const buyItemfromdistributor = async (tokenNumber) => {
    //from  distributor to retailers
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let fromdistributor = await SupplyChain.buyItemfromdistributor(
            tokenNumber
          );
          toast.loading("Buying ..", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getData = async (tokenNumber) => {
    //Get data
    try {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const SupplyChain = new ethers.Contract(contractAddress, ABI, signer);
          let fromdistributor = await SupplyChain.getData(tokenNumber);

          toast.loading("Updating Data", { duration: 4000 });
          SupplyChain.on("DataUpdated", () => {
            toast.success("Data Updated!");
            setStateChanged(!stateChanged);
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    if (currentAccount) {
      getAllProducts();
      getDistributerInventory();
      getProcessorInventory();
    }
    checkUser();
  }, [currentAccount, stateChanged]);

  return (
    <ProjectContext.Provider
      value={{
        isSingedIn,
        userProfession,
        connectWallet,
        currentAccount,
        signInUser,
        listProduct,
        getAllProducts,
        allProducts,
        isLoading,
        cancelProduct,
        updateInfo,
        distributerInventory,
        productDistributer,
        getDistributer,
        purchaseProduct,
        getOwners,
        allOwners,
        //
        getProcessorInventory,
        processorInventory,
        //
        getDistributerInventory,
        distributerInventory,
        //
        getFarmerInventory,
        farmerInventory,
        //
        getRetailInventory,
        retailInventory,
        //
        getProviderInventory,
        providerInventory,
        
        buyItemfromProcessor,
        buyItemfromdistributor,
        buyItemfromprovider,
        buyItemfromfamer,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
