DROP TABLE if exists bookmarks;
CREATE TABLE bookmarks
(
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL,
    url text NOT NULL,
    description text,
    rating SMALLINT NOT NULL
);

INSERT INTO bookmarks
    (id, title, url, description, rating)
VALUES
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2d', 'Thinkful', 'https://www.thinkful.com', 'Think outside the classroom', 5),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2w', 'Sinkly', 'https://www.sunkly.com', 'Sink with the skink', 3),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2z', 'Google', 'https://www.Google.com', 'Take over the world', 5),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2p', 'MDN', 'https://www.mdn.com', 'Web documentation', 3),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2x', 'Pokemon', 'https://www.pokemon.com', 'Gotta catch em all!', 4),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2q', 'NBA', 'https://www.nba.com', 'National Basketball Association', 4),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2v', 'Stack Overflow', 'https://www.stackoverflow.com', 'Stack Overflow', 5),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2t', 'VSC', 'https://www.visualstudiocode.com', 'The Best text editor', 5),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2a', 'Slack', 'https://www.slack.com', 'Slack with your team', 5),
    ('de9a0b51-93c6-4109-bf3d-42ae4f32bb2f', 'Bing', 'https://www.bing.com', 'Still searching for a user...', 5);

