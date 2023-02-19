import React from "react"
import Navbar from "./component/Navbar"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Scan from "./component/Scan"
import About from "./component/About"
function App() {
  return (
    <>
    <Router>
    <Navbar />
      <Switch>
        <Route path='/Scan' component={Scan} exact><Scan /></Route>
        <Route path='/About' component={About} exact><About /></Route>
      </Switch>
    </Router>
    </>
  )
}

export default App;
