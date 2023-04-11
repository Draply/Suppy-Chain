import React, { useContext } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Oval } from "react-loader-spinner";
import { ProjectContext } from "../context/ProjectContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AiOutlineArrowRight } from "react-icons/ai";
import UserDetails from "./UserDetails";
import SearchDistributer from "./SearchDistributer";

export default function ProcessorInterFace() {
  const {
    currentAccount,
    allProducts,
    isLoading,
    farmerInventory,
    productDistributer,
    getFarmerInventory
  } = useContext(ProjectContext);
  console.log('Processor');

  React.useEffect(() => {
    getFarmerInventory()
  }, [currentAccount])

  return (
    <div className="h-full">
      <Header />
      <div className="mx-auto container-lg">
        {currentAccount ? (
          <div>
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
              <div className="container flex items-start py-8 mx-auto ">
                <div className="flex flex-col items-start">
                  <SearchDistributer />
                  <UserDetails />
                </div>

                <div className="flex flex-col w-full ml-5 overflow-hidden">
                  <div className="z-0 flex flex-col">
                    <h1 className="flex mb-8 ml-5 text-2xl font-bold uppercase">
                      Distributers <AiOutlineArrowRight className="mt-1 ml-4" />
                    </h1>
                    <div className="z-0 mb-8 w-96 ">
                      {productDistributer.productName ? (
                        <ProductCard
                          name={productDistributer.productName}
                          tokenID={productDistributer.tokenId.toString()}
                          quantity={productDistributer.productQuantity.toString()}
                          price={productDistributer.productPrice.toString()}
                          Category={productDistributer.cateory}
                          Seller={productDistributer.seller}
                        />
                      ) : (
                        <div>
                          <h1 className="ml-8 font-semibold text-red-600">
                            Not Found!
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="flex mb-8 ml-5 text-2xl font-bold uppercase">
                      MarketPlace <AiOutlineArrowRight className="mt-1 ml-4" />
                    </h1>
                    <div className="card-box">
                      {farmerInventory?.map((product) => {
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
