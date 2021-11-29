ALTER TABLE IF EXISTS game_results (
    id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    ALTER COLUMN player_num set NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    ALTER victory_points INT set NOT NULL
);

