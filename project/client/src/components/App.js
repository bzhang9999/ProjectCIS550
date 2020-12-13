
import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Stat from './Stat';
import Relation from './Relation';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							path="/stat"
							render={() => (
								<Stat />
							)}
						/>
						<Route
							path="/relations"
							render={() => (
								<Relation />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}