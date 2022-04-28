import React from "react";
import axios from "axios";
import "./Styles.css";

const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative",
];

class Search extends React.Component {
    constructor() {
        super();
        let token = sessionStorage.getItem("token");
        this.state = {
            error: false,
            token: token || null,
            user: {},
            song: "",
            track: "",
            loading: false,
            results: [],
            initializeSearch: false,
            redirect_uri: `${process.env.REACT_APP_API_AUTH}?client_id=${
                process.env.REACT_APP_API_CLIENT_ID
            }&redirect_uri=${
                process.env.REACT_APP_API_REDIRECT_URI
            }&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`,
        };
    }

    searchSong = () => {
        const { token, song } = this.state;
        if (song) {
            this.setState({
                loader: true,
                initializeSearch: true,
            });
            const headers = {
                Authorization: "Bearer " + token,
            };
            const url = `https://api.spotify.com/v1/search?q=${song}&type=track&limit=10`;
            axios
                .get(url, { headers })
                .then((response) => {
                    if (response.error) {
                        sessionStorage.removeItem("token");
                        window.location = this.state.redirect_uri;
                    }
                    console.table(response.data);
                    if (
                        response &&
                        response.data &&
                        response.data.tracks &&
                        response.data.tracks.items
                    ) {
                        this.setState({
                            results: response.data.tracks.items,
                            loader: false,
                        });
                    } else {
                        this.setState({
                            results: [],
                            loader: false,
                        });
                    }
                })
                .catch((error) => {
                    console.table("Song not found", error);
                    this.setState({
                        results: [],
                        loader: false,
                    });
                });
        } else {
            alert("Please enter something...");
        }
    };

    render() {
        const { token, loader, results, error, initializeSearch, user } =
            this.state;

        return (
            <div>
                {token && !error && user && (
                    <div className="search-view">
                        <div className="search-bar">
                            <input
                                type="search"
                                placeholder="Inserte nombre del artista o canción..."
                                className="searchInput"
                                onChange={(e) => {
                                    this.setState({
                                        song: e.target.value,
                                    });
                                }}
                            />
                            <button
                                className="searchButton"
                                onClick={this.searchSong}
                            >
                                Buscar
                            </button>
                        </div>
                        <div className="song-search-results">
                            {loader ? (
                                <div className="loader">LOADING</div>
                            ) : (
                                <div>
                                    <div className="results-list">
                                        {results.map((song, ind) => {
                                            return (
                                                <div
                                                    className="song-data"
                                                    key={ind}
                                                >
                                                    <div
                                                        className="left-data"
                                                        onClick={() => {
                                                            console.log(user);
                                                            this.setState({
                                                                songuri:
                                                                    song.uri,
                                                            });
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                song.album
                                                                    .images[0]
                                                                    .url
                                                            }
                                                            alt="album-img"
                                                            className="album-img"
                                                        />
                                                        <div className="song-name">
                                                            {song.name} by{" "}
                                                            {
                                                                song.artists[0]
                                                                    .name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {initializeSearch &&
                                            !results.length && (
                                                <div className="error">
                                                    No se han encontrado
                                                    canciones que coincidan con
                                                    la busqueda.
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {token && error && (
                    <div className="error">
                        No ha sido posible obtener los datos del usuario, por
                        favor, intentalo de nuevo.
                    </div>
                )}
            </div>
        );
    }
}

export default Search;
