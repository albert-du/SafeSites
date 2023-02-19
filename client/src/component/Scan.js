import { Container } from "@material-ui/core"
import React, { Component, useRef } from "react"
import './Scan.css'

// function submitRequest() {
//     let url = document.getElementById("enteredURL").value;
//     return fetch(`http://${window.location.hostname}/url?url=${url}`)
//         .then(res => res.text())
//         .then(resText => {
//             let data = JSON.parse(resText)
//             document.getElementsByClassName("toxicity").innerHTML = `Toxicity: ${Math.round((data.toxicity + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("st").innerHTML = `Severe Toxicity: ${Math.round((data.severe_toxicity + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("o").innerHTML = `Obscenity: ${Math.round((data.obscene + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("ia").innerHTML = `Identity Attack: ${Math.round((data.identity_attack + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("i").innerHTML = `Insult: ${Math.round((data.insult + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("t").innerHTML = `Threat: ${Math.round((data.threat + Number.EPSILON) * 100)}%`
//             document.getElementsByClassName("se").innerHTML = `Sexual Explicity: ${Math.round((data.sexual_explicit + Number.EPSILON) * 100)}%`
//         })
// }
export default class Scan extends React.Component {
    state = {
        toxicity: null,
        severe_toxicity: null,
        obscene: null,
        identity_attack: null,
        insult: null,
        threat: null,
        sexual_explicity: null
    }
    render() {
        let startingURL
        let that = this
        function handleSubmit(event) {
            event.preventDefault();
            fetch(`http://${window.location.hostname}/url?url=${startingURL}`)
                .then(res => res.json())
                .then(json => {
                    that.setState({
                        toxicity: `Toxicity: ${Math.round((json.toxicity + Number.EPSILON) * 100)}%`,
                        severe_toxicity: `Severe Toxicity: ${Math.round((json.severe_toxicity + Number.EPSILON) * 100)}%`,
                        obscene: `Obscenity: ${Math.round((json.obscene + Number.EPSILON) * 100)}%`,
                        identity_attack: `Identity Attack: ${Math.round((json.identity_attack + Number.EPSILON) * 100)}%`,
                        insult: `Insult: ${Math.round((json.insult + Number.EPSILON) * 100)}%`,
                        threat: `Threat: ${Math.round((json.threat + Number.EPSILON) * 100)}%`,
                        sexual_explicity: `Sexual Explicity: ${Math.round((json.sexual_explicit + Number.EPSILON) * 100)}%`,
                    })
                })
        }
        return (
            <div className="scanPage" >
                <div className="header">
                    <h1>Scan Website</h1>
                </div>
                <div className="description">
                    <h2>To locate the best and most ethical online educational resources, copy and paste the URL of any website into this search bar to get a free website analysis! </h2>
                </div>
                <div className="search">
                    <form className="searchingURL" onSubmit={handleSubmit}>
                        <input type="text" className="borders" placeholder="Enter URL..." id="enteredURL" value={startingURL} />
                        <button className='btn1'>
                            Scan
                        </button>
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
}