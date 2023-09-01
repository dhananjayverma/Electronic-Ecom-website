const cloudinary = require("cloudinary");

//config---->sending to cloudinary

cloudinary.config({
  cloud_name: "dugbfqro4",
  api_key: "116221385469849",
  api_secret: "y2A88Bo_siPv0MLYhLfwisintSU",
});

//req.body.image---->used when we are not using forms to upload images.
//req.files.file.path----->used when we are using forms to upload images.

exports.upload = async (req, res) => {
    let result = await cloudinary.uploader.upload(req.body.image,{
        public_id:`${Date.now()}`,
        resource_type:'auto' //jpeg,png...
    })
    res.json({
        public_id:result.public_id,
        url:result.secure_url
    })
};

exports.remove = async (req, res) => {
    let image_id = req.body.public_id
    cloudinary.uploader.destroy(image_id,(err,result)=>{
          if(err) return res.json({success:false,err});
          res.send('ok')
          
    })    
};
