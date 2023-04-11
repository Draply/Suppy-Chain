import React, { useContext } from "react";
import SellProduct from "../components/SellProduct";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Oval } from "react-loader-spinner";
import { ProjectContext } from "../context/ProjectContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import UserDetails from "./UserDetails";

export default function FarmerInterFace() {
  const { currentAccount, allProducts, isLoading, getProviderInventory,
    providerInventory } = useContext(ProjectContext);
  console.log('Farmer');

  React.useEffect(() => {
    getProviderInventory()
  }, [])

  return (
    <div className="h-full">
      <Header />
      <div>
        {currentAccount ? (
          <div className="mx-auto container-lg ">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-screen">
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
              <div className="container flex items-start py-8 mx-auto">
                <div className="flex flex-col items-start">
                  <SellProduct />
                  <UserDetails />
                </div>

                <div className="flex flex-col items-start w-full">
                  <h1 className="flex mb-8 ml-6 text-2xl font-bold uppercase">
                    My Listing <AiOutlineArrowRight className="mt-1 ml-4" />
                  </h1>
                  <div className="ml-5 card-box">
                    {allProducts.map((product) => {
                      let {
                        productName,
                        tokenId,
                        productQuantity,

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
                  <h1 className="flex mb-8 ml-6 text-2xl font-bold uppercase">
                    MarketPlace <AiOutlineArrowRight className="mt-1 ml-4" />
                  </h1>
                  <div className="ml-5 card-box">
                    {providerInventory?.map((product) => {
                      let {
                        productName,
                        tokenId,
                        productQuantity,
                        productPrice,
                        cateory,
                        seller,
                      } = product;

                      let tokenID = tokenId.toString();
                      let quantity = productQuantity.toString();
                      let price = productPrice?.toString();
                      let Seller = seller.toString();
                      let category = cateory.toUpperCase();

                      return (
                        <div key={tokenId} className="mb-8">
                          <ProductCard
                            name={productName}
                            tokenID={tokenID}
                            quantity={quantity}
                            price={price}
                            Category={category}
                            Seller={Seller}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container flex justify-center p-8 mx-auto item-center">
            <h1>Please Connect your wallet first</h1>
          </div>
        )}
      </div>
    </div>
  );
}
