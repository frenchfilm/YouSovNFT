// Deployments.jsx
import React from "react";
import Navbar from "./Navbar";
import {
  NFTCollectionFactoryAddress,
  NFTCollectionFactoryABI,
} from "../constants/constants";
import { useContractRead } from "wagmi";
import { Link } from "react-router-dom";
import { ContractInfo, Card } from "./AdminInteract";

function Deployments() {
  const { data, isError, isLoading } = useContractRead({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "geteSovInstances",
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading collections.</div>;

  return (
    <div className="flex flex-col items-center mt-4">
      <Navbar />
      <h1 className="text-3xl mt-3">Deployments</h1>

      <div className="flex flex-row items-center mt-4">
        {data.length === 0 ? (
          <div>No collections found.</div>
        ) : (
          data.map((collection) => (
            <div className="flex flex-col items-center mt-4 ml-4 border border-black">
            <Card
              title="Collection Info"
              content={
                <div className="flex flex-col items-center mt-4">
                  <Link
                    to={`/deployments/${collection}`}
                    className="text-blue-500 hover:underline"
                  >
                    {collection}
                  </Link>
                  <ContractInfo collectionId={collection} />
                </div>
              }
            />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Deployments;
