CREATE TABLE IF NOT EXISTS favorite(
   id serial PRIMARY KEY,
   id_user INT NULL REFERENCES utilizatori(id),
   id_produs INT NULL REFERENCES produse(id),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);
