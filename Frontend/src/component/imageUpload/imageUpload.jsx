import React from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUplaod = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const handleFileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let file of files) {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD ERROR", err);
              });
          },
          "base64"
        );
      }
    }
  }; 

  const handleImageRemove = (public_id) => {
      setLoading(true)
      axios.post(`${process.env.REACT_APP_API}/removeimage`,{public_id},{
          headers:{
            authtoken: user ? user.token : "",
          }
      })
      .then(res=>{
            setLoading(false)
            const {images} = values
            let filteredImages = images.filter(image=>{
                return image.public_id !== public_id
            })
            setValues({...values,images:filteredImages})
      })
      .catch(err=>{
            console.log(err);
            setLoading(false)
      })
  }

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge key={image.public_id} count="x" style={{cursor:'pointer'}} onClick={()=>handleImageRemove(image.public_id)}>
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="m-2"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary btn-sm mt-3">
          Choose file to uplaod images
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={handleFileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUplaod;
