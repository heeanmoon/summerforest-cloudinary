import fs from 'fs';import path from 'path';
const dataPath=path.join(process.cwd(),'data','projects.json');
function read(){try{return JSON.parse(fs.readFileSync(dataPath,'utf-8'));}catch(e){return []}}
function write(d){fs.writeFileSync(dataPath,JSON.stringify(d,null,2),'utf-8');}
export default function handler(req,res){const token=req.headers['x-admin-token']||'';const valid=process.env.ADMIN_TOKEN||'summerforest-token';
  if(req.method==='GET'){return res.status(200).json(read());}
  if(token!==valid)return res.status(401).json({error:'Unauthorized'});
  if(req.method==='POST'){const b=req.body;const arr=read();const id=arr.length?Math.max(...arr.map(x=>x.id))+1:1;const item={id:id,title:b.title||'',description:b.description||'',year:b.year||'',image:b.image||''};arr.push(item);write(arr);return res.status(201).json(item);}
  if(req.method==='PUT'){const b=req.body;const arr=read();const i=arr.findIndex(x=>x.id===b.id);if(i<0)return res.status(404).json({error:'Not found'});arr[i]={...arr[i],title:b.title,description:b.description,year:b.year,image:b.image};write(arr);return res.status(200).json(arr[i]);}
  if(req.method==='DELETE'){const b=req.body;let arr=read();arr=arr.filter(x=>x.id!==b.id);write(arr);return res.status(200).json({success:true});}
  return res.status(405).end();
}