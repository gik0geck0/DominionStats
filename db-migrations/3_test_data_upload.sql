CREATE TABLE IF NOT EXISTS data_upload (
    id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    player_num INT,
    player_name VARCHAR(255) NOT NULL,
    victory_points INT
);