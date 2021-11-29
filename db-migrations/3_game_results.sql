ALTER TABLE IF NOT EXISTS game_results (
    id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    player_num INT NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    victory_points INT NOT NULL
);

