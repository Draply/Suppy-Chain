import React, { useContext } from "react";
import SellProduct from "../components/SellProduct";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Oval } from "react-loader-spinner";
import { ProjectContext } from "../context/ProjectContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import UserDetails from "./UserDetails";

export default function FarmerInterFace() {
<<<<<<< Updated upstream
  const { currentAccount, allProducts, isLoading } = useContext(ProjectContext);
  console.log('Farmer');
=======
  const { currentAccount, allProducts, isLoading, getProviderInventory,getFarmerInventory,farmerInventory,
    providerInventory } = useContext(ProjectContext);
  console.log('Farmer');

  // React.useEffect(() => {
  //   getProviderInventory()
  // }, [])

>>>>>>> Stashed changes
  return (
    <div className="h-full">
      <Header />
      <div>
        {currentAccount ? (
          <div className="container-lg mx-auto ">
            {isLoading ? (
              <div className="w-full h-screen flex items-center justify-center">
                <Oval
                  height={40}
                  width={40}
                  color="blue"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              </div>
            ) : (
              <div className="container mx-auto py-8 flex items-start">
                <div className="flex flex-col items-start">
                  <UserDetails />
                </div>

<<<<<<< Updated upstream
                <div className="w-full flex flex-col items-start">
                  <h1 className="flex uppercase mb-8 text-2xl ml-6 font-bold">
                    My Listing <AiOutlineArrowRight className="mt-1 ml-4" />
                  </h1>
                  <div className="card-box ml-5">
                    {allProducts.map((product) => {
=======
                <div className="flex flex-col items-start w-full">
                  <h1 className="flex mb-8 ml-6 text-2xl font-bold uppercase">
                    My Inventory <AiOutlineArrowRight className="mt-1 ml-4" />
                  </h1>
                  <div className="ml-5 card-box">
                    {farmerInventory.map((product) => {
>>>>>>> Stashed changes
                      let {
                        productName,
                        tokenId,
                        productQuantity,
<<<<<<< Updated upstream
                        
=======
>>>>>>> Stashed changes
                        cateory,
                        seller,
                      } = product;

                      let tokenID = tokenId.toString();
                      let quantity = productQuantity.toString();
                      let Seller = seller.toString();
                      let category = cateory.toUpperCase();
                      



                      if (Seller.toLowerCase() == currentAccount) {
                        return (
                          <div key={tokenId} className="mb-8">
                            <ProductCard
                              name={productName}
                              tokenID={tokenID}
                              quantity={quantity}
                              Category={category}
                              Seller={Seller}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container mx-auto p-8 flex item-center justify-center">
            <h1>Please Connect your wallet first</h1>
          </div>
        )}
      </div>
    </div>
  );
}