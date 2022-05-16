import React from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-player";
import { SpiralSpinner } from "react-spinners-kit";
import ReactModal from "./ReactModal";
import "./Styles.css";
import { Scrollbars } from 'react-custom-scrollbars-2';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: "",
            track: "",
            trackAdd: [],
            results: [],
            playlists: [],
            getSearch: false,
            openModal: false,
            songuri: "",
            loader: false,
        };
    }

    searchBar = () => {
        const { song } = this.state;
        const { token } = this.props;
        if (song) {
            this.setState({
                loader: true,
                getSearch: true,
            });
            const headers = {
                Authorization: "Bearer " + token,
            };
            const url = `https://api.spotify.com/v1/search?q=${song}&type=track&limit=10`;
            axios
                .get(url, { headers })
                .then((response) => {
                    console.log(token);
                    if (response.error) {
                        sessionStorage.removeItem("token");
                        window.location = this.props.redirect_uri;
                    }

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
                .catch(() => {
                    this.setState({
                        results: [],
                        loader: false,
                    });
                });
        } else {
            alert(
                "Instrucciones: 1. Inserte el nombre de una canción 2. Pulse el botón 'Buscar'"
            );
        }
    };

    openReactModel = (track) => {
        this.setState({
            openModal: true,
            track,
        });
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };
        const url = `https://api.spotify.com/v1/me/playlists`;
        axios
            .get(url, { headers })
            .then((response) => {
                if (response.error) {
                    sessionStorage.removeItem("token");
                    window.location = this.props.redirect_uri;
                }
                if (response && response.data && response.data.items) {
                    this.setState({
                        playlists: response.data.items,
                    });
                } else {
                    this.setState({
                        playlists: [],
                    });
                }
            })
            .catch(() => {
                sessionStorage.removeItem("token");
                window.location = this.props.redirect_uri;
                this.setState({
                    playlists: [],
                });
            });
    };

    closeReactModel = () => {
        this.setState({
            openModal: false,
        });
    };

    addToPlaylist = (playlist, isOwner) => {
        if (!isOwner) {
            alert(
                "No eres dueño de la playlist, por lo que no se puede agregar la canción aquí."
            );
        } else {
            const { track, trackAdd } = this.state;
            const { token } = this.props;
            if (track && playlist) {
                const headers = {
                    Authorization: "Bearer " + token,
                };
                const url = `https://api.spotify.com/v1/playlists/${playlist}/tracks?uris=${track}`;
                axios
                    .post(url, {}, { headers })
                    .then((response) => {
                        if (response.error) {
                            sessionStorage.removeItem("token");
                            window.location = this.props.redirect_uri;
                        }
                        if (
                            response &&
                            response.data &&
                            response.data.snapshot_id
                        ) {
                            const newTrackArray = trackAdd;
                            newTrackArray.push(track);
                            this.setState({
                                trackAdd: newTrackArray,
                            });
                        } else {
                            this.setState({
                                trackAdd: [],
                            });
                        }
                    })
                    .catch(() => {
                        this.setState({
                            trackAdd: [],
                        });
                    });
            } else {
                alert("Ha habido un problema por el camino.");
            }
            this.closeReactModel();
        }
    };

    createPlaylist = (playlistName) => {
        if (playlistName) {
            const { track } = this.state;
            const { token, user } = this.props;
            const headers = {
                Authorization: "Bearer " + token,
            };
            const url = `https://api.spotify.com/v1/users/${user.id}/playlists`;
            const postData = {
                name: playlistName,
                description: `${playlistName} description`,
                public: false,
            };
            axios
                .post(url, postData, { headers })
                .then((response) => {
                    if (response.error) {
                        sessionStorage.removeItem("token");
                        window.location = this.props.redirect_uri;
                    }
                    if (response && response.data && response.data.uri) {
                        this.openReactModel(track);
                    } else {
                        this.setState({
                            openModal: false,
                        });
                    }
                })
                .catch(() => {
                    sessionStorage.removeItem("token");
                    window.location = this.props.redirect_uri;
                    this.setState({
                        openModal: false,
                    });
                });
        }
    };

    render() {
        const { token, error, user } = this.props;

        const {
            loader,
            results,
            getSearch,
            openModal,
            playlists,
            trackAdd,
            songuri,
        } = this.state;

        const sizeSpotifyPlayer = {
            width: "94%",
            height: 80,
        };

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
                                onKeyDown={this.handleKeyDown}
                            />
                            <button
                                className="searchButton"
                                onClick={this.searchBar}
                            >
                                Buscar
                            </button>
                        </div>
                        <div className="song-search-results">
                            {loader ? (
                                <div className="loader">
                                    <SpiralSpinner
                                        size={85}
                                        frontColor="#1db954"
                                    />
                                </div>
                            ) : (
                                <Scrollbars
                                    
                                style={{ width: 1300, height: 400 }}
                                >
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
                                                        this.setState({
                                                            songuri: song.uri,
                                                        });
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            song.album.images[0]
                                                                .url
                                                        }
                                                        alt="album-img"
                                                        className="album-img"
                                                    />
                                                    <div className="song-name">
                                                        {song.name} by{" "}
                                                        {song.artists[0].name}
                                                    </div>
                                                </div>
                                                <button
                                                    className="playlistButton"
                                                    onClick={() => {
                                                        if (
                                                            trackAdd.indexOf(
                                                                song.uri
                                                            ) < 0
                                                        )
                                                            this.openReactModel(
                                                                song.uri
                                                            );
                                                    }}
                                                >
                                                    {trackAdd.indexOf(
                                                        song.uri
                                                    ) > -1
                                                        ? "Agregada"
                                                        : "Agregar a playlist"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {getSearch && !results.length && (
                                        <div className="error">
                                            No se han encontrado resultados que
                                            coincidan con la busqueda.
                                        </div>
                                    )}
                                </div>
                                </Scrollbars>
                            )}

                            {getSearch && results.length && songuri && (
                                <div >
                                    <SpotifyPlayer
                                        uri={this.state.songuri}
                                        size={sizeSpotifyPlayer}
                                        view="list"
                                        theme="white"
                                    />
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

                {openModal && (
                    <ReactModal
                        user={user}
                        closeReactModel={this.closeReactModel}
                        playlists={playlists}
                        newPlaylist={this.createPlaylist}
                        addToPlaylist={this.addToPlaylist}
                    />
                )}
            </div>
        );
    }
}

export default Search;
