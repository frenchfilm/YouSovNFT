// Public Minting Page

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  NFTCollectionABI,
  NFTCollectionFactoryAddress,
  NFTCollectionFactoryABI,
} from "../constants/constants";

function Mint() {
  const { data: NFTInstances } = useContractRead({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "geteSovInstances",
  });

  return (
    <div className="flex flex-col items-center mt-4">
      <Navbar />
      <div className="grid grid-cols-3 gap-4 p-4">
        {NFTInstances?.length === 0 ? (
          <div>No collections found.</div>
        ) : (
          NFTInstances?.map((collection) => (
            <MintCard key={collection} collectionId={collection} />
          ))
        )}
      </div>
    </div>
  );
}

const MintCard = ({ collectionId }) => {
  const { address } = useAccount();
  const { data: mintPrice } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "mintPrice",
  });

  const { data: imageSourceType } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "imageSource",
  });

  const { config: mintConfig } = usePrepareContractWrite({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "mint",
    value: mintPrice,
  });
  const { writeAsync: mintNFT } = useContractWrite(mintConfig);

  const { data: userBalance } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: duxBalance } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getduxBalance",
  });

  const { data: maxPerWallet } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "maxPerWallet",
  });

  const { data: flowrate } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "flowRate",
  });

  const { data: currentFlowRate } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCurrentFlowRate",
    args: [address],
  });

  const { data: attributes } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCollectionAttributes",
  });

  const { data: currentTokenId } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCurrentTokenId",
  });

  const { data: maxStreamsPerWallet } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "maxStreamsPerWallet",
  });

  const canMintNFTs = duxBalance > 0 && (maxPerWallet <= 0 || userBalance < maxPerWallet);


  useEffect(() => {
    // print user balance and max per wallet
    console.log("User balance: ", userBalance?.toString());
    console.log("Max per wallet: ", maxPerWallet?.toString());
  }, [maxStreamsPerWallet]);

  const generateMetadata = async () => {
    const obj = {};
    attributes.forEach((key) => {
      // Assign a random value, here using a random number
      obj[key] = Math.random();
    });
    console.log(obj);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 100;
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
      })`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert the canvas to a Blob
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("image", blob, "nft-image.png");
      formData.append("contractAddress", collectionId.toLowerCase());
      formData.append("tokenId", currentTokenId?.toString());

      // Append other attributes
      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Send the request to the backend
      fetch("https://demotokenuri.fly.dev/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error submitting image:", error);
        });
    }, "image/png");
  };

  const generateMetadataandMint = async () => {
    if (imageSourceType === 2) {
      await generateMetadata();
    }
    await mintNFT?.();
  };

  return (
    <div className="mt-4 border p-4 rounded-lg relative">
      <div className="flex flex-col justify-between">
        <a
          href={`https://testnets.opensea.io/assets/mumbai/${collectionId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text text-gray-600">{collectionId}</p>
        </a>

        {duxBalance > 0 ? (
          maxPerWallet > 0 && userBalance < maxPerWallet ? (
            <p className="text-lg text-gray-600 mt-4 mr-2">
              Reached max NFT limit per wallet!
            </p>
          ) : canMintNFTs && (
            <div>
              {userBalance < maxStreamsPerWallet ? (
                <p className="text-lg text-gray-600 mt-4 mr-2">You can mint!</p>
              ) : (
                <p className="text-lg text-gray-600 mt-4 mr-2">
                  Reached max stream per wallet limit but can still mint
                </p>
              )}
            </div>

          )
        ) : (

          flowrate?.toString() > 0 ? (
            <p className="text-lg text-gray-600 mt-4 mr-2">
              The contract is not funded with DUX
            </p>
          ) : (
            <p className="text-lg text-gray-600 mt-4 mr-2">
              These NFTs have no stream
            </p>
          )




        )}
      </div>
      <div className="mt-4 border p-4 rounded-lg relative">
        <div className="flex flex-row">
          <p className="text-xl text-gray-600">Mint</p>
          <p className="text-xl text-gray-600 ml-2">
            {imageSourceType === 0
              ? "RandomFromSet"
              : imageSourceType === 1
                ? "SinglePreset"
                : imageSourceType === 2
                  ? "Generated PFP"
                  : null}
          </p>
        </div>

        <p className="text-lg text-gray-600 mt-4">
          Mint price: {mintPrice ? mintPrice.toString() / 10 ** 18 : 0} MATIC
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Your Current Stream:{" "}
          {currentFlowRate
            ? Math.round((currentFlowRate.toString() * 604800) / 1e16) / 100
            : 0}{" "}
          DUX per week
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Max Stream per wallet:{" "}
          {maxStreamsPerWallet && flowrate
            ? Math.round(
              maxStreamsPerWallet.toString() *
              ((flowrate.toString() * 604800) / 1e16)
            ) / 100
            : 0}{" "}
          DUX per week
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Your balance: {userBalance ? userBalance.toString() : 0}
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Max per wallet: {maxPerWallet ? maxPerWallet.toString() : 0}
        </p>
        <div className="flex flex-row justify-between">
          <p className="text-lg text-gray-600 mt-4">
            Contract DUX balance:{" "}
            {duxBalance ? Math.round(duxBalance.toString() / 1e14) / 10000 : 0}
          </p>
        </div>

        <button
          onClick={() => generateMetadataandMint()}
          className={`absolute top-0 right-0 mt-2 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ${(!canMintNFTs &&flowrate!=0) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={!canMintNFTs && flowrate!=0}
        >
          Mint
        </button>
      </div>
    </div>
  );
};

export default Mint;
