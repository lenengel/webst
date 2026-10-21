# Baut publish/index.html: CSS, JS und Schriften eingebettet (Artifact erlaubt nur eigene Dateien und Data-URIs).
import re,base64,os,json
h=open('index.html').read()
css=open('scrollcraft.css').read()+'\n'+open('site.css').read()
b64=lambda p: base64.b64encode(open(p,'rb').read()).decode()
for n in ('fraunces','fraunces-italic','geist'):
    css=css.replace('url(assets/fonts/%s.woff2)'%n,'url(data:font/woff2;base64,%s)'%b64('assets/fonts/%s.woff2'%n))
css+='\n.bar{padding-top:calc(.9rem + env(safe-area-inset-top,0px))}\n'
js=open('scrollcraft.js').read()+'\n'+open('site.js').read()
title=re.search(r'<title>.*?</title>',h).group(0)
desc=re.search(r'<meta name="description"[^>]*>',h).group(0)
api=re.search(r'<meta name="pembeef-api"[^>]*>',h).group(0)
body=re.search(r'<body>(.*)</body>',h,re.S).group(1)
body=re.sub(r'<script src="scrollcraft.js"></script>\s*<script src="site.js"></script>','',body)
out=f'{title}\n{desc}\n{api}\n<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n'
os.makedirs('publish',exist_ok=True); open('publish/index.html','w').write(out)
used=sorted(set(re.findall(r'assets/[A-Za-z0-9_\-/.]+\.(?:webp|mp4|svg)',out))-{'assets/favicon.svg'})
used=[u for u in used if os.path.exists(u)]
print(len(out)//1024,'KB html;',len(used),'assets;',sum(os.path.getsize(u) for u in used)//1024//1024,'MB')
json.dump({u:os.path.abspath(u) for u in used},open('publish/files.json','w'))
