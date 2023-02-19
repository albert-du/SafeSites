import { Container } from "@material-ui/core"
import React from "react"
import './Scan.css'

const Scan = () => {
    return (
        <div className="scanPage">
            <div className="header">
                <h1>Scan Website</h1>
            </div>
            <div className="description">
            <h2>To locate the best and most ethical online educational resources, copy and paste the URL of any website into this search bar to get a free website analysis! </h2>
            </div>
        <div className="search">
            <form className="searchingURL">
                <input type="text" className="borders" placeholder="Enter URL..."/>
                <button className='btn1'>Scan</button>
            </form>
        </div>
        <div className='resultBox'>
            <form className="results">
                <text className="toxicity">Toxicity: 0.00% </text>
                <text className="st">Severe Toxicity: 0.00%</text>
                <text className="o">Obscenity: 0.00%</text>
                <text className="ia">Identity Attack: 0.00%</text>
                <text className="i">Insult: 0.00%</text>
                <text className="t">Threat: 0.00%</text>
                <text className="se">Sexually Explicit: 0.00%</text>
            </form>
        </div>
        <div className="mission">
            <h1 className="header1">
                Our Mission:
            </h1>
            <h2 className="header2">
                Many students around the world don't have access to expensive, paid-for educational content. We hope that this website will help these students locate safe, high-quality educational content around the internet without being worried about hate or malicious content.
            </h2>
        </div>
        <form className="endspacing">
        </form>
        </div>
    )
}

export default Scan