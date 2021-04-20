DROP TABLE IF EXISTS exam;
CREATE TABLE exam(
    id SERIAL PRIMARY KEY,
    quote VARCHAR(255),
    character VARCHAR(255),
    image VARCHAR(255),
    characterDirection VARCHAR(255),
    creat_by TEXT
)