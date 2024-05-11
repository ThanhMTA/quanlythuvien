import { useState, useEffect } from "react";
import "./Upload.css"
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import React from 'react';
import * as XLSX from 'xlsx';
function Upload() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageURL, setImageURL] = useState([]);
    const [FileExcel, setFileExcel] = useState(null);
    const imageListRef = ref(storage, "image/")

    const uploadFile = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `image/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageURL((prev) => [...prev, url]);
            });
        });

    };


    useEffect(() => {
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageURL((prev) => [...prev, url]);
                    console.log(item);
                });
            });
        });

    }, []);


    const handleExcel = () => {
        const file = FileExcel;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log(jsonData);
            // Xử lý dữ liệu Excel ở đây
        };
        reader.readAsArrayBuffer(file);
    }



    return (
        

        <div className="Upload">
            <div>
                <br />
                <br />
                <br />
                <br />
                <br />
           
                <input type="file" onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                    console.log(e);
                }
                } />


            </div>


            <button onClick={uploadFile}> Upload images</button>

            {imageURL.map((url) => {
                return <img src={url} alt="" srcset="" />
            })}


            <div>
                <label htmlFor="">upload excel</label>
                <input type="file" onChange={(e) => {
                    setFileExcel(e.target.files[0])
                }}/>
                <button onClick={handleExcel}> excel</button>
            </div>





        </div>
    )






}

export default Upload;