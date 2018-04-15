-- What are the top 25 rated games in the past 20 years? --

-- WIth view GameVSscore --

SELECT title, avg_rating
FROM GameVSscore
LIMIT 25

-- Without views --

SELECT G.title AS title, F.average_score AS score
FROM game_dimension G, fact F
WHERE F.game_id = G.game_id
GROUP BY F.game_id
ORDER BY score DESC
LIMIT 25


--What are the top 5 popular genres based on average rating ? --

-- With view GenreVSScore

SELECT genre, avg_rating
FROM GenreVSScore
LIMIT 5

-- Without view

--What are the top 5 popular genres based on average rating ? --

SELECT G.genre, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.genre
ORDER BY Average_Score DESC
LIMIT 5


-- Which are the top 5 popular platform based on average score rating? --

-- With view PlatformVSScore

SELECT platform, avg_rating
FROM PlatformVSScore
LIMIT 5

-- Without view --

SELECT G.platform, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.platform
ORDER BY Average_Score DESC
LIMIT 5


--What are the top 5 popular genres based on editor's choice ? --

-- With view GenreVSEditor_Choice--

SELECT genre, Editor_choices
FROM GenreVSEditor_Choice
LIMIT 5

-- Without view --

SELECT G.genre, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
GROUP BY G.genre
ORDER BY number_of_editor_choices DESC
LIMIT 5


-- Which is the year with the greatest avg_rating -

-- With view yearvsscore

SELECT year, avg_rating
FROM yearvsscore
WHERE avg_rating = (SELECT MAX(avg_rating)
                    FROM yearvsscore)

-- Without view --

SELECT year, MAX(avg_score) AS avg_score
FROM
(
SELECT T.year AS year, AVG(F.average_score) AS avg_score
FROM fact F, time_dimension T
WHERE F.time_id = T.time_id
GROUP BY T.year
) AS T
WHERE avg_score = (SELECT MAX(avg_score)
                  FROM(
                  SELECT T.year As year, AVG(F.average_score) AS avg_score
                  FROM fact F, time_dimension T
                  WHERE F.time_id = T.time_id
                  GROUP BY T.year) AS T2
                  )
