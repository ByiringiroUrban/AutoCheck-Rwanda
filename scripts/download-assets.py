import json, base64, re, sys, subprocess, os
t = json.load(open(sys.argv[1]))[0]['text']
d = json.JSONDecoder().raw_decode(t)[0]
if isinstance(d, str): d = json.loads(d)
os.makedirs('public/images', exist_ok=True)
manifest = []
for x in d:
    alt = x['alt'] or 'img'
    slug = re.sub(r'[^a-z0-9]+', '-', alt.lower()).strip('-')[:40] or 'img'
    src = x['src']
    if src.startswith('data:'):
        m = re.match(r'data:image/(\w+).*?;base64,(.*)', src, re.S)
        ext = m.group(1).replace('jpeg', 'jpg')
        name = f"{x['i']:02d}-{slug}.{ext}"
        open(f'public/images/{name}', 'wb').write(base64.b64decode(m.group(2)))
    else:
        base = src.split('/')[-1].split('?')[0]
        name = re.sub(r'\.[0-9a-f]{20}\.', '.', base)
        subprocess.run(['curl', '-sfA', 'Mozilla/5.0', '-o', f'public/images/{name}', src], check=True)
    x.pop('src'); x['file'] = f'/images/{name}'
    manifest.append(x); print(json.dumps(x))
json.dump(manifest, open('docs/research/assets-manifest.json', 'w'), indent=1)
