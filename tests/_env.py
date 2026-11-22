import os,pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'haneul-fishing.html').as_uri()
BOT=open(ROOT/'tests'/'bot.js',encoding='utf-8').read()
_c=os.environ.get('CHROME','/usr/bin/google-chrome')
LAUNCH={'executable_path':_c} if os.path.exists(_c) else {}
