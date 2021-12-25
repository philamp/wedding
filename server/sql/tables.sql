CREATE DATABASE philippe OWNER philippe;

\c philippe

SET timezone = 'Europe/Paris';

CREATE schema privateschema;

CREATE TABLE privateschema.families (
    family_id SERIAL PRIMARY KEY,
    pass_word text NOT NULL DEFAULT public.make_pass_word(),
    family_name text NOT NULL,
    road_address text NOT NULL,
    postal_code text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    guest_level INTEGER NOT NULL DEFAULT 1 CHECK (guest_level IN (0, 1, 2)),
    cocktail_attending boolean,
    diner_attending boolean,
    booking_priority INTEGER DEFAULT 0 CHECK (booking_priority IN (0, 1, 2)),
    email_address text check(length(email_address) <= 255),
    creation_date timestamp, -- put back not null
    first_answer_date timestamp,
    update_date timestamp,
    signing_img_url varchar(255),
    signing text,
    phone character varying(32) COLLATE pg_catalog."default",
    phone_country_code character varying(6) COLLATE pg_catalog."default"
);

CREATE TABLE privateschema.persons (
    person_id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES privateschema.families (family_id) ON DELETE CASCADE,
    last_name text,
    first_name text,
    attending boolean, -- default true or not ?
    reverse_cocktail_attending boolean,
    reverse_diner_attending boolean,
    age_range varchar(32) NOT NULL DEFAULT 'adulte' CHECK (age_range IN ('bebe', 'enfant', 'adulte')),
    gender varchar(6) NOT NULL DEFAULT 'FEMALE' CHECK (gender IN ('MALE', 'FEMALE')),
    food_remarks text
)

-- donc REST API     !!! !!

