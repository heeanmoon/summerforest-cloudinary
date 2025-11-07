import formidable from 'formidable';import {v2 as cloudinary} from 'cloudinary';
export const config={api:{bodyParser:false}};
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
export default async function handler(req,res){if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const form=formidable({multiples:false,keepExtensions:true});
  form.parse(req,async(err,fields,files)=>{
    if(err)return res.status(500).json({error:'Parse error'});
    let file=files.file; if(Array.isArray(file)) file=file[0];
    if(!file)return res.status(400).json({error:'No file'});
    try{const folder=process.env.CLOUDINARY_UPLOAD_FOLDER||'summerforest';const result=await cloudinary.uploader.upload(file.filepath,{folder});return res.status(200).json({url:result.secure_url,public_id:result.public_id});}
    catch(e){console.error(e);return res.status(500).json({error:'Cloudinary upload failed'});}
  });
}
