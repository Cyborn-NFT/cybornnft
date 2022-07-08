// import Compressor from "compressorjs";
// import toStream from "it-to-stream";
import FileType from "file-type";
import ipfs from "../config/ipfs";
import { ipfsURL } from "../config";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function TimeStampToDateString(val) {
  const dateString = new Date(Number(val) * 1000);
  var year = dateString.getFullYear();
  // month as 2 digits (MM)
  var month = dateString.getMonth();
  // date as 2 digits (DD)
  var date = ("0" + dateString.getUTCDate()).slice(-2);
  var hrs = ("0" + dateString.getUTCHours()).slice(-2);
  var min = ("0" + dateString.getUTCMinutes()).slice(-2);
  var sec = ("0" + dateString.getUTCSeconds()).slice(-2);
  let d = `${year}-${months[month]}-${date} ${hrs}:${min} UTC`;
  return d;
}

export async function compressImage(image) {
  return new Promise((resolve, reject) => {
    try {
      new Compressor(image, {
        quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          resolve(compressedResult);
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
        },
      });
    } catch {
      reject(undefined);
    }
  });
}

export function getImageURL(_hash) {
  return ipfsURL + _hash;
}

export async function getFileType(url) {
  let ipfsHash = url.substring(url.lastIndexOf("/") + 1); // substract ipfs hash
  const ext = await getFile(ipfsHash);
  return ext.substring(0, ext.lastIndexOf("/"));
}
export function _compactAddress(address) {
  const newAddress = address;
  if (address) {
    return (
      newAddress.substring(0, 5) +
      "...." +
      newAddress.substring(newAddress.length - 10, newAddress.length)
    );
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export async function getFile(cid) {
  const type = await FileType.fromStream(toStream(ipfs.cat(cid, {})));
  return type.mime;
}

export function getFileFormat(fileType) {
  if (fileType.includes("image")) return "image";
  else if (fileType.includes("audio")) return "audio";
  else if (fileType.includes("video")) return "video";
  else return "image";
}

export const convertToBuffer = async (
  reader,
  operation = false,
  url = null,
  file = null
) => {
  //file is converted to a buffer to prepare for uploading to IPFS`
  const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
  return { buffer: buffer, url: url, file: file };
};
