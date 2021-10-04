-- Create the basic table
CREATE TABLE IF NOT EXISTS test_table_2 (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score INT,
    victoryPoints INT
);

-- Insert some mock data
INSERT INTO
    test_table_2 (name, score, victoryPoints) 
VALUES
    ('aidan', 0, 50),
    ('eli', 10, 60),
    ('bethanne', 20, 30),
    ('matt', 30, 44),
    ('tanner', 40, 55)
    ;

-- -- Create the basic table
-- CREATE TABLE IF NOT EXISTS test_table_3 (
--     id serial PRIMARY KEY,
--     Game_Label VARCHAR(255) NOT NULL,
--     Player_Num INT,
--     Player_Name VARCHAR(255) NOT NULL,
--     Victory_Points INT
-- );

-- COPY test_table_3(Game_Label, Player_Num, Player_Name, Victory_Points) FROM 'Test1.csv' DELIMITER ',' CSV HEADER;

