const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */




/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.
app.get('/conflicts', routes.getConflict);






/* ---- Q1b (Dashboard) ---- */
app.get('/conflicts/:conflict', routes.getCountriesInConflict); // Hint: Replace () => {} with the appropriate route handler.








/* ---- Q2 (Recommendations) ---- */
app.get('/countryRange/:year1/:year2/:country/', routes.getCountryRange);



app.get('/conflictTreaty/:year1/:year2/:country/', routes.getConflictTreaty);





/* ---- (Best Genre) ---- */
app.get('/countries', routes.getCountries);






/* ---- Q3b (Best Genre) ---- */


app.get('/getscores/:country1/:country2', routes.getScores);





app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
