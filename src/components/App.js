import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import MainPage from "./MainPage";

class App extends React.Component
{
    render() {
        return (
            <Router>
                <Route path={`/`} exact  component={MainPage} />
            </Router>
        )
    }
}

export default App;