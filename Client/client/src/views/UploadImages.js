import React from "react";
import axios from "axios";
import widgetStyle from "./widgetStyle";
import { URL } from "../config";
import { useState } from "react";
const UploadImages = ({ photos, photosSetter }) => {
  const uploadWidget = (e) => {
    e.preventDefault();
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_UPLOAD_PRESET,
        tags: ["user"],
        stylesheet: widgetStyle,
      },
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          result.event === "queues-end" && upload_picture(result);
        }
      }
    );
  };
  const upload_picture = async (result) => {
    //console.log(result.info.files);
    debugger;
    let newPhotos = result.info.files.map((pic) => {
      return {
        public_id: pic.uploadInfo.public_id,
        photo_url: pic.uploadInfo.secure_url,
      };
    });
    newPhotos = newPhotos.concat(photos.photos);
    photosSetter((prevState) => ({ ...prevState, photos: [...newPhotos] }));
    console.log(pictures);
    try {
      console.log(result);
      const response = await axios.post(`${URL}/pictures/upload`, {
        files: result.info.files,
      });
      response.data.ok
        ? await props.fetch_pictures()
        : alert("Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };
  // function to send data to server to create a new post
  return (
    <div className="flex_upload">
      {/* form to add title, description, author, date -- onchange goes to state */}
      <div className="upload">
        <button className="button" onClick={(e) => uploadWidget(e)}>
          Upload images
        </button>
      </div>
      {/* button PUBLISH POST on click take data from state and send to server on the body -- function*/}
    </div>
  );
};
export default UploadImages;
