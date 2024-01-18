// Superfluid component

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { DUXAddress } from "../constants/constants";

const STREAMS_QUERY = gql`
  query MyQuery($token: String!,$senderId: String!) {
    streams(
      where: {
        token: $token
        sender: $senderId
      }
    ) {
      currentFlowRate
      sender {
        id
      }
      receiver {
        id
      }
    }
  }
`;
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { NFTCollectionABI } from "../constants/constants";

const Streams = ({ address }) => {
  const [receiver, setReceiver] = React.useState("");
  const { config: cancelStreamConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: address,
    functionName: "cancelStream",
    args: [receiver],
  });
  const { write: cancelStream } = useContractWrite(cancelStreamConfig);
  const { loading, error, data } = useQuery(STREAMS_QUERY, {
    variables: {
      token: DUXAddress.toLowerCase(),
      senderId: address.toLowerCase()
    },
  });

  const { config: cancelAllStreamsConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: address,
    functionName: "cancelAllStreams",
  });
  const { write: cancelAllStreams } = useContractWrite(cancelAllStreamsConfig);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const filteredStreams = data.streams.filter(
    (stream) => stream.currentFlowRate !== "0"
  );
  if (filteredStreams.length === 0)
    return (
      <div className="mt-4 border p-4 rounded-lg relative">
        <p className="text-lg text-gray-600 mt-4 text-center">
          No active streams
        </p>
      </div>
    );

  return (
    <div className="mt-4 border p-4 rounded-lg relative">
      <button
        onClick={() => cancelAllStreams?.()}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        Cancel All Streams
      </button>
      <div className="flex flex-col gap-4 mt-8">
        {filteredStreams.map(({ id, receiver, currentFlowRate }) => (
          <div
            key={id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <p>Receiver: {receiver.id}</p>
            <p>
              Flowrate: {Math.round((currentFlowRate / 1e18) * 60480000) / 100}
            </p>
            {receiver && (
              <button
                onClick={() => {
                  console.log(receiver.id);
                  setReceiver(receiver.id);
                  if (cancelStream) {
                    cancelStream();
                  }
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-4"
              >
                Cancel Stream
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Streams;
