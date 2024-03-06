// Superfluid component

import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { DUXAddress } from "../constants/constants";

const STREAMS_QUERY = gql`
  query MyQuery($token: String!, $senderId: String!) {
    streams(where: { token: $token, sender: $senderId }) {
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
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { NFTCollectionABI } from "../constants/constants";

const Stream = ({ stream }) => {
  const { data: balance } = useContractRead({
    address: stream.address,
    abi: NFTCollectionABI,
    functionName: "balanceOf",
    args: [stream.receiver.id],
  });

  const { config: cancelStreamConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: stream.address,
    functionName: "cancelStream",
    args: [stream.receiver.id],
  });
  const { write: cancelStream } = useContractWrite(cancelStreamConfig);

  const isFlowRateZero = stream.currentFlowRate == 0;

  const { config: restartStreamConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: stream.address,
    functionName: "reStartStream",
    args: [stream.receiver.id],
  });
  const { write: restartStream } = useContractWrite(restartStreamConfig);

  const {data: reStartIndex} = useContractRead({
    address: stream.address,
    abi: NFTCollectionABI,
    functionName: "_getRestartIndex",
    args: [stream.receiver.id],
  });


  return (
    <div className="flex justify-between items-center border p-2 rounded">
      <p>Receiver: {stream.receiver.id}</p>
      <p>
        Flowrate: {Math.round((stream.currentFlowRate / 1e18) * 60480000) / 100}
      </p>
      <p>Balance: {balance?.toString()}</p>
      <p>Restart Index: {reStartIndex?.toString()}</p>
      {isFlowRateZero ? (
        <button
          onClick={() => {
            restartStream();
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-4"
        >
          Restart Stream
        </button>
      ) : (
        <button
          onClick={() => {
            cancelStream();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-4"
        >
          Cancel Stream
        </button>
      )}
    </div>
  );
};

const Streams = ({ address }) => {
  const { loading, error, data } = useQuery(STREAMS_QUERY, {
    variables: {
      token: DUXAddress.toLowerCase(),
      senderId: address.toLowerCase(),
    },
  });

  const { config: cancelAllStreamsConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: address,
    functionName: "cancelAllStreams",
  });
  const { write: cancelAllStreams } = useContractWrite(cancelAllStreamsConfig);

  const { config: restartAllStreamsConfig } = usePrepareContractWrite({
    abi: NFTCollectionABI,
    address: address,
    functionName: "reStartAllStreams",
  });
  const { write: restartAllStreams } = useContractWrite(restartAllStreamsConfig);

  const uniqueStreams = React.useMemo(() => {
    const streamMap = new Map();

    data?.streams?.forEach((stream) => {
      const existingStream = streamMap.get(stream.receiver);
      if (!existingStream || existingStream.currentFlowRate < stream.currentFlowRate) {
        streamMap.set(stream.receiver, stream);
      }
    });

    return Array.from(streamMap.values());
  }, [data?.streams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const isFlowRateZero = uniqueStreams?.every((stream) => stream.currentFlowRate == 0);

  return (
    <div className="mt-4 border p-4 rounded-lg relative">
      {uniqueStreams?.length === 0 ? (
        <p className="text-lg text-gray-600 mt-4 mr-2">
          NO streams yet !!
        </p>
      ) : (
      isFlowRateZero ? (
        <button
          onClick={() => restartAllStreams?.()}
          className="absolute top-0 right-0 mt-2 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        >
          Restart All Streams
        </button>
      ) : (

        <button
          onClick={() => cancelAllStreams?.()}
          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Cancel All Streams
        </button>
      )
      )}
      <div className="flex flex-col gap-4 mt-8">
        {uniqueStreams?.map(({ id, receiver, currentFlowRate }) => (
          <Stream
            key={id}
            stream={{ receiver, currentFlowRate, address }}
          />
        ))}
      </div>
    </div>
  );
};

export default Streams;
