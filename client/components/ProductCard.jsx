import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import { MdClose, MdContentCopy } from "react-icons/md";
import { ProjectContext } from "../context/ProjectContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    padding: "0 0 0 0",
    zIndex: "100",
  },
};

export default function ProductCard({
  name,
  tokenID,
  quantity,
  Category,
  Seller,

}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [sellerAddress, setSellerAddress] = useState();
  const {
    currentAccount,
    cancelProduct,
    updateInfo,
    buyProduct,
    purchaseProduct,
    userProfession,
  } = useContext(ProjectContext);

  useEffect(() => {
    if (currentAccount === Seller.toLowerCase()) {
      setSellerAddress("You");
    } else {
      let seller = Seller.slice(0, 5) + "..." + Seller.slice(38, 42);
      setSellerAddress(seller);
    }
  }, [currentAccount]);

  const handleCancel = () => {
    cancelProduct(tokenID);
    setModalIsOpen(!modalIsOpen);
  };

  const handleUpdate = (data) => {
    // updateProduct(tokenID, newPrice);

    if (date && data) {

      const _date = new Date(date)

      updateInfo(tokenID, data, Math.round(_date.getTime() / 1000))
      setModalIsOpen(!modalIsOpen);
    }
  };

  const handleBuying = () => {
    buyProduct(tokenID);
    setModalIsOpen(!modalIsOpen);
  };

  const handlePurchase = () => {
    purchaseProduct(tokenID);
    setModalIsOpen(!modalIsOpen);
  };

  const [info, setInfo] = React.useState('')
  const [date, setDate] = React.useState('')

  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div className="flex flex-col items-center w-full px-12 bg-white border-2 border-gray-200 rounded shadow-md py-14 text-blac ">
          <div className="flex flex-col items-start w-full mb-2">
            <MdClose
              onClick={() => setModalIsOpen(!modalIsOpen)}
              className="absolute cursor-pointer top-4 right-6"
              size={24}
            />

            <h1 className="mb-8 text-3xl font-bold text-center uppercase ">
              product details
            </h1>

            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Name : {name.toUpperCase()}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Id : {tokenID}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Category : {Category.toUpperCase()}
            </div>
            <p className="block mb-6 font-medium text-gray-900 text-md">
              Total Quantity : {quantity} Kg
            </p>
            <div className="flex items-start justify-center mb-6 font-medium text-gray-900 text-md">
              Owned By :{" "}
              {currentAccount.toLowerCase() === Seller.toLowerCase() ? (
                "You"
              ) : (
                <div className="ml-1">{sellerAddress}</div>
              )}
            </div>
            <div>
              <div className="flex items-start justify-center mb-6 font-medium text-gray-900 text-md">

              </div>
            </div>
          </div>
          {currentAccount === Seller.toLowerCase() ? (
            <div className="w-full ">
              <div className="w-full mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Update Infor
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:border-gray-700"
                  type="text"
                  placeholder="Enter information"
                  onChange={(e) => setInfo(e.target.value)}
                />
                <input
                  className="w-full px-3 py-2 leading-tight my-2.5 text-gray-700 border rounded shadow appearance-none focus:outline-none focus:border-gray-700"
                  type="datetime-local"
                  placeholder="Enter time"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between w-2/6 md:w-full">
                <button
                  className="flex items-center justify-center px-8 py-2 font-semibold text-white uppercase bg-red-500 rounded-full cursor-pointer hover:bg-red-900 focus:outline-none focus:shadow-outline"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center justify-center px-8 py-2 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    handleUpdate(info)
                  }}
                >
                  update
                </button>
              </div>
            </div>
          ) : userProfession == "distributer" ? (
            <div>
              <button
                className={`${currentAccount?.toLowerCase() !== Seller.toLowerCase() ? 'flex' : 'hidden'} items-center justify-center px-8 py-2 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 focus:outline-none focus:shadow-outline`}
                onClick={handleBuying}
              >
                buy
              </button>
            </div>
          ) : (
            <div
              className="items-center justify-center hidden px-8 py-2 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 focus:outline-none focus:shadow-outline"
              onClick={handlePurchase}
            >
              Purchase
            </div>
          )}
        </div>
      </Modal >
      <div className="z-10 px-6 py-8 bg-white rounded-lg shadow-lg">
        <div
          className="flex items-center w-1/2 px-4 py-1 mb-4 text-gray-500 bg-gray-200 rounded-full cursor-copy "
          onClick={() => toast.success("Copied to Clipboard")}
        >
          <MdContentCopy className="mr-1" />
          <CopyToClipboard text={Seller.toLowerCase()}>
            <span>{sellerAddress}</span>
          </CopyToClipboard>
        </div>
        <div
          className="px-1 mb-4 cursor-pointer"
          onClick={() => setModalIsOpen(!modalIsOpen)}
        >
          {" "}
          <div className="flex flex-col items-start mb-4 font-medium text-gray-900 text-md">
            <div>Product Name :</div> <div>{name.toUpperCase()}</div>
          </div>
          <div className="block mb-4 font-medium text-gray-900 text-md">
            Product Id : {tokenID}
          </div>
          <div className="block mb-4 font-medium text-gray-900 text-md">
            Category : {Category.toUpperCase()}
          </div>
          <div className="block mb-4 font-medium text-gray-900 text-md">
            Total Quantity : {quantity} Kg
          </div>
          <div className="flex items-start mb-6 font-medium text-gray-900 text-md">

          </div>
        </div>
      </div>
    </>
  );
}
