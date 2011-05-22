#!/usr/bin/env python

import sys
sys.path.append("../huesound")

import urllib2
import psycopg2;
import subprocess;
from psycopg2.extensions import register_adapter
from huesound import cube

register_adapter(cube.Cube, cube.adapt_cube)

try:
    conn = psycopg2.connect("dbname=huesound user=huesound host=localhost port=5432")
    cur = conn.cursor()
    conn2 = psycopg2.connect("dbname=huesound user=huesound host=localhost port=5432")
    out_cur = conn2.cursor()
except psycopg2.OperationalError as err:
    print "Cannot connect to database: %s" % err
    exit()

cur.execute('SELECT id, icon_url FROM color_rdio_cube WHERE red < 0');

for row in cur:
    try:
        f = urllib2.urlopen(row[1])
    except urllib2.URLError:
        print "Cannot fetch: %s" % row[1]
        continue

    proc = subprocess.Popen(["jpegtopnm"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    tmp = proc.communicate(f.read())
    f.close();

    proc = subprocess.Popen(["pnmscale", "-xsize", "1", "-ysize", "1"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    out = proc.communicate(tmp[0])

    lines = out[0].split("\n", 3)
    print "%s: (%s, %s, %s)" % (row[0], ord(lines[3][0]), ord(lines[3][1]), ord(lines[3][2]))

    sql = '''UPDATE color_rdio_cube SET red = %s, green = %s, blue = %s, color = %s::cube WHERE id = %s''';
    data = ("%s" % ord(lines[3][0]), 
            "%s" % ord(lines[3][1]), 
            "%s" % ord(lines[3][2]),
            cube.Cube(ord(lines[3][0]), ord(lines[3][1]), ord(lines[3][2])), 
            row[0])

    try:
        out_cur.execute(sql, data)
        conn2.commit()
    except psycopg2.IntegrityError:
        conn2.rollback()
