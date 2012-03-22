import sys
import site

site.addsitedir('/usr/local/virtualenv/huesound/lib/python2.6/site-packages')
sys.path.append("/var/www/vhosts/huesound")

from werkzeug import script
from huesound import config

def make_app():
    from huesound.application import HueSoundServer
    return HueSoundServer(config.PG_CONNECT)

application = make_app()
