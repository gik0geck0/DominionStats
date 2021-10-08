-- --Uncomment below to test table 3

CREATE TABLE IF NOT EXISTS test_table_3 (
    id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    player_num INT,
    player_name VARCHAR(255) NOT NULL,
    victory_points INT
);

-- -- Create the basic table
-- CREATE TABLE IF NOT EXISTS test_table_3 (
--     id serial PRIMARY KEY,
--     Game_Label VARCHAR(255) NOT NULL,
--     Player_Num INT,
--     Player_Name VARCHAR(255) NOT NULL,
--     Victory_Points INT
-- );

-- COPY test_table_3(Game_Label, Player_Num, Player_Name, Victory_Points) FROM '/app/db-migrations/Test1.csv' DELIMITER ',' CSV HEADER;
-- --maybe backslash\


