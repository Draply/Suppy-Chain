import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { ProjectContext } from "../context/ProjectContext";
import { MdClose, MdOutlineTrackChanges, MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '@mui/material'
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    padding: "0 0 0 0",
  },
};

export default function TrackBtn() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const { getOwners, allOwners, getData, data } = useContext(ProjectContext);

  const handleTracking = () => {
    if (tokenId) {
      getOwners(tokenId);
      getData(tokenId);
    }
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div className="bg-white px-12 py-14 rounded shadow-md border-gray-200 border-2 text-blac w-full flex flex-col items-center text-black justify-center">
          <div className="flex flex-col items-start mb-2 w-full">
            <MdClose
              onClick={() => setModalIsOpen(!modalIsOpen)}
              className="absolute top-4 right-6 cursor-pointer"
              size={24}
            />

            <h1 className="uppercase mb-8 text-3xl text-center font-bold ">
              Get product details
            </h1>
            <div className="mb-4 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Product ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                min="0"
                placeholder="Enter Token Id..."
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>

            {
              data ?
                <Box sx={{ height: 400,  width: 780 }}>
                  <DataGrid
                    rows={data?.map((dat, idx) => {
                      const time = new Date(Number(dat[2]) * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
                      const _address = dat[0].toString()
                      const address = _address.substring(0, 4) + '...' + _address.substring(_address.length - 4, _address.length)
                      return {
                        id: idx,
                        address,
                        note: dat[1],
                        at: time
                      }
                    })}
                    columns={[
                      { field: 'id', headerName: 'ID', width: 90 },
                      { field: 'address', headerName: 'Address', width: 120 },
                      {
                        field: 'note',
                        headerName: 'Note',
                        width: 250,
                      },
                      {
                        field: 'at',
                        headerName: 'At',
                        width: 250,
                      },

                    ]}
                    onCellDoubleClick={(params) => {
                      if (params?.id !== undefined && data[params?.id][0]) {
                        window.navigator.clipboard.writeText(data[params?.id][0]?.toString())
                        toast.success('Copied to clipboard! Address');
                      }
                    }}

                  />
                </Box> : <React.Fragment></React.Fragment>
            }




            <button
              className="bg-blue-600 hover:bg-blue-900 rounded-full text-white  py-3 px-9 focus:outline-none focus:shadow-outline uppercase flex items-center justify-center cursor-pointer font-semibold w-full mt-4"
              onClick={handleTracking}
            >
              Track Now
              <MdOutlineTrackChanges className="ml-1" />
            </button>
          </div>
        </div>
      </Modal>
      <div
        className="bg-blue-600 hover:bg-blue-900 rounded-full text-white  py-3 px-9 focus:outline-none focus:shadow-outline uppercase flex items-center justify-between cursor-pointer font-semibold"
        onClick={() => setModalIsOpen(!modalIsOpen)}
      >
        Track
        <MdOutlineTrackChanges className="ml-1" />
      </div>
    </>
  );
}
