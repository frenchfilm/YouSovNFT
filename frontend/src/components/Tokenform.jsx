import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useContractWrite, useContractRead } from "wagmi";
import {
  NFTCollectionFactoryAddress,
  NFTCollectionFactoryABI,
} from "../constants/constants";

const MintingOptionsForm = () => {
  const [mintPrice, setMintPrice] = useState(0);
  const [specialMintPrice, setSpecialMintPrice] = useState(0);
  const [batchMintAmount, setBatchMintAmount] = useState();
  const [maxPerWallet, setMaxPerWallet] = useState();
  const [maxTotalSupply, setMaxTotalSupply] = useState();
  const [imageSource, setImageSource] = useState(); // Assuming 0 as default
  const [isSBT, setIsSBT] = useState(false);
  const [specialCode, setSpecialCode] = useState(); // Assuming 0 as default
  const [flowRate, setFlowRate] = useState();
  const { address, isConnected } = useAccount();
  const [showTraitsManager, setShowTraitsManager] = useState(false);

  const {
    write: createCollection,
    data,
    error,
    isLoading,
  } = useContractWrite({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "createNFTCollection",
    onSuccess(data) {
      alert("Collection created successfully");
    },
  });

  const { data: contractOwner, isError } = useContractRead({
    address: NFTCollectionFactoryAddress,
    abi: NFTCollectionFactoryABI,
    functionName: "owner",
  });
  const [traitValues, setTraitValues] = useState([]);
  const [newTrait, setNewTrait] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    let imageSourceIndex = 0;

    switch (imageSource) {
      case "random":
        imageSourceIndex = 0;
        break;
      case "single":
        imageSourceIndex = 1;
        break;
      case "generative":
        imageSourceIndex = 2;
        break;
      default:
        imageSourceIndex = 0;
    }

    const config = {
      _name: "EsovNFTCollection",
      _symbol: "ESOV",
      mintPrice: mintPrice * 10 ** 18,
      specialMintPrice: specialMintPrice * 10 ** 18,
      batchMintAmount: batchMintAmount,
      maxPerWallet: maxPerWallet,
      maxTotalSupply: maxTotalSupply,
      imageSource: imageSourceIndex,
      isSBT: isSBT,
      specialCode: specialCode.match(/\d+/),
      flowRate: flowRate * 1653439153439,
      collectionAttributes: traitValues,
    };

    try {
      console.log(config);
      createCollection({ args: [config] });
    } catch (err) {
      console.log(err);
    }
  };

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
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  border-black border"
        onSubmit={handleSubmit}
      >
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
                onChange={() => setIsFree(!isFree)}
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
        </div>

        {/* Image Source */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Image Source:
          </label>
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageSource}
            onChange={(e) => setImageSource(e.target.value)}
          >
            <option value="">Select Image Source</option>
            <option value="random">Random from a set</option>
            <option value="single">Single preset JPG</option>
            <option value="generative">Generative PFP</option>
          </select>
        </div>
        {
          imageSource === "generative" && (
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
          )
        }
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

        {/* Max Per Wallet */}
        <div className="flex mb-4 items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2">
            Max Streams per wallet:
          </label>
          <input
            type="number"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={maxPerWallet}
            onChange={(e) => setMaxPerWallet(e.target.value)}
            placeholder="Enter max streams "
          />
        </div>

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
