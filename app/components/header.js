import React from 'react'
import './header.less'
import { Link } from 'react-router'

let Header = React.createClass({
    render() {
        return (
          <div className="row components-header">
        	<Link to="/"  className="-col-auto">	
            <img src="/static/images/logo.png" width="40" alt=""/>
            </Link>
        		<h1 className="caption">Music Player Build By React</h1>
        	</div>
        );
    }
});
export default Header;