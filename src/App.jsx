import "./App.css";
import OAuth from "./components/OAuth";
import spotifylogo from "./img/spotifylogo.png";

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <img src={spotifylogo} alt="spotify-logo" />
                <div className="name-header">Spotify Web API</div>
            </div>
            <OAuth />
        </div>
    );
}

export default App;
