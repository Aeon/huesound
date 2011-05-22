# -*- coding: utf-8 -*-
from werkzeug import Local, LocalManager
from werkzeug.routing import Map, Rule
from os import path
from urlparse import urlparse
from werkzeug import Response
from jinja2 import Environment, FileSystemLoader
from json import dumps

local = Local()
local_manager = LocalManager([local])
application = local('application')

url_map = Map([Rule('/static/<file>', endpoint='static', build_only=True)])
def expose(rule, **kw):
    def decorate(f):
        kw['endpoint'] = f.__name__ + " " + f.__module__
        url_map.add(Rule(rule, **kw))
        return f
    return decorate

def url_for(endpoint, _external=False, **values):
    return local.url_adapter.build(endpoint, values, force_external=_external)

ALLOWED_SCHEMES = frozenset(['http'])
TEMPLATE_PATH = 'template'
STATIC_PATH = 'static'

jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_PATH))
jinja_env.globals['url_for'] = url_for

def render_template(template, **context):
    return Response(jinja_env.get_template(template).render(**context),
                    mimetype='text/html')

def render_json(data):
    return Response(dumps(data), 
                    mimetype='application/json')

def validate_url(url):
    return urlparse(url)[0] in ALLOWED_SCHEMES
