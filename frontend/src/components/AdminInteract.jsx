// AdminDashboard.js
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { NFTCollectionABI } from "../constants/constants";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import Streams from "./Superfluid";
import { DUXAddress, APPROVEDUXABI } from "../constants/constants";
import { ethers } from "ethers";

export const ContractInfo = ({ collectionId }) => {
  const { data: mintPrice } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "mintPrice",
  });
  const { data: specialMintPrice } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "specialMintPrice",
  });
  const { data: batchMintAmount } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "batchMintAmount",
  });
  const { data: maxPerWallet } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "maxPerWallet",
  });
  const { data: maxTotalSupply } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "maxTotalSupply",
  });
  const { data: imageSource } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "imageSource",
  });
  const { data: isSBT } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "isSBT",
  });
  const { data: specialCode } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "specialCode",
  });
  const { data: flowRate } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "flowRate",
  });

  const { data: attributes } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCollectionAttributes",
  });

  useEffect(() => {
    // console log all the data here
    console.log("mintPrice", mintPrice);
    console.log("specialMintPrice", specialMintPrice);
    console.log("batchMintAmount", batchMintAmount);
    console.log("maxPerWallet", maxPerWallet);
    console.log("maxTotalSupply", maxTotalSupply);
    console.log("imageSource", imageSource);
    console.log("isSBT", isSBT);
    console.log("specialCode", specialCode);
    console.log("flowRate", flowRate);
    console.log("attributes", attributes);
  }, [
    mintPrice,
    specialMintPrice,
    batchMintAmount,
    maxPerWallet,
    maxTotalSupply,
    imageSource,
    isSBT,
    specialCode,
    flowRate,
    attributes,
  ]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Mint Price</h3>
        <p>{mintPrice?.toString() / 1e18} Matic</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Special Mint Price</h3>
        <p>{specialMintPrice?.toString() / 1e18} Matic</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Batch Mint Amount</h3>
        <p>{batchMintAmount?.toString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Max Per Wallet</h3>
        <p>{maxPerWallet?.toString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Max Total Supply</h3>
        <p>{maxTotalSupply?.toString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Image Source</h3>

        <p>
          {imageSource?.toString() === "0"
            ? "RandomFromSet"
            : imageSource?.toString() === "1"
              ? "SinglePreset"
              : "GenerativePFP"}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Is SBT</h3>
        <p>{isSBT?.toString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Special Code</h3>
        <p>Code{specialCode}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Flow Rate</h3>
        <p>
          {Math.round((flowRate?.toString() / 1e18) * 604800 * 100) / 100} DUX
          per week
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Attributes</h3>
        {attributes?.map((attribute) => (
          <p>{attribute}</p>
        ))}
      </div>
    </div>
  );
};

const MintingFunctions = () => {
  const { collectionId } = useParams();
  const { address } = useAccount();

  const {
    data: specialMintPrice,
    isLoading: isLoadingSpecialMintPrice,
    error: specialMintPriceError,
  } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "specialMintPrice",
  });

  const { config: adminMintConfig } = usePrepareContractWrite({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "adminMint",
    value: specialMintPrice ? specialMintPrice.toString() : "0",
  });

  const { data: batchMintAmount } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "batchMintAmount",
  });

  const {
    writeAsync: adminMint,
    isLoading: isMinting,
    error: mintError,
  } = useContractWrite(adminMintConfig);

  const { config: adminBatchMintConfig } = usePrepareContractWrite({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "batchMint",
    value:
      specialMintPrice && batchMintAmount
        ? ethers.utils
          .parseEther(
            (
              (specialMintPrice.toString() * batchMintAmount.toString()) /
              1e18
            ).toString()
          )
          .toString()
        : "0",
  });

  const {
    writeAsync: adminBatchMint,
    isLoading: isBatchMinting,
    error: batchMintError,
  } = useContractWrite(adminBatchMintConfig);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useContractRead({
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


  const [hasDux, setHasDux] = useState(false);

  useEffect(() => {
    if (duxBalance > 0) {
      setHasDux(true);
    }
  }, [duxBalance]);

  const { data: currentTokenId } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCurrentTokenId",
  });

  const { data: attributes } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getCollectionAttributes",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const generateMetadata = async (_currentTokenId) => {
    setStatusMessage(`Processing Token ID: ${_currentTokenId}`);
    const obj = {};
    attributes.forEach((key) => {
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
      formData.append("tokenId", _currentTokenId);

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
          setStatusMessage(`Token ID: ${_currentTokenId} processed`);
        })
        .catch((error) => {
          console.error("Error submitting image:", error);
          setStatusMessage(`Error processing Token ID: ${_currentTokenId}`);
        });
    }, "image/png");
  };

  const { data: imageSourceType } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "imageSource",
  });

  const handleAdminMint = async () => {
    try {
      if (imageSourceType === 2) {
        await generateMetadata(currentTokenId.toString());
      }
      await adminMint?.();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBatchMint = async () => {
    try {
      if (imageSourceType === 2) {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let i = currentTokenId; i < currentTokenId + batchMintAmount; i++) {
          await generateMetadata(i.toString());
          await delay(1000);
        }
      }
      await adminBatchMint?.();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {specialMintPriceError && (
        <p>Error loading mint price: {specialMintPriceError.message}</p>
      )}

      {balanceError && <p>Error loading balance: {balanceError.message}</p>}
      {!hasDux && <p>You need to load DUX to mint</p>}

      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center w-full ${!hasDux ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        onClick={() => handleAdminMint()}
      >
        {isMinting ? "Minting..." : "Admin Mint"}
      </button>
      {mintError && <p>Error during minting: {mintError}</p>}
      <button
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded w-full ${!hasDux ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        onClick={() => handleBatchMint()}
      >
        {isBatchMinting ? "Batch Minting..." : "Batch Mint"}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
      {batchMintError && <p>Error during batch minting: {batchMintError}</p>}

      <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
        <h3 className="text-lg font-semibold mb-3">Balance</h3>
        {isLoadingBalance ? <p>Loading...</p> : <p>{balance?.toString()}</p>}
      </div>
    </div>
  );
};

const FinancialManagement = () => {
  const { collectionId } = useParams();
  if (!collectionId) {
    // Handle the case where collectionId is not available
    console.error("Collection ID is undefined");
    return null;
  }

  const balance = useBalance({
    address: collectionId,
  });

  const { data: duxBalance } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "getduxBalance",
  });

  const hasBalance = balance?.data?.value > 0;

  console.log("hasbalance", hasBalance);

  const { config: withdrawEther } = usePrepareContractWrite(
    hasBalance
      ? {
        address: collectionId,
        abi: NFTCollectionABI,
        functionName: "withdrawEther",
      }
      : undefined
  );
  const { write: withdrawMatic } = useContractWrite(withdrawEther);

  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");
  const { address } = useAccount();

  const { data: approvedDUX } = useContractRead({
    address: DUXAddress,
    abi: APPROVEDUXABI,
    functionName: "allowance",
    args: [address, collectionId],
  });

  console.log(approvedDUX);

  const userDuxBalance = useBalance({
    address: address,
    token: DUXAddress,
  });

  // console.log(userDuxBalance?.data?.value);

  const { config: approveDUXConfig } = usePrepareContractWrite(
    approvedDUX < amount * 1e18
      ? {
        address: DUXAddress,
        abi: APPROVEDUXABI,
        functionName: "approve",
        args: [collectionId, amount * 1e18],
        onError: (error) => {
          console.error("Error:", error);
          setError(error.message);
        },
      }
      : undefined
  );

  const { write: approveDUX } = useContractWrite(approveDUXConfig);

  const { config: gainDuxConfig } = usePrepareContractWrite(
    approvedDUX >= amount * 1e18 && userDuxBalance?.data?.value >= amount * 1e18
      ? {
        address: collectionId,
        abi: NFTCollectionABI,
        functionName: "gainDux",
        args: [amount * 1e18], // Assuming the amount is in Dux which has 18 decimals
        onError: (error) => {
          console.error("Error:", error);
          setError(error.message);
        },
      }
      : undefined
  );

  const { write: gainDux } = useContractWrite(gainDuxConfig);

  const [withDrawAmount, setWithdrawAmount] = useState("0");

  const { config: withdrawDuxConfig } = usePrepareContractWrite({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "withdrawDux",
    args: [withDrawAmount * 1e18], // Assuming the amount is in Dux which has 18 decimals
    onError: (error) => {
      console.error("Error:", error);
      setError(error.message);
    },
  });

  const { write: withdrawDux } = useContractWrite(withdrawDuxConfig);

  return (
    <div className="max-w-md mx-auto my-6">
      <div className="mb-4 p-6 bg-white text-gray-800 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-lg font-semibold mb-3">
          Matic Balance: {balance?.data?.value?.toString() / 1e18} Matic
        </h2>
        <button
          onClick={() => withdrawMatic?.()}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Withdraw
        </button>
      </div>

      <div className="max-w-md mx-auto my-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">
            Dux Balance: {duxBalance?.toString() / 1e18} DUX
          </h2>
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Load DUX</h3>
            <div className="flex space-x-2 mb-4">
              <input
                className="flex-grow py-2 px-3 border rounded border-gray-300"
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={() =>
                  approvedDUX < amount * 1e18 ? approveDUX?.() : gainDux?.()
                }
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-1/3"
              >
                {approvedDUX < amount * 1e18 ? "Approve" : "Load"}
              </button>
            </div>
            <h3 className="text-md font-semibold mb-2">Withdraw DUX</h3>
            <div className="flex space-x-2">
              <input
                className="flex-grow py-2 px-3 border rounded border-gray-300"
                placeholder="Enter amount"
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <button
                onClick={() => withdrawDux?.()}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-1/3"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { collectionId } = useParams();

  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);

  const { data: Owner } = useContractRead({
    address: collectionId,
    abi: NFTCollectionABI,
    functionName: "owner",
  });

  useEffect(() => {
    if (Owner === address) {
      setIsOwner(true);
    }
    if (Owner !== address) {
      setIsOwner(false);
    }
  }, [address]);

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center mt-4">
        <Navbar />
        <h1 className="text-2xl font-bold mb-5 mt-4">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold mb-5">
          You are not the owner of this collection.
        </h2>
        <a
          href={`https://testnets.opensea.io/assets/mumbai/${collectionId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on OpenSea
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-5 mt-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-5">{collectionId}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Contract Information"
          content={<ContractInfo collectionId={collectionId} />}
        />
        <Card title="Minting Functions" content={<MintingFunctions />} />
        <Card title="Financial Management" content={<FinancialManagement />} />
      </div>

      <div className="w-full lg:w-3/4">
        <h2 className="text-xl font-semibold mb-5 mt-8 text-center">
          Stream Management
        </h2>
        <Streams key={collectionId} address={collectionId} />
      </div>
    </div>
  );
};

export const Card = ({ title, content }) => (
  <div className="bg-white shadow-md rounded p-4 border border-black">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    {content}
  </div>
);

export default AdminDashboard;
