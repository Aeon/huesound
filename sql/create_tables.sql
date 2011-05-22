--
-- PostgreSQL database dump
--

BEGIN;

CREATE TABLE color_rdio_cube (
    id         SERIAL,
    album_key  VARCHAR(16),
    red        INTEGER,
    green      INTEGER,
    blue       INTEGER,
    color      CUBE,
    icon_url   TEXT,
    embed_url  TEXT,
    can_stream BOOLEAN
);

CREATE UNIQUE INDEX color_rdio_cube_album_key_index ON color_rdio_cube (album_key);

COMMIT;
