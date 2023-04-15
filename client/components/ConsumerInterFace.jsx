import React, { useContext } from "react";
import UserDetails from "./UserDetails";
import { Oval } from "react-loader-spinner";
import { ProjectContext } from "../context/ProjectContext";
import Header from "../components/Header";

export default function ConsumerInterFace() {
  const { currentAccount, isLoading } = useContext(ProjectContext);
  console.log('Consumer');
  return (
    <div className="h-full">
      <Header />
      <div>
        {currentAccount ? (
          isLoading ? (
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
            <div className="container flex items-center justify-center w-full py-8 mx-auto">
              <UserDetails />
            </div>
            

          )
        ) : (
          <div className="container flex justify-center p-8 mx-auto item-center">
            <h1>Please Connect your wallet first</h1>
          </div>
        )}
      </div>
    </div>
  );
}