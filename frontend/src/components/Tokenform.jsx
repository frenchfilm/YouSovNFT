import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useContractWrite, useContractRead } from "wagmi";
import {
  NFTCollectionFactoryAddress,
  NFTCollectionFactoryABI,
} from "../constants/constants";
import { useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import { Link } from "react-router-dom";

const MintingOptionsForm = () => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [mintPrice, setMintPrice] = useState(0);
  const [specialMintPrice, setSpecialMintPrice] = useState();
  const [batchMintAmount, setBatchMintAmount] = useState();
  const [maxPerWallet, setMaxPerWallet] = useState(0);
  const [maxStreamsPerWallet, setmaxStreamsPerWallet] = useState();
  const [maxTotalSupply, setMaxTotalSupply] = useState(0);
  const [imageSource, setImageSource] = useState();
  const [isSBT, setIsSBT] = useState(false);
  const [specialCode, setSpecialCode] = useState();
  const [flowRate, setFlowRate] = useState();
  const { address, isConnected } = useAccount();
  const [showTraitsManager, setShowTraitsManager] = useState(false);
  const [royalityPercent, setRoyalityPercent] = useState(0);
  const [royalityReceiver, setRoyalityReceiver] = useState("");

  const { writeAsync: createCollection, isLoading, error: creationError } = useContractWrite({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "createNFTCollection",
  });

  const { data: contractOwner, isError } = useContractRead({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "owner",
  });
  const [traitValues, setTraitValues] = useState([]);
  const [newTrait, setNewTrait] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    if (contractOwner) {
      setRoyalityReceiver(contractOwner);
    }
  }, [contractOwner]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imageSourceIndex = 0;

    switch (imageSource) {
      case "random":
        imageSourceIndex = 0;
        break;
      case "preset":
        imageSourceIndex = 1;
        break;
      case "Generative":
        imageSourceIndex = 2;
        break;
      default:
        imageSourceIndex = 0;
    }

    const config = {
      _name: collectionName,
      _symbol: collectionSymbol,
      mintPrice: mintPrice * 10 ** 18,
      specialMintPrice: specialMintPrice * 10 ** 18,
      batchMintAmount: batchMintAmount,
      maxPerWallet: maxPerWallet,
      maxStreamsPerWallet: maxStreamsPerWallet,
      maxTotalSupply: maxTotalSupply,
      imageSource: imageSourceIndex,
      isSBT: isSBT,
      specialCode: specialCode.match(/\d+/),
      flowRate: flowRate * 1653439153439,
      collectionAttributes: traitValues,
      royaltyPercentage: royalityPercent,
      royalityReceiver: royalityReceiver,
    };

    try {
      console.log(config);
      const tx = await createCollection({ args: [config] });
      setTransactionHash(tx.hash);
    } catch (err) {
      console.log("1");
    }
  };

  const { data } = useWaitForTransaction({
    hash: transactionHash,
  });

  const [collectionAddress, setCollectionAddress] = useState("");

  const [isFree, setIsFree] = useState(false);
  const handleMintTypeChange = (type) => {
    setIsSBT(type === "SBT");
  };

  const addTrait = () => {
    if (newTrait) {
      setTraitValues([...traitValues, newTrait]);
      setNewTrait("");
    }
  };

  const removeTrait = (index) => {
    setTraitValues(traitValues.filter((_, i) => i !== index));
  };


  useEffect(() => {
    if (data) {
      setCollectionAddress(data.logs[0].address);
    }
  }, [collectionAddress, data]);

  const [enableRoyality, setEnableRoyality] = useState(false);

  return (
    <div className="container mx-auto p-4">
      {isConnected ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
          role="alert"
        >
          <strong className="font-bold">Connected!</strong>
          <span className="block sm:inline"> Your address is {address}</span>
          <span>
            {contractOwner === address ? (
              <span className="block sm:inline">
                {" "}
                You are the owner of the contract
              </span>
            ) : (
              <span className="text-red-500 block sm:inline">
                {" "}
                You are not the owner of the contract
              </span>
            )}
          </span>
        </div>
      ) : (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
          role="alert"
        >
          <strong className="font-bold">Not Connected!</strong>
          <span className="block sm:inline">
            {" "}
            Please connect your wallet to continue.
          </span>
        </div>
      )}
      {collectionAddress && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
          role="alert"
        >
          <strong className="font-bold">Collection Created!</strong>
          <Link
            to={`/deployments/${collectionAddress}`}
            className="text-blue-500 hover:underline"
          >
            <span className="block sm:inline"> at {collectionAddress}</span>
          </Link>
        </div>
      )}
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  border-black border"
        onSubmit={handleSubmit}
      >
        {/* Collection Name */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Collection Name:
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter collection name"
          />
        </div>

        {/* Collection Symbol */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Collection Symbol:
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={collectionSymbol}
            onChange={(e) => setCollectionSymbol(e.target.value)}
            placeholder="Enter collection symbol"
          />
        </div>

        {/* Mint Type */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Type:
          </label>
          <div>
            {/* NFT Checkbox */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={!isSBT}
                onChange={() => handleMintTypeChange("NFT")}
              />
              <span className="ml-2">NFT</span>
            </label>
            {/* SBT Checkbox */}
            <label className="inline-flex items-center ml-6">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isSBT}
                onChange={() => handleMintTypeChange("SBT")}
              />
              <span className="ml-2">SBT</span>
            </label>
          </div>
        </div>

        {/* Mint Price */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Mint Price (MATIC):
          </label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isFree}
                onChange={() => {
                  setIsFree(!isFree)
                }}
              />
              <span className="ml-2">Free</span>
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              value={mintPrice}
              onChange={(e) => setMintPrice(e.target.value)}
              disabled={isFree}
              placeholder="Enter mint price"
            />
          </div>
        </div>

        {/* Special Mint Price */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Special Mint Price:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={specialMintPrice}
            onChange={(e) => setSpecialMintPrice(e.target.value)}
            placeholder="Enter special mint price"
          />
        </div>

        {/* Batch Mint Amount */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Batch Mint Amount:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={batchMintAmount}
            onChange={(e) => setBatchMintAmount(e.target.value)}
            placeholder="Batch mint amount"
          />
        </div>
        {/* Max Per Wallet */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Max Per Wallet:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={maxPerWallet}
            onChange={(e) => setMaxPerWallet(e.target.value)}
            placeholder="Enter max per wallet"
          />
          {
            maxPerWallet == 0 && <p className="text-red-600 text-sm">**  indicates that there is no limit on the number of NFTs a single wallet can hold</p>
          }
        </div>

        {/* Max Total Supply */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Max Total Supply:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={maxTotalSupply}
            onChange={(e) => setMaxTotalSupply(e.target.value)}
            placeholder="Enter max total supply"
          />
          {
            maxTotalSupply == 0 && <p className="text-red-600 text-sm">**  indicates that there is no limit on the total number of NFTs that can be minted</p>
          }
        </div>

        {/* Image Source */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Image Source:
          </label>
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageSource}
            onChange={(e) => {
              setImageSource(e.target.value);
            }}
          >
            <option value="">Select Image Source</option>
            <option value="random">Random from a set</option>
            <option value="preset">Single preset JPG</option>
            <option value="Generative">Generative PFP</option>
          </select>
        </div>
        {imageSource === "Generative" && (
          <div className="flex mb-4 items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2">
              Enable Traits:
            </label>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showTraitsManager}
              onChange={() => setShowTraitsManager(!showTraitsManager)}
            />
          </div>
        )}
        {showTraitsManager && (
          <div style={{ marginLeft: "120px", marginTop: "-40px" }}>
            <div className="flex mb-4 items-center">
              <input
                type="text"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter a trait"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTrait();
                  }
                }}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={addTrait}
              >
                +
              </button>
            </div>

            <div>
              {traitValues.map((trait, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span
                    className="mr-2"
                    style={{
                      display: "inline-block",
                      width: "200px",
                      textAlign: "right",
                      fontSize: "20px",
                    }}
                  >
                    {trait}
                  </span>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => removeTrait(index)}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Code */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Special Code:
          </label>
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={specialCode}
            onChange={(e) => setSpecialCode(e.target.value)}
          >
            <option value="">Select Code</option>
            {[...Array(16)].map((_, i) => (
              <option key={i} value={`code${i + 1}`}>
                Code {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Flow Rate */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Flow Rate:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            placeholder="DUX per week"
          />
        </div>

        {/* Max Per Streams Wallet */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Max Streams per wallet:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={maxStreamsPerWallet}
            onChange={(e) => setmaxStreamsPerWallet(e.target.value)}
            placeholder="Enter max streams "
          />
        </div>
        {/*Enable Royality  */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Enable Royality:
          </label>
          <input
            type="checkbox"
            className="form-checkbox"
            checked={enableRoyality}
            onChange={() => setEnableRoyality(!enableRoyality)}
          />
        </div>
        {enableRoyality && (
          <div className="flex mb-4 items-center">
            <div className="flex mb-4 items-center">
              <label className="block text-gray-700 text-sm font-bold mr-2">
                Royality Percentage:
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={royalityPercent}
                onChange={(e) => setRoyalityPercent(e.target.value)}
                placeholder="Enter Royality Percentage"
              />
            </div>
            <div className="flex mb-4 items-center ml-4">
              <label className="block text-gray-700 text-sm font-bold mr-2">
                Royality Receiver:
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={royalityReceiver}
                onChange={(e) => setRoyalityReceiver(e.target.value)}
                placeholder="Enter Royality Receiver Address"
                size={45}
              />
            </div>
            {royalityReceiver == contractOwner && <p className="text-red-600 text-sm ml-4">**  contractOwner is the default Royality Receiver</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isLoading ? "Loading..." : "Create Collection"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MintingOptionsForm;
