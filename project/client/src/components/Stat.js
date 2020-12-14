import React from 'react';
import PageNavbar from './PageNavbar';
import StatRow from './StatRow';
import '../style/Stat.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			startYear: "",
			endYear: "",
			country: " ",
			recMovies: [],
			treaties: [],
			countries: [],
			conflicts: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitEntry = this.submitEntry.bind(this);
		this.handleStartYear = this.handleStartYear.bind(this);
		this.handleEndYear = this.handleEndYear.bind(this);
		this.handleCountry = this.handleCountry.bind(this);

		
	}

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

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	}

	handleStartYear(e) {
		this.setState({
			startYear: e.target.value
		});
	}

	handleEndYear(e) {
		this.setState({
			endYear: e.target.value
		});
	}

	handleCountry(e) {
		this.setState({
			country: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitEntry() {

		let year1 = this.state.startYear;
		let year2 = this.state.endYear;
		let country = this.state.country;
		//let movieName = this.state.movieName;

		console.log("In submitMovie()");
		console.log("Recommendations - country: ", country);
		console.log("Recommendations - country is empty: ", country == " ");




		let route = "http://localhost:8081/countryRange/" + year1 + "/" + year2 + "/" + country + "/"; 
		//let route = "http://localhost:8081/recommendations/" + movieName;
	    console.log(route);
	    fetch(route, {
	      method: 'GET'
	    })
	      .then(res => res.json())
	      .then(conflictList => {
	        if (!conflictList) return;
	        console.log("recommendations received");
	       //console.log(recList);
	        let conflictDivs = conflictList.map((recObj, i) =>
	          //console.log(movieObj.title)
	          <StatRow title={recObj.Conflict_Name} id={recObj.Country_Name} rating={recObj.start_year} votes={recObj.end_year} />
	        );

	       // console.log(recDivs);

	        this.setState({
	          conflicts: conflictDivs
	        })

	      }).catch(err => console.log(err))

	      let route2 = "http://localhost:8081/conflictTreaty/" + year1 + "/" + year2 + "/" + country + "/";

	      fetch(route2, {
	      method: 'GET'
	    })
	      .then(res => res.json())
	      .then(treatyList => {
	        if (!treatyList) return;
	        console.log("recommendations received");
	        //console.log(recList);
	        let treatyDivs = treatyList.map((recObj, i) =>
	          //console.log(movieObj.title)
	          <StatRow title={recObj.Country_1} id={recObj.Country_2} rating={recObj.start_year} votes={recObj.end_year} />
	        );

	        //console.log(recDivs);

	        this.setState({
	          treaties: treatyDivs
			})
			
			this.state.country = " ";

	      }).catch(err => console.log(err))
		
	}

	
	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Statistical Exploration Page</div>
			    		<br></br>


			        <div className="h7">This page is meant as an exploration page for conflicts and treaties across certain time periods. If you enter a certain time range, the page will list
			        out all countries who were engaged in a conflict during that time period. Right after that list, a collection of countries who were in alliance during this period will also
			        be displayed. To begin, please enter a start year and end year.

			          <br></br>



					</div>
			    		<div className="input-container">
			    			<input type='text' placeholder="Start Year" value={this.state.startYear} onChange={this.handleStartYear} id="movieName" className="movie-input"/>
			  
			    		</div>

			    		<div className="input-container">
			    			<input type='text' placeholder="End Year" value={this.state.endYear} onChange={this.handleEndYear} id="movieName" className="movie-input2"/>
			    			
			    		</div>

						<div className="dropdown-container">
							<select value={this.state.country} onChange={this.handleCountry} className="dropdown" id="decadesDropdown">
								<option select value> -- select an option -- </option>
								{this.state.countries}
							</select>
							
						</div>
						<button id="submitMovieBtn" className="submit-btn" onClick={this.submitEntry}>Submit</button>
						


			       
			    		<div className="header-container">
			    			<div className="h6">CONFLICTS</div>
			    			<div className="headers">
			    				<div className="header"><strong>Conflict</strong></div>
			    				<div className="header"><strong>Country</strong></div>
					            <div className="header"><strong>Start Year</strong></div>
					            <div className="header"><strong>End Year</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.conflicts}
			    		</div>

			    		<div className="header-container">
			    			<div className="h6">TREATIES</div>
			    			<div className="headers">
			    				<div className="header"><strong>Country 1</strong></div>
			    				<div className="header"><strong>Country 2</strong></div>
					            <div className="header"><strong>Start Year</strong></div>
					            <div className="header"><strong>End Year</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.treaties}
			    		</div>
			    	</div>
			    </div>
			    <style>

		    	</style>
		    </div>

		);
	}
}