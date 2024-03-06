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

    const uploadMetadata = async () => {
        const metadata = {
            name,
            description,
            image: image,
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

    return (
        <div className="flex flex-col items-center mt-4">
            <Navbar />
            <div className="flex flex-col items-center p-4 space-y-4">
                <div className="flex flex-col items-center space-y-4 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => {
                            setName(e.target.value)
                            setMetadatauri("")
                        }
                        }
                        className="input border border-gray-400 p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="input border border-gray-400 p-2 rounded w-full"
                    />
                    <input onChange={(e) => uploadFile(e.target.files)} type="file" className="w-full" />
                </div>
                <button
                    onClick={() => {
                        uploadMetadata();
                    }}
                    className="btn p-4 border border-gray-400 rounded shadow-lg hover:bg-gray-100"
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
