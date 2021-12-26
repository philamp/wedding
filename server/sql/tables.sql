CREATE DATABASE philippe OWNER philippe;

\c philippe

SET timezone = 'Europe/Paris';

CREATE schema privateschema;

CREATE TABLE privateschema.families (
    family_id SERIAL PRIMARY KEY,
    created_at timestamp not null default now(),
    first_visited_at timestamp, -- !!! needs to be set at first visit, so if empty
    updated_at timestamp not null default now(),
    pass_word text NOT NULL DEFAULT privateschema.make_pass_word(),
    family_name text NOT NULL,
    road_address text NOT NULL,
    postal_code text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    guest_level INTEGER NOT NULL DEFAULT 1 CHECK (guest_level IN (0, 1, 2)),
    cocktail_attending boolean,
    diner_attending boolean,
    email_address text check(length(email_address) <= 255),
    signing_img_url varchar(255),
    phone character varying(32) COLLATE pg_catalog."default",
    phone_country_code character varying(6) COLLATE pg_catalog."default",
    signing text,
    booking_priority INTEGER DEFAULT 0 CHECK (booking_priority IN (0, 1, 2))
)
;
CREATE TABLE privateschema.persons (
    person_id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES privateschema.families (family_id) ON DELETE CASCADE,
    last_name text,
    first_name text,
    attending boolean DEFAULT true,
    reverse_cocktail_attending boolean,
    reverse_diner_attending boolean,
    age_range varchar(32) NOT NULL DEFAULT 'adulte' CHECK (age_range IN ('bebe', 'enfant', 'adulte')),
    gender varchar(6) NOT NULL DEFAULT 'FEMALE' CHECK (gender IN ('MALE', 'FEMALE')),
    food_remarks text
)
;
CREATE TABLE privateschema.rooms (
    room_id SERIAL PRIMARY KEY,
    building_name varchar(128) NOT NULL,
    etage INTEGER,
    room_number varchar(24) NOT NULL,
    category_description text,
    capacity INTEGER NOT NULL,
    bedsizes text,
    equipement text
)
;
CREATE TABLE privateschema.bookings (
    booking_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES privateschema.rooms (room_id),
    family_id INTEGER REFERENCES privateschema.families (family_id),
    booking_state varchar(32) NOT NULL DEFAULT 'pending' CHECK (booking_state IN ('pending', 'option', 'accepted', 'refused')),
    updated_at timestamp not null default now()
)


