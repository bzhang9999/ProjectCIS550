import React from 'react';
import PageNavbar from './PageNavbar';
import RelationRow from './RelationRow';
import '../style/Relation.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			country1: "",
			country2: "",
			selectedDecade: "",
			decades: [],
			genres: [],
			countries: [],
			scores: []
		};

		this.submitCountries = this.submitCountries.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleChange2 = this.handleChange2.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {

		console.log("country drop downs");

		// Send an HTTP request to the server.
	    fetch("http://localhost:8081/countries", {
	      method: 'GET' // The type of HTTP request.
	    })
	      .then(res => res.json()) // Convert the response data to a JSON.
	      .then(countriesList => {
	        if (!countriesList) return;
	        // Map each genreObj in genreList to an HTML element:
	        // A button which triggers the showMovies function for each genre.
	        //console.log("hello");
	        //let h = 'hello';

	        //the field name should be the column name
	        let countryDivs = countriesList.map((countryObj, i) =>
	          <option value ={countryObj.country_name}>{countryObj.country_name}</option>
	        );

	        // Set the state of the genres list to the value returned by the HTTP response from the server.
	        this.setState({
	          countries: countryDivs
	        })
	      })
	      .catch(err => console.log(err))	// Print the error if there is one.


	
	}

	handleChange(e) {
		this.setState({
			country1: e.target.value
		});
	}

	handleChange2(e) {
		this.setState({
			country2: e.target.value
		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitCountries() {

		let year = this.state.selectedDecade;
		let country1 = this.state.country1;
		let country2 = this.state.country2;
		console.log(country1);
		console.log(country2);
		let route = "http://localhost:8081/getscores/" + country1 + "/" + country2;
		console.log(route);

		fetch(route, {
	      method: 'GET' // The type of HTTP request.
	    })
	      .then(res => res.json()) // Convert the response data to a JSON.
	      .then(scoreList => {
	        if (!scoreList) return;
	        // Map each genreObj in genreList to an HTML element:
	        // A button which triggers the showMovies function for each genre.
	        //console.log("hello");
	        //let h = 'hello';
	        ///console.log(genreAvgList);
	        let scoreDivs = scoreList.map((scoreObj, i) =>
	        	<RelationRow genre={scoreObj.peace_conflict_score} rating={scoreObj.num_conflicts} votes={scoreObj.num_treatises}/>
	        );

	        // Set the state of the genres list to the value returned by the HTTP response from the server.
	        this.setState({
	          scores: scoreDivs
	        })
	      })
	      .catch(err => console.log(err))	// Print the error if there is one.

		
	}

	render() {

		return (
			<div className="Country Relationships">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			      	<div className="h3"> Statistical Relationship Page</div>
			        <div className="h7">The peace and conflict score (0 meaning that the two countries are at complete peace and 100 meaning 
			        that the two countries are in complete conflict) is calculated using the following method. We calculate the peace score by 
			        weighing the different types of treaties based on the degree of peacefulness: 0.4 for defense, 0.3 for neutrality, 0.3 for
			         nonaggression, and 0.1 for entente (based on dataset description  <a href="https://correlatesofwar.org/data-sets/formal-alliances/formal-alliances-v4-1">here</a> 
			         ). We also factor in multiple labels per treatise, which indicates that more treatise leads to a stronger alliance. To calculate the conflict score, we weigh the number 
			         of deaths over the total population of the country for each war that the two countries have been involved in, take the average of the ratios, and multiply that value by
			          1000 to get a value that ranges from 0 to around 67. Finally, add the peace score and the conflict score for a value between 0 and 100. To begin,
			          please select two countries below.



					</div>




			        

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.country1} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.countries}
			            </select>
			          </div>
			          <div className="dropdown-container2">
			            <select value={this.state.country2} onChange={this.handleChange2} className="dropdown2" id="decadesDropdown2">
			            	<option select value> -- select an option -- </option>
			            	{this.state.countries}
			            </select>
			            <br>
			            </br>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitCountries}>Submit</button>
			          </div>
			        </div>

			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Conflict Score</strong></div>
			            <div className="header"><strong>Num Conflicts</strong></div>
			            <div className="header"><strong>Num Treaties</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.scores}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}