import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RelationRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="genre">{this.props.genre}</div>
				<div className="rating">{this.props.rating}</div>
				<div className="votes">{this.props.votes}</div>
			</div>
		);
	}
}