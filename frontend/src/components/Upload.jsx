import React, { useState } from "react";
import Navbar from "./Navbar";
import lighthouse from "@lighthouse-web3/sdk";

function Upload() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const APIKEY = "fe4bf895.05d501a8bd484ecbbce107efc26ed26c";

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(`${percentageDone}% done`);
    };

    const uploadFile = async (file) => {
        const output = await lighthouse.upload(
            file,
            APIKEY,
            false,
            null,
            progressCallback
        );
        console.log("File Status:", output);
        console.log(
            "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
        );
        const imageuri =
            "https://gateway.lighthouse.storage/ipfs/" + output.data.Hash;
        setImage(imageuri);
    };
    const [metadatauri, setMetadatauri] = useState("");
    const [attributes, setAttributes] = useState([]);

    const uploadMetadata = async () => {
        const metadata = {
            name,
            description,
            image,
            attributes,
        };
        const metadatauri = await lighthouse.uploadText(
            JSON.stringify(metadata),
            APIKEY
        );
        console.log("Metadata Status:", metadatauri);
        console.log(
            "Visit at https://gateway.lighthouse.storage/ipfs/" +
            metadatauri.data.Hash
        );
        setMetadatauri(
            "https://gateway.lighthouse.storage/ipfs/" + metadatauri.data.Hash
        );
    };

    const handleAddAttribute = () => {
        setAttributes([...attributes, { trait_type: "", value: "" }]);
    };

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const handleRemoveAttribute = (index) => {
        const newAttributes = [...attributes];
        newAttributes.splice(index, 1);
        setAttributes(newAttributes);
    };

    return (
        <div className="flex flex-col items-center mt-4">
            <Navbar />
            <div className="flex flex-col items-center p-4 space-y-4">
                <div className="flex flex-col items-center space-y-4 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        className="input border border-gray-400 p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="input border border-gray-400 p-2 rounded w-full"
                    />
                    <input onChange={(e) => uploadFile(e.target.files)} type="file" className="w-full" />
                    {attributes.map((attribute, index) => (
                        <div key={index} className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Trait Type"
                                value={attribute.trait_type}
                                onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                                className="input border border-gray-400 p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={attribute.value}
                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                className="input border border-gray-400 p-2 rounded"
                            />
                            <button onClick={() => handleRemoveAttribute(index)} className="btn p-2 border border-gray-400 rounded bg-red-400 hover:bg-red-600">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddAttribute} className="btn p-2 border border-gray-400 rounded bg-green-400 hover:bg-green-600">
                        Add Attribute
                    </button>
                </div>
                <button
                    onClick={uploadMetadata}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

                >
                    Upload
                </button>
                {metadatauri && (
                    <div className="flex flex-col items-center space-y-4">
                        <a href={metadatauri} target="_blank" rel="noopener noreferrer">
                            {metadatauri}
                        </a>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Upload;
