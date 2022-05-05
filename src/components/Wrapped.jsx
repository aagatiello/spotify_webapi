import React from "react";
import axios from "axios";
import { SpiralSpinner } from "react-spinners-kit";
import "./Styles.css";

class Wrapped extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topartist: [],
            toptracks: [],
            loader: false,
            time_range: "medium_term",
        };
    }

    componentDidMount() {
        this.getTopItems();
    }

    getTopItems = () => {
        const { time_range } = this.state;
        const { token } = this.props;
        const headers = {
            Authorization: "Bearer " + token,
        };

        axios
            .all([
                axios
                    .get(
                        `https://api.spotify.com/v1/me/top/artists?&limit=10&time_range=${time_range}`,
                        {
                            headers,
                        }
                    )
                    .then((response) => {
                        if (response.error) {
                            sessionStorage.removeItem("token");
                            window.location = this.props.redirect_uri;
                        }
                        this.setState({
                            topartist: response.data.items,
                        });
                    }),

                axios
                    .get(
                        `https://api.spotify.com/v1/me/top/tracks?&limit=10&time_range=${time_range}`,
                        {
                            headers,
                        }
                    )
                    .then((response) => {
                        if (response.error) {
                            sessionStorage.removeItem("token");
                            window.location = this.props.redirect_uri;
                        }
                        this.setState({
                            toptracks: response.data.items,
                        });
                    }),
            ])
            .catch(() => {
                sessionStorage.removeItem("token");
                window.location = this.props.redirect_uri;
            });
    };

    render() {
        const { token, error } = this.props;
        const { loader, topartist, toptracks } = this.state;

        return (
            <div>
                {token && !error && topartist && toptracks && (
                    <div className="wrapped-section">
                        <div className="wrapped-title"> Estadisticas </div>
                        <div className="wrapped-buttons">
                            <button
                                className="wrappedButton"
                                onClick={() => {
                                    this.setState({
                                        time_range: "long_term",
                                    });
                                    this.getTopItems();
                                }}
                            >
                                Siempre
                            </button>
                            <button
                                className="wrappedButton"
                                onClick={() => {
                                    this.setState({
                                        time_range: "medium_term",
                                    });
                                    this.getTopItems();
                                }}
                            >
                                Ultimos seis meses
                            </button>
                            <button
                                className="wrappedButton"
                                onClick={() => {
                                    this.setState({
                                        time_range: "short_term",
                                    });
                                    this.getTopItems();
                                }}
                            >
                                Ultimo mes
                            </button>
                        </div>
                        {loader ? (
                            <div className="loader">
                                <SpiralSpinner size={85} frontColor="#191414" />
                            </div>
                        ) : (
                            <div className="wrapped-view">
                                <div className="topartist-list">
                                    {topartist.map((artist, ind) => {
                                        return (
                                            <div
                                                className="artist-data"
                                                key={ind}
                                            >
                                                <div className="left-data">
                                                    <img
                                                        src={
                                                            artist.images[0].url
                                                        }
                                                        alt="album-img"
                                                        className="album-img"
                                                    />
                                                    <div className="artist-name">
                                                        {artist.name}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="toptracks-list">
                                    {toptracks.map((track, ind) => {
                                        return (
                                            <div
                                                className="track-data"
                                                key={ind}
                                            >
                                                <div className="left-data">
                                                    <img
                                                        src={
                                                            track.album
                                                                .images[0].url
                                                        }
                                                        alt="album-img"
                                                        className="album-img"
                                                    />
                                                    <div className="track-name">
                                                        {track.name} -{" "}
                                                        {track.artists[0].name}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
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

export default Wrapped;