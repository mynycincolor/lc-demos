import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const root=resolve('public');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  const file=resolve(root,'.'+(pathname==='/'||pathname==='/series/lincoln-center-presents/v/choose-what-you-pay'?'/index.html':pathname));
  if(!file.startsWith(root+'/')){res.writeHead(403);return res.end();}
  try {const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);}
  catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local demo: http://127.0.0.1:4173'));
