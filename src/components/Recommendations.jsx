import React from "react";
import axios from "axios";
import { SpiralSpinner } from "react-spinners-kit";
import "./Styles.css";

class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topartist: [],
            toptracks: [],
            loader: false,
            seed_artists: [],
            seed_genres: [],
            seed_tracks: [],
            recommendations: [],
        };
    }

    componentDidMount() {
        this.getTopItems();
    }

    getTopItems = () => {
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };

        axios
            .all([
                axios
                    .get(
                        `https://api.spotify.com/v1/me/top/artists?&limit=3&time_range=medium_term`,
                        {
                            headers,
                        }
                    )
                    .then((response) => {
                        if (response.error) {
                            sessionStorage.removeItem("token");
                            window.location = this.props.redirect_uri;
                        }
                        for (let i = 0; i < 3; i++) {
                            this.setState((prevState) => ({
                                seed_artists: [
                                    ...prevState.seed_artists,
                                    response.data.items[i].id,
                                ],
                                seed_genres: [
                                    ...prevState.seed_genres,
                                    response.data.items[i].genres[0],
                                ].filter(Boolean),
                            }));
                        }
                    }),

                axios
                    .get(
                        `https://api.spotify.com/v1/me/top/tracks?&limit=3&time_range=medium_term`,
                        {
                            headers,
                        }
                    )
                    .then((response) => {
                        if (response.error) {
                            sessionStorage.removeItem("token");
                            window.location = this.props.redirect_uri;
                        }
                        for (let i = 0; i < 3; i++) {
                            this.setState((prevState) => ({
                                seed_tracks: [
                                    ...prevState.seed_tracks,
                                    response.data.items[i].id,
                                ],
                            }));
                        }

                        this.getRecommendations();
                    }),
            ])
            .catch(() => {
                sessionStorage.removeItem("token");
                window.location = this.props.redirect_uri;
            });
    };

    getRecommendations = () => {
        const { seed_artists, seed_genres, seed_tracks } = this.state;
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };
        for (let i = 0; i < 10; i++) {
            let artist = encodeURIComponent(seed_artists[i]);
            let genres = encodeURIComponent(seed_genres[i]).replaceAll("-", "");
            let tracks = encodeURIComponent(seed_tracks[i]);
            axios
                .get(
                    `https://api.spotify.com/v1/recommendations?seed_artists=${artist}&seed_genres=${genres}&seed_tracks=${tracks}`,
                    {
                        headers,
                    }
                )
                .then((response) => {
                    if (response.error) {
                        console.log("Error");
                    }
                    this.setState({
                        recommendations: response.data.tracks,
                    });
                });

            console.log(
                `https://api.spotify.com/v1/recommendations?seed_artists=${artist}&seed_genres=${genres}&seed_tracks=${tracks}`
            );
        }
    };

    render() {
        const { token, error } = this.props;
        const { recommendations } = this.state;

        return (
            <div>
                {token && !error && recommendations && (
                    <div className="recommend-section">
                        <h2 className="recommend-title"> Recomendaciones </h2>

                        <div className="recommend-view">
                            {recommendations.map((item, ind) => {
                                return (
                                    <div
                                    className="track-data"
                                    key={ind}
                                >
                                    <div className="left-data">
                                        <img
                                            src={
                                                item.album
                                                    .images[0].url
                                            }
                                            alt="album-img"
                                            className="album-img"
                                        />
                                        <div className="track-name">
                                            {item.name} -{" "}
                                            {item.artists[0].name}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {token && !error && !recommendations && (
                    <div className="loader">
                        <SpiralSpinner size={85} frontColor="#191414" />
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

export default Recommendations;
