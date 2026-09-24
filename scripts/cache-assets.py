"""Cache public presentation assets from the captured reference, never scripts."""
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin,urlparse
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,re,gzip

root=Path(__file__).resolve().parent.parent
public=root/'public';assets=public/'assets'
s=BeautifulSoup((public/'index.html').read_text(),'html.parser')
previous=root/'data/asset-manifest.json'
manifest=json.loads(previous.read_text())['assets'] if previous.exists() else {};failures=[]
def fetch(url):
    url=url.replace('http://','https://')
    if url in manifest:return manifest[url]
    suffix=Path(urlparse(url).path).suffix
    if len(suffix)>6:suffix=''
    name=hashlib.sha256(url.encode()).hexdigest()[:16]+suffix
    path=assets/name
    try:
        req=Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urlopen(req,timeout=45) as response:
            raw=response.read();kind=response.headers.get('Content-Type','')
            if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
        if 'text/css' in kind or suffix=='.css':
            css=raw.decode()
            def replace(m):
                value=m.group(1).strip(' \"\'')
                if value.startswith(('data:','#')):return m.group(0)
                # Typekit's tracking-only stylesheet is not needed for the demo.
                if 'p.typekit.net' in value:return 'url(data:text/css,)'
                local=fetch(urljoin(url,value))
                return 'url('+local+')'
            css=re.sub(r'url\(([^)]+)\)',replace,css)
            raw=css.encode()
        path.write_bytes(raw);manifest[url]='/assets/'+name
        return manifest[url]
    except Exception as e:
        failures.append({'url':url,'error':str(e)});return url

targets=[]
for tag in s.select('link[rel="stylesheet"],link[rel="icon"],img'):
    for attr in ['href','src','mobilesrc']:
        if tag.get(attr,'').startswith('http'):targets.append((tag,attr,tag[attr]))
with ThreadPoolExecutor(max_workers=8) as pool:
    results=list(pool.map(fetch,dict.fromkeys(x[2] for x in targets)))
for tag,attr,url in targets:tag[attr]=manifest.get(url.replace('http://','https://'),url)
(public/'index.html').write_text(str(s))
(root/'data/asset-manifest.json').write_text(json.dumps({'assets':manifest,'failures':failures},indent=2))
print(f'Cached {len(manifest)} assets; {len(failures)} failures.');print(json.dumps(failures))
