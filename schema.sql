DROP TABLE movie;

CREATE TABLE movie(
     id SERIAL PRIMARY KEY,
     original_title VARCHAR(255),
     release_date VARCHAR(255),
     poster_path VARCHAR(1000),
     overview VARCHAR(1000)
);