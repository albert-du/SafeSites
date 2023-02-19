import { Container } from "@material-ui/core"
import React, { Component, useRef } from "react"
import './Scan.css'

export default class Scan extends React.Component {
    state = {
        toxicity: "0.00",
        severe_toxicity: "0.00",
        obscene: "0.00",
        identity_attack: "0.00",
        insult: "0.00",
        threat: "0.00",
        sexual_explicity: "0.00",
        loading: "none",
        opacity: "hidden",
        animation: "spin-anim 1.8s linear infinite",
    }
    render() {
        let startingURL

        let that = this
        function handleSubmit(event) {
            event.preventDefault();
            if (startingURL) {
                that.setState({
                    toxicity: "0.00",
                    severe_toxicity: "0.00",
                    obscene: "0.00",
                    identity_attack: "0.00",
                    insult: "0.00",
                    threat: "0.00",
                    sexual_explicity: "0.00",
                    loading: "flex",
                    opacity: "visible",
                    animation: "spin-anim 1.8s linear infinite",
                })
                fetch(`http://${window.location.hostname}/url?url=${startingURL}`)
                    .then(res => res.json())
                    .then(async json => {
                        that.setState({
                            toxicity: !isNaN((json.toxicity * 100).toFixed(2)) ? (json.toxicity * 100).toFixed(2) : 0.01,
                            severe_toxicity: !isNaN((json.severe_toxicity * 100).toFixed(2)) ? (json.severe_toxicity * 100).toFixed(2) : 0.01,
                            obscene: !isNaN((json.obscene * 100).toFixed(2)) ? (json.obscene * 100).toFixed(2) : 0.01,
                            identity_attack: !isNaN((json.identity_attack * 100).toFixed(2)) ? (json.identity_attack * 100).toFixed(2) : 0.01,
                            insult: !isNaN((json.insult * 100).toFixed(2)) ? (json.insult * 100).toFixed(2) : 0.01,
                            threat: !isNaN((json.threat * 100).toFixed(2)) ? (json.threat * 100).toFixed(2) : 0.01,
                            sexual_explicity: !isNaN((json.sexual_explicity * 100).toFixed(2)) ? (json.sexual_explicity * 100).toFixed(2) : 0.01,
                            loading: "flex",
                            opacity: "visible",
                            animation: "fade-in-spinner 0.5s ease-in forwards",
                        })
                        await new Promise(r => setTimeout(r, 500));
                        that.setState({
                            toxicity: !isNaN((json.toxicity * 100).toFixed(2)) ? (json.toxicity * 100).toFixed(2) : 0.01,
                            severe_toxicity: !isNaN((json.severe_toxicity * 100).toFixed(2)) ? (json.severe_toxicity * 100).toFixed(2) : 0.01,
                            obscene: !isNaN((json.obscene * 100).toFixed(2)) ? (json.obscene * 100).toFixed(2) : 0.01,
                            identity_attack: !isNaN((json.identity_attack * 100).toFixed(2)) ? (json.identity_attack * 100).toFixed(2) : 0.01,
                            insult: !isNaN((json.insult * 100).toFixed(2)) ? (json.insult * 100).toFixed(2) : 0.01,
                            threat: !isNaN((json.threat * 100).toFixed(2)) ? (json.threat * 100).toFixed(2) : 0.01,
                            sexual_explicity: !isNaN((json.sexual_explicity * 100).toFixed(2)) ? (json.sexual_explicity * 100).toFixed(2) : 0.01,
                            loading: "none",
                            opacity: "hidden",
                            animation: "spin-anim 1.8s linear infinite"
                        })
                    })
            }
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
                        <input type="text" className="borders" placeholder="Enter URL..." id="enteredURL" onChange={(e) => startingURL = (e.target.value)} value={startingURL} />
                        <button className='btn1'>
                            Scan
                        </button>
                    </form>
                </div>
                <div className="loader-container" style={{ visibility: this.state.opacity }}>
                    <div className="spinner" display={this.state.loading} style={{ visibility: this.state.opacity, animation: this.state.animation }}></div>
                </div>
                <div className='resultBox'>
                    <form className="results">
                        <text className="toxicity">Toxicity: {this.state.toxicity}%</text>
                        <text className="st">Severe Toxicity: {this.state.severe_toxicity}%</text>
                        <text className="o">Obscenity: {this.state.obscene}%</text>
                        <text className="ia">Identity Attack: {this.state.identity_attack}%</text>
                        <text className="i">Insult: {this.state.insult}%</text>
                        <text className="t">Threat: {this.state.threat}%</text>
                        <text className="se">Sexually Explicit: {this.state.sexual_explicity}%</text>
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