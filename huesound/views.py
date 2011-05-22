# -*- coding: utf-8 -*-
import psycopg2;
from psycopg2.extensions import register_adapter
from huesound import config
from huesound.utils import render_template, render_json, expose, validate_url, url_for
from huesound import cube

register_adapter(cube.Cube, cube.adapt_cube)

def get_images(color, count):

    try:
        conn = psycopg2.connect(config.PG_CONNECT)
        cur = conn.cursor()
    except psycopg2.OperationalError as err:
        print "Cannot connect to database: %s" % err
        exit()

    red = int(color[0:2], 16) 
    green = int(color[2:4], 16) 
    blue = int(color[4:6], 16) 

    query = '''SELECT album_key, icon_url, embed_url 
                     FROM color_rdio_cube 
                 ORDER BY cube_distance(color, %s) 
                    LIMIT %s'''
    data = (cube.Cube(red, green, blue), count)
    cur.execute(query, data)

    result = []
    for row in cur:
        result.append({ "album_key": row[0], "icon_url" : row[1], "embed_url" : row[2] })

    return result

@expose('/<color>/<count>/j')
def images_json(request, color, count):
    return render_json(get_images(color, count))

@expose('/<color>/<count>/h')
def images_html(request, color, count):
    return render_template('icons.html', data=get_images(color, count))
