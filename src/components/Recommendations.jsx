import "../styles/Styles.css";

import React from "react";
import { SpiralSpinner } from "react-spinners-kit";
import axios from "axios";

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

    getTopItems = async () => {
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };

        axios
            .all([
                axios.get(
                    `https://api.spotify.com/v1/me/top/artists?&limit=8&time_range=medium_term`,
                    {
                        headers,
                    }
                ),

                axios.get(
                    `https://api.spotify.com/v1/me/top/tracks?&limit=8&time_range=medium_term`,
                    {
                        headers,
                    }
                ),
            ])
            .then((responseArr) => {
                if (responseArr.error) {
                    sessionStorage.removeItem("token");
                    window.location = this.props.redirect_uri;
                }

                for (let i = 0; i < 8; i++) {
                    this.setState((prevState) => ({
                        seed_artists: [
                            ...prevState.seed_artists,
                            responseArr[0].data.items[i].id,
                        ],
                        seed_genres: [
                            ...prevState.seed_genres,
                            responseArr[0].data.items[i].genres[0],
                        ].filter(Boolean),
                        seed_tracks: [
                            ...prevState.seed_tracks,
                            responseArr[1].data.items[i].id,
                        ],
                    }));
                    if (i === 2) {
                        this.getRecommendations();
                    }
                }
            })
            .catch(() => {
                sessionStorage.removeItem("token");
                window.location = this.props.redirect_uri;
            });
    };

    getRecommendations = () => {
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };
        for (let i = 0; i < 8; i++) {
            let artist = encodeURIComponent(this.state.seed_artists[i]);
            let genres = encodeURIComponent(
                this.state.seed_genres[i]
            ).replaceAll("-", "");
            let tracks = encodeURIComponent(this.state.seed_tracks[i]);
            axios
                .get(
                    `https://api.spotify.com/v1/recommendations?seed_artists=${artist}&seed_genres=${genres}&seed_tracks=${tracks}`,
                    {
                        headers,
                    }
                )
                .then((response) => {
                    if (response.error) {
                        sessionStorage.removeItem("token");
                        window.location = this.props.redirect_uri;
                    }

                    this.setState((prevState) => ({
                        recommendations: [
                            ...prevState.recommendations,
                            response.data.tracks[0],
                        ],
                    }));
                });
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
                                    <div className="track-data" key={ind}>
                                        <div className="left-data">
                                            <img
                                                src={item.album.images[0].url}
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
