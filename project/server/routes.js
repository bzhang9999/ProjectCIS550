var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getConflict(req, res) {

  console.log("hello");

  var queryAsString = 'SELECT DISTINCT name FROM Conflict ORDER BY name';
  connection.query(queryAsString, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
};


/* ---- Q1b (Dashboard) ---- */
function getCountriesInConflict(req, res) {

  console.log(req.params.conflict);

  var query = `SELECT name AS Conflict, country_id AS Country, side, num_deaths, name_at_conflict AS RealName
                FROM Conflict 
                JOIN Involved_In ON Conflict.conflict_id = Involved_In.conflict_id
                WHERE name = '${req.params.conflict}'
                ORDER BY side`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
  
};

/* ---- Q2 (Recommendations) ---- */
function getCountryRange(req, res) {

  console.log("year1: ", req.params.year1);
  console.log("year2: ", req.params.year2);
  console.log("country: ", req.params.country);
  console.log("country is empty: ", req.params.country == " ");
  console.log("About to enter rec");

  //console.log(req.params.rec)

  //var query = ``;

  if (req.params.country != " ") {
    console.log("Entered rec if");
    var query = 
    `WITH conflicts AS 
      ( SELECT Conflict.conflict_id, name, start_year, end_year
      FROM Conflict JOIN Involved_In ON Conflict.conflict_id = Involved_In.conflict_id
      WHERE ((${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year))
      AND country_id = (SELECT country_id FROM Country WHERE country_name = "${req.params.country}"))

      SELECT name AS Conflict_Name, name_at_conflict AS Country_Name, conflicts.start_year, conflicts.end_year
      FROM conflicts
      JOIN Involved_In ON conflicts.conflict_id = Involved_In.conflict_id
      WHERE country_id != (SELECT country_id FROM Country WHERE country_name = "${req.params.country}")`;

  } else {
    var query = 
    `WITH conflicts AS 
      ( SELECT *
      FROM Conflict
      WHERE (${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year))

      SELECT conflicts.name AS Conflict_Name, name_at_conflict AS Country_Name, conflicts.start_year, conflicts.end_year
      FROM conflicts 
      JOIN Involved_In ON conflicts.conflict_id = Involved_In.conflict_id`;
  }

  // var query = 
  // `WITH genreList AS (
  //   SELECT genre
  //   FROM genres
  //   JOIN movies ON movies.id = genres.movie_id
  //   WHERE movies.title = '${req.params.rec}'
  // )
  // SELECT movies.title, movies.id, movies.rating, movies.vote_count
  // FROM movies
  // JOIN genres ON movies.id = genres.movie_id
  // WHERE genre IN (SELECT genre FROM genreList) AND movies.title <> '${req.params.rec}'
  // GROUP BY movies.title, movies.id, movies.rating, movies.vote_count
  // HAVING COUNT(genre) = (SELECT COUNT(*) FROM genreList)
  // ORDER BY movies.rating DESC, movies.vote_count DESC
  // LIMIT 5;`;

  //console.log("query: " + query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
};

function getConflictTreaty(req, res) {

  console.log(req.params.year1);
  console.log(req.params.year2);
  console.log(req.params.country);
  console.log("About to enter treaty");

  //console.log(req.params.rec)

  //var query = ``;

  if (req.params.country != " ") {
    console.log("Entered treaty");
    var query = 
    `WITH country_1s AS
      (SELECT treaty_id, country1_id, country1_name_then, start_year, end_year
      FROM Has_Treaty
      WHERE (${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year)),

      country_2s AS
      (SELECT treaty_id, country2_id, country2_name_then
      FROM Has_Treaty
      WHERE (${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year))

      SELECT country1_name_then AS Country_1, country2_name_then AS Country_2, country_1s.start_year, country_1s.end_year
      FROM country_1s JOIN country_2s ON country_1s.treaty_id = country_2s.treaty_id
      WHERE country1_id = (SELECT country_id FROM Country WHERE country_name = "${req.params.country}") OR country2_id = (SELECT country_id FROM Country WHERE country_name = "${req.params.country}")
      ORDER BY country_1s.start_year;`;
  } else {
    var query = 
    `WITH country_1s AS
      (SELECT treaty_id, country1_id, country1_name_then, start_year, end_year
      FROM Has_Treaty
      WHERE (${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year)),

      country_2s AS
      (SELECT treaty_id, country2_id, country2_name_then
      FROM Has_Treaty
      WHERE (${req.params.year1} <= start_year AND start_year <= ${req.params.year2}) OR
      (${req.params.year1} <= end_year AND end_year <= ${req.params.year2}) OR
      (start_year < ${req.params.year1} AND ${req.params.year2} < end_year))

      SELECT country1_name_then AS Country_1, country2_name_then AS Country_2, country_1s.start_year, country_1s.end_year
      FROM country_1s JOIN country_2s ON country_1s.treaty_id = country_2s.treaty_id
      ORDER BY country_1s.start_year;`;
  }

  //console.log("query: " + query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
};

/* ---- (Best Genres) ---- */
function getCountries(req, res) {
	// var query = `
 //    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
 //    FROM (
 //      SELECT DISTINCT release_year as year
 //      FROM Movies
 //      ORDER BY release_year
 //    ) y
 //  `;

  var query = `SELECT country_name FROM Country ORDER BY country_name`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function getScores(req, res) {

  //let beginning = parseInt(req.params.decade);
  //let end = parseInt(beginning) + 9;

  var country1 = req.params.country1;
  var country2 = req.params.country2;

  console.log(country1);
  console.log(country2);

  var query = `WITH alliances AS
  (SELECT *
  FROM Has_Treaty
  WHERE country1_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country1}')
  AND country2_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country2}')
  OR country1_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country2}')
  AND country2_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country1}')),
  
  defense AS
  (SELECT COUNT(*) AS num_defense, COUNT(*) * -0.3 AS value1
  FROM alliances
  WHERE defense = 1),
  
  neutrality_nonaggression AS
  (SELECT COUNT(*) AS num_nn, COUNT(*) * -0.2 AS value1
  FROM alliances
  WHERE neutrality = 1 OR non_aggression = 1),
  
  entente AS
  (SELECT COUNT(*) AS num_entente, COUNT(*) * -0.1 AS value1
  FROM alliances
  WHERE entente = 1),
  
  scores_intermediary AS
  (SELECT value1 AS values1, num_defense AS num_treatises
  FROM defense
  UNION ALL
  SELECT value1 AS values1, num_nn AS num_treatises
  FROM neutrality_nonaggression),

  scores AS
  (SELECT values1, num_treatises
  FROM scores_intermediary
  UNION ALL
  SELECT value1 AS values1, num_entente AS num_treatises
  FROM entente),
  
  Country1 AS ( 
SELECT I.name_at_conflict, I.num_deaths, I.conflict_id, I.country_id, I.side
FROM Involved_In I 
JOIN City C ON I.country_id = C.country_id 
WHERE C.country_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country1}')  
GROUP BY conflict_id, I.name_at_conflict),  

Country2 AS ( 
SELECT I.name_at_conflict, I.num_deaths, I.conflict_id, I.country_id, I.side
FROM Involved_In I 
JOIN City C ON I.country_id = C.country_id 
WHERE C.country_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country2}')
GROUP BY conflict_id, I.name_at_conflict),

Country1_Pop AS (
SELECT country_id, SUM(population) AS population
FROM City C
WHERE C.country_id = (SELECT country_id FROM Country WHERE country_name = '${req.params.country1}')  
GROUP BY country_id),

Country2_Pop AS (
SELECT country_id, SUM(population) AS population
FROM City C
WHERE C.country_id =  (SELECT country_id FROM Country WHERE country_name = '${req.params.country2}')
GROUP BY country_id),
Ratios AS (
SELECT O.name_at_conflict AS country1, T.name_at_conflict AS country2, O.conflict_id, O.num_deaths AS deaths1, T.num_deaths AS deaths2, P.population AS population1, Q.population AS population2, O.num_deaths/P.population AS ratio1, T.num_deaths/Q.population AS ratio2
FROM Country1 O JOIN Country2 T ON O.conflict_id = T.conflict_id
		JOIN Country1_Pop P ON P.country_id = O.country_id
JOIN Country2_Pop Q ON Q.country_id = T.country_id
	WHERE O.side <> T.side
	),
AvgRatios AS (
SELECT country1, country2, AVG(ratio1) AS avgratio_country1, AVG(ratio2) AS avgratio_country2, 1000*(AVG(ratio1) + AVG(ratio2)) AS conflict_score, COUNT(country2) AS num_conflicts
FROM Ratios
GROUP BY country1, country2
)

SELECT SUM(num_treatises) AS num_treatises, SUM(values1) AS peace_score, MAX(num_conflicts) AS num_conflicts, MAX(conflict_score) AS conflict_score, CASE WHEN MAX(conflict_score)+SUM(values1) > 100 THEN 100 WHEN MAX(conflict_score) + SUM(values1) < -100 THEN -100 ELSE MAX(conflict_score) + SUM(values1) END AS peace_conflict_score 
FROM scores S JOIN AvgRatios;`;

  // var query = `
  //     WITH distinctGenres AS (
  //       SELECT DISTINCT genre
  //       FROM genres
  //   ), available AS (
  //       SELECT genres.genre, AVG(movies.rating) AS avg_rating
  //       FROM genres
  //       JOIN movies ON genres.movie_id = movies.id
  //       WHERE movies.release_year BETWEEN '${beginning}' AND '${end}'
  //       GROUP BY genres.genre
  //       )
  //   SELECT distinctGenres.genre, IFNULL(avg_rating, 0) AS avg_rating
  //   FROM distinctGenres
  //   LEFT JOIN available ON distinctGenres.genre = available.genre
  //   ORDER BY avg_rating DESC, distinctGenres.genre; 
  // `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getConflict: getConflict,
	getCountries: getCountries,
	getCountriesInConflict: getCountriesInConflict,
	getCountryRange: getCountryRange,
	getCountries: getCountries,
  getScores: getScores,
  getConflictTreaty: getConflictTreaty
}
