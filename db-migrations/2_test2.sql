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

