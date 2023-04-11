import React, { useContext } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Oval } from "react-loader-spinner";
import { ProjectContext } from "../context/ProjectContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AiOutlineArrowRight } from "react-icons/ai";
import UserDetails from "./UserDetails";

export default function DistributerInterFace() {
  const { currentAccount, allProducts, isLoading, distributerInventory, getDistributerInventory } =
    useContext(ProjectContext);


  React.useEffect(() => {

    getDistributerInventory()
  }, [])

  console.log('Distributer');
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
                <UserDetails />
                <div className="z-0 flex flex-col items-start w-full ml-5 overflow-hidden">
                  {" "}
                  <h1 className="flex mb-8 ml-5 text-2xl font-bold uppercase">
                    My Inventory <AiOutlineArrowRight className="mt-1 ml-4" />
                  </h1>
                  <Swiper
                    autoplay={false}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView="auto"
                    breakpoints={{
                      320: {
                        slidesPerView: 1.25,
                        spaceBetween: 30,
                      },

                      1024: {
                        slidesPerView: 2.25,
                        spaceBetween: 20,
                      },
                      1280: {
                        slidesPerView: 3.25,
                        spaceBetween: 20,
                      },
                    }}
                    className="z-0 w-full ml-8"
                  >
                    {distributerInventory.map((product) => {
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
                      let price = productPrice.toString();
                      let Seller = seller.toString();
                      let category = cateory.toUpperCase();

                      return (
                        <SwiperSlide key={tokenId} className="mb-8">
                          <ProductCard
                            name={productName}
                            tokenID={tokenID}
                            quantity={quantity}
                            price={price}
                            Category={category}
                            Seller={Seller}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <div className="flex flex-col items-start w-full">
                    <h1 className="flex mb-8 ml-5 text-2xl font-bold uppercase">
                      MarketPlace <AiOutlineArrowRight className="mt-1 ml-4" />
                    </h1>
                    <div className="card-box">
                      {allProducts?.map((product) => {
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
