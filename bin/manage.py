#!/usr/bin/env python

import sys
sys.path.append("../huesound")

from werkzeug import script
from huesound import config

def make_app():
    from huesound.application import HueSoundServer
    return HueSoundServer(config.PG_CONNECT)

def make_shell():
    from huesound import utils
    application = make_app()
    return locals()

action_runserver = script.make_runserver(make_app, use_reloader=True)
action_shell = script.make_shell(make_shell)

script.run()
