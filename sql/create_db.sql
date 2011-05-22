\set ON_ERROR_STOP 1

-- Create the user and the database. Must run as user postgres.

--CREATE USER huesound PASSWORD 'huesoundrox'  NOCREATEDB NOCREATEUSER;
CREATE USER huesound NOCREATEDB NOCREATEUSER;
CREATE DATABASE huesound WITH OWNER = huesound TEMPLATE template0 ENCODING = 'UNICODE';
