#!/usr/local/virtualenv/huesound/bin/python
#!/usr/bin/env python

import sys
sys.path.append("../huesound")

import oauth2 as oauth
import urllib
import json;
import psycopg2;
from huesound import config

NUM_ALBUMS_PER_CALL = 1000

try:
    conn = psycopg2.connect(config.PG_CONNECT)
    cur = conn.cursor()
except psycopg2.OperationalError as err:
    print "Cannot connect to database: %s" % err
    exit()

consumer = oauth.Consumer(config.CONSUMER_KEY, config.CONSUMER_SECRET)
client = oauth.Client(consumer)

offset = 0 
total = 0
while True:
    response = client.request('http://api.rdio.com/1/', 'POST', 
                              urllib.urlencode({'method': 'getNewReleases', 
                                                'time': 'twoweeks',
                                                'start': '%s' % offset,
                                                'count': '%s' % NUM_ALBUMS_PER_CALL}))

    if response[0]['status'] != '200':
        print "API call failed: %s\n\n%s\n" % (response[0]['status'], response[1])
        exit()

    data = json.loads(response[1])
#print json.dumps(data, sort_keys=True, indent = 4);

    added = 0
    skipped = 0
    for album in data['result']:
        sql = '''INSERT INTO color_rdio_cube (album_key, red, green, blue, color, icon_url, embed_url, can_stream) 
                 VALUES (%s, -1, -1, -1, '(1000,1000,1000)', %s, %s, %s)''';
        data = (album['key'], album['icon'], album['embedUrl'], album['canStream'])

        try:
            cur.execute(sql, data)
            conn.commit()
            added += 1
        except psycopg2.IntegrityError:
            conn.rollback()
            # The album already exists in the table
            skipped += 1
            pass

    total += added
    print "%s: added %d albums, skipped %s albums already in the db." % (offset, added, skipped)
    if not added: break;
    offset += NUM_ALBUMS_PER_CALL 
