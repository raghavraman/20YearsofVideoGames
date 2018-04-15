-- Analytical Queries--

-- What are the top 25 rated games in the past 20 years? --

SELECT G.title AS title, F.average_score AS score
FROM game_dimension G, fact F
WHERE F.game_id = G.game_id
GROUP BY F.game_id
ORDER BY score DESC
LIMIT 25



-- What are the games with score>8, editor_choice=y --

SELECT G.title AS title, F.average_score AS score, F.count_editor_choice AS editor_choice
FROM game_dimension G, fact F
WHERE F.game_id = G.game_id AND F.average_score > 8 AND F.count_editor_choice = 1



-- -What is the amount of games by each genre? --

SELECT genre, count(game_id) as game_count
FROM game_dimension
GROUP BY genre



--What is the average score rating  by each genre? --

SELECT G.genre, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.genre



--What are the top 5 popular genres? (editor's choice and average rating both) --

SELECT G.genre, AVG(F.average_score) AS Average_Score, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
GROUP BY G.genre
ORDER BY Average_Score, number_of_editor_choices DESC
LIMIT 5



--What are the top 5 popular genres based on average rating ? --

SELECT G.genre, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.genre
ORDER BY Average_Score DESC
LIMIT 5



--What are the top 5 popular genres based on editor's choice ? --

SELECT G.genre, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
GROUP BY G.genre
ORDER BY number_of_editor_choices DESC
LIMIT 5


-- What are the average scores of genres by years? --

SELECT T.year, G.genre, AVG(F.average_score) AS Average_Score
FROM game_dimension G, time_dimension T, fact F
WHERE F.time_id = T.time_id AND G.game_id = F.game_id
GROUP BY T.year, G.genre


--The above query is a generic one. If we want to find info about a particular genre
--add the particular genre in the where clause - I'm using Adventure as an example below
-- How has the popularity of genre 'Adventure' has changed over the last 20 years? --

SELECT T.year, G.genre, AVG(F.average_score) AS Average_Score
FROM game_dimension G, time_dimension T, fact F
WHERE F.time_id = T.time_id AND G.game_id = F.game_id AND G.genre = 'Adventure'
GROUP BY T.year, G.genre



--  Which platform had the most editor choice? --

SELECT G.platform, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
GROUP BY G.platform
ORDER BY number_of_editor_choices DESC
LIMIT 1

-- Without limit -- Remaining

SELECT Platform, MAX(number_of_editor_choices) AS number_of_editor_choices
FROM
(
SELECT G.platform AS Platform, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
GROUP BY G.platform
) AS T
WHERE number_of_editor_choices = (SELECT MAX(number_of_editor_choices)
                                    FROM (SELECT G.platform AS Platform, COUNT(F.count_editor_choice) AS number_of_editor_choices
                                          FROM game_dimension G, fact F
                                          WHERE G.game_id = F.game_id AND F.count_editor_choice = 1
                                          GROUP BY G.platform) AS T2)

-- Which is the most popular platform based on average score rating? --

SELECT G.platform, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.platform
ORDER BY Average_Score DESC
LIMIT 1

-- Without limit
SELECT Platform, MAX(Average_Score) AS Average_Score
FROM
(
SELECT G.platform AS Platform, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.platform
) AS T
WHERE Average_Score = (SELECT MAX(Average_Score)
                        FROM (SELECT G.platform AS Platform, AVG(F.average_score) AS Average_Score
                              FROM game_dimension G, fact F
                              WHERE G.game_id = F.game_id
                              GROUP BY G.platform) AS T2)



-- Which are the top 5 popular platform based on average score rating? --

SELECT G.platform, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.platform
ORDER BY Average_Score DESC
LIMIT 5



--What is the most popular genre with respect to a platform? --
-- change platform as required

SELECT G.platform, G.genre, COUNT(F.game_id) AS Genre_Frequency
FROM game_dimension G, fact F
WHERE F.game_id = G.game_id AND G.platform = 'PC'
GROUP BY G.platform, G.genre
ORDER BY Genre_Frequency DESC
LIMIT 1

-- Without Limit --

SELECT Platform, Genre, MAX(Genre_Frequency)
FROM
(
SELECT G.platform AS Platform, G.genre AS Genre, COUNT(F.game_id) AS Genre_Frequency
FROM game_dimension G, fact F
WHERE F.game_id = G.game_id AND G.platform = 'PC'
GROUP BY G.platform, G.genre
) AS T
WHERE Genre_Frequency = (SELECT MAX(Genre_Frequency)
                         FROM (SELECT G.platform AS Platform, G.genre AS Genre, COUNT(F.game_id) AS Genre_Frequency
                                FROM game_dimension G, fact F
                                WHERE F.game_id = G.game_id AND G.platform = 'PC'
                                GROUP BY G.platform, G.genre) AS T2)




-- Which platforms has the avg rating of games of more than 7.0?

SELECT G.platform, AVG(F.average_score) AS Average_Score
FROM game_dimension G, fact F
WHERE G.game_id = F.game_id
GROUP BY G.platform
HAVING Average_Score > 7



-- How has the use of each platform changed annually over the bi-decennial? --
--What number of games are released on each platform annually?--

SELECT T.year, G.platform, COUNT(F.game_id)
FROM game_dimension G, time_dimension T, fact F
WHERE F.time_id = T.time_id AND G.game_id = F.game_id
GROUP BY T.year, G.platform



--The above query is a generic one. If we want to find info about a particular platform
--add the particular platform in the where clause - I'm using PC as an example below
-- How has the use of platform 'PC' changed annually over the bi-decennial? --

SELECT T.year, G.platform, COUNT(F.game_id)
FROM game_dimension G, time_dimension T, fact F
WHERE F.time_id = T.time_id AND G.game_id = F.game_id AND G.platform = 'PC'
GROUP BY T.year, G.platform



-- Which is the most common score/rating that gamers tend to give? --

SELECT average_score AS common_rating, COUNT(average_score) AS frequency
FROM fact
GROUP BY average_score
ORDER BY frequency DESC
LIMIT 1

-- Without Limit --

SELECT common_rating, MAX(frequency) AS frequency
FROM
(
SELECT average_score AS common_rating, COUNT(average_score) AS frequency
FROM fact
GROUP BY average_score
) AS T
WHERE frequency = (SELECT MAX(frequency)
                    FROM (
                    SELECT average_score AS common_rating, COUNT(average_score) AS frequency
                    FROM fact
                    GROUP BY average_score
                    ) AS T2)


--How many games were released in each year?--

SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id
GROUP BY T.year



-- Which year has the highest number of releases?--

SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id
GROUP BY T.year
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT year, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year AS year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id
GROUP BY T.year
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released)
                              FROM (
                              SELECT T.year AS year, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id
                              GROUP BY T.year
                              )AS T2)


-- Which is the year with the greatest avg_rating -

SELECT T.year, AVG(F.average_score) AS avg_score
FROM fact F, time_dimension T
WHERE F.time_id = T.time_id
GROUP BY T.year
ORDER BY avg_score DESC
LIMIT 1

-- Without Limit --

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


-- In which year did the games get maximum number of editor choices --

SELECT T.year, COUNT(F.count_editor_choice) AS No_of_Editor_choices
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.year
ORDER BY No_of_Editor_choices DESC
LIMIT 1

-- Without Limit --

SELECT year, MAX(No_of_Editor_choices) AS No_of_Editor_choices
FROM
(
SELECT T.year AS year, COUNT(F.count_editor_choice) AS No_of_Editor_choices
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.year
) AS T
WHERE No_of_Editor_choices = (SELECT MAX(No_of_Editor_choices)
                              FROM(
                              SELECT T.year AS year, COUNT(F.count_editor_choice) AS No_of_Editor_choices
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
                              GROUP BY T.year
                              ) AS T2
                              )

-- How many high-rated games were released each year ?(high rated is rating >=8 --

SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8
GROUP BY T.year



-- Which year has the maximum number of high scoring games released? --

SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8
GROUP BY T.year
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT year, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year AS year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8
GROUP BY T.year
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released)
                              FROM(
                              SELECT T.year AS year, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND F.average_score >= 8
                              GROUP BY T.year
                              ) AS T2
                              )



-- Which year has the maximum number of high scoring games released recommended by Editor? --

SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
GROUP BY T.year
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT year, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year AS year, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
GROUP BY T.year
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released)
                              FROM(
                              SELECT T.year, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
                              GROUP BY T.year
                              ) AS T2
                              )



-- Which month has the highest number of releases?--

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id
GROUP BY T.year, T.month
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id
GROUP BY T.year, T.month
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released) FROM
                              (
                              SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id
                              GROUP BY T.year, T.month
                              ) AS T2
                              )


-- In which month did the games get maximum number of editor choices --

SELECT T.year,T.month, COUNT(F.count_editor_choice) AS No_of_Editor_choices
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.year, T.month
ORDER BY No_of_Editor_choices DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Editor_choices) AS No_of_Editor_choices
FROM
(
SELECT T.year,T.month, COUNT(F.count_editor_choice) AS No_of_Editor_choices
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.year, T.month
) AS T
WHERE No_of_Editor_choices = (SELECT MAX(No_of_Editor_choices)
                              FROM (
                              SELECT T.year,T.month, COUNT(F.count_editor_choice) AS No_of_Editor_choices
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND F.count_editor_choice = 1
                              GROUP BY T.year, T.month
                              ) AS T2
                              )

-- Which is the month with the greatest avg_rating --

SELECT T.year,T.month, AVG(F.average_score) AS avg_score
FROM fact F, time_dimension T
WHERE F.time_id = T.time_id
GROUP BY T.year, T.month
ORDER BY avg_score DESC
LIMIT 1

-- Without Limit --

SELECT T.year,T.month, MAX(avg_score) AS avg_score
FROM
(
SELECT T.year,T.month, AVG(F.average_score) AS avg_score
FROM fact F, time_dimension T
WHERE F.time_id = T.time_id
GROUP BY T.year, T.month
) AS T
WHERE avg_score = (SELECT MAX(avg_score)
                    FROM(
                    SELECT T.year,T.month, AVG(F.average_score) AS avg_score
                    FROM fact F, time_dimension T
                    WHERE F.time_id = T.time_id
                    GROUP BY T.year, T.month
                    ) AS T2
                    )

-- Which month has the highest rated releases of all time? --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8
GROUP BY T.year, T.month
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

--Without Limit --

SELECT T.year, T.month, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8
GROUP BY T.year, T.month
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM (
                                          SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8
                                          GROUP BY T.year, T.month
                                          ) AS T2
                                          )



-- Which month has the highest rated releases of all time having editor's choice? --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
GROUP BY T.year, T.month
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
GROUP BY T.year, T.month
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM(
                                          SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1
                                          GROUP BY T.year, T.month
                                          ) AS T2
                                          )


-- Which month has the highest releases for a year? --
-- change the value of year in where clause for different years

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND T.year = 2008
GROUP BY T.year, T.month
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND T.year = 2008
GROUP BY T.year, T.month
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released)
                              FROM (
                              SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND T.year = 2008
                              GROUP BY T.year, T.month
                              ) AS T2
                              )

-- Which month has the highest rated releases in a year? --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
GROUP BY T.year, T.month
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
GROUP BY T.year, T.month
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM(
                                          SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
                                          GROUP BY T.year, T.month
                                          ) AS T2
                                          )

-- Which month has the highest rated releases in a year having editor's choice? --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
GROUP BY T.year, T.month
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.month, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
GROUP BY T.year, T.month
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM(
                                          SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
                                          GROUP BY T.year, T.month
                                          ) AS T2
                                          )


-- What is the average score of games with titles that contain words like dead, horror, war, and evil? --

SELECT AVG(F.average_score) AS Average_Rating
fROM Fact F, game_dimension G
WHERE f.game_id = G.game_id AND G.title LIKE '%war%'


-- The above is a generalized query, The same will work for all keywords . FOR EG: for evil:

SELECT AVG(F.average_score) AS Average_Rating
fROM Fact F, game_dimension G
WHERE f.game_id = G.game_id AND G.title LIKE '%evil%'


-- What is the most ideal season to release games based on average_rating? --

SELECT T.season, AVG(F.average_score) AS Average_Rating
FROM fact F, time_dimension T
WHERE f.time_id = T.time_id
GROUP BY T.season
ORDER BY Average_Rating DESC
LIMIT 1

-- Without Limit --

SELECT T.season, MAX(Average_Rating) AS Average_Rating
FROM
(
SELECT T.season, AVG(F.average_score) AS Average_Rating
FROM fact F, time_dimension T
WHERE f.time_id = T.time_id
GROUP BY T.season
) AS T
WHERE Average_Rating = (SELECT MAX(Average_Rating)
                        FROM (
                        SELECT T.season, AVG(F.average_score) AS Average_Rating
                        FROM fact F, time_dimension T
                        WHERE f.time_id = T.time_id
                        GROUP BY T.season
                        ) AS T2
                        )

-- What is the most ideal season to release games based on editor's choice? --

SELECT T.season, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM fact F, time_dimension T
WHERE f.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.season
ORDER BY number_of_editor_choices DESC
LIMIT 1

-- Without Limit --

SELECT T.season, MAX(number_of_editor_choices) AS number_of_editor_choices
FROM
(
SELECT T.season, COUNT(F.count_editor_choice) AS number_of_editor_choices
FROM fact F, time_dimension T
WHERE f.time_id = T.time_id AND F.count_editor_choice = 1
GROUP BY T.season
) AS T
WHERE number_of_editor_choices = (SELECT MAX(number_of_editor_choices)
                                  FROM (
                                  SELECT T.season, COUNT(F.count_editor_choice) AS number_of_editor_choices
                                  FROM fact F, time_dimension T
                                  WHERE f.time_id = T.time_id AND F.count_editor_choice = 1
                                  GROUP BY T.season
                                  ) AS T2
                                  )


-- Which season has the highest number of releases for a year? --
-- change the value of year in where clause for different years

SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND T.year = 2008
GROUP BY T.year, T.season
ORDER BY No_of_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.season, MAX(No_of_Games_Released) AS No_of_Games_Released
FROM
(
SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND T.year = 2008
GROUP BY T.year, T.season
) AS T
WHERE No_of_Games_Released = (SELECT MAX(No_of_Games_Released)
                              FROM(
                              SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Games_Released
                              FROM time_dimension T, fact F
                              WHERE F.time_id = T.time_id AND T.year = 2008
                              GROUP BY T.year, T.season
                              ) AS T2
                              )


-- Which season has the highest rated releases in a year? --

SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
GROUP BY T.year, T.season
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.season, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
GROUP BY T.year, T.season
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM(
                                          SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8 AND T.year = 2008
                                          GROUP BY T.year, T.season
                                          ) AS T2
                                          )



-- Which season has the highest rated releases in a year having editor's choice? --

SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
GROUP BY T.year, T.season
ORDER BY No_of_Successful_Games_Released DESC
LIMIT 1

-- Without Limit --

SELECT T.year, T.season, MAX(No_of_Successful_Games_Released) AS No_of_Successful_Games_Released
FROM
(
SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
GROUP BY T.year, T.season
) AS T
WHERE No_of_Successful_Games_Released = (SELECT MAX(No_of_Successful_Games_Released)
                                          FROM(
                                          SELECT T.year, T.season, COUNT(F.game_id) AS No_of_Successful_Games_Released
                                          FROM time_dimension T, fact F
                                          WHERE F.time_id = T.time_id AND F.average_score >= 8 AND F.count_editor_choice = 1 AND T.year = 2008
                                          GROUP BY T.year, T.season
                                          ) AS T2
                                          )


-- Extra Queries --

-- Year and Rating --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F
WHERE F.time_id = T.time_id AND T.year = 2008 AND F.average_score = 8.0
GROUP BY T.year, T.month

-- Genre and Year --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F, game_dimension G
WHERE F.time_id = T.time_id AND T.year = '?' AND F.game_id = G.game_id AND G.genre = '?'
GROUP BY T.year, T.month


-- Platform and Year --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F, game_dimension G
WHERE F.time_id = T.time_id AND T.year = '2008' AND F.game_id = G.game_id AND G.Platform = 'PC'
GROUP BY T.year, T.month

-- Genre, Rating and Year --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F, game_dimension G
WHERE F.time_id = T.time_id AND T.year = '?' AND F.game_id = G.game_id AND G.genre = '?' AND F.average_score = '?'
GROUP BY T.year, T.month


-- Genre, Rating , PLatform and Year --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F, game_dimension G
WHERE F.time_id = T.time_id AND T.year = '?' AND F.game_id = G.game_id AND G.genre = '?' AND F.average_score = '?' AND G.Platform = '?'
GROUP BY T.year, T.month

-- Genre, Platform and Year --

SELECT T.year, T.month, COUNT(F.game_id) AS No_of_Games_Released
FROM time_dimension T, fact F, game_dimension G
WHERE F.time_id = T.time_id AND T.year = '?' AND F.game_id = G.game_id AND G.genre = '?' AND G.Platform = '?'
GROUP BY T.year, T.month

