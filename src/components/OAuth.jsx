import React from "react";
import axios from "axios";
import Search from "./Search";
import "./Styles.css";

const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative",
];

class OAuth extends React.Component {
    constructor() {
        super();
        let token = sessionStorage.getItem("token");
        this.state = {
            error: false,
            token: token || null,
            user: {},
            redirect_uri: `${process.env.REACT_APP_API_AUTH}?client_id=${
                process.env.REACT_APP_API_CLIENT_ID
            }&redirect_uri=${
                process.env.REACT_APP_API_REDIRECT_URI
            }&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`,
        };
    }

    componentDidMount() {
        const hash = this.getToken();
        let _token = hash.access_token;
        if (_token) {
            this.setState({
                token: _token,
            });
            sessionStorage.setItem("token", _token);
            this.getUser(_token);
        } else {
            const { token } = this.state;
            if (token) {
                this.getUser(token);
            }
        }
    }

    getToken = () => {
        const hash = window.location.hash
            .substring(1)
            .split("&")
            .reduce(function (initial, item) {
                if (item) {
                    var parts = item.split("=");
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});
        window.location.hash = "";
        return hash;
    };

    getUser = (token) => {
        const headers = {
            Authorization: "Bearer " + token,
        };
        const url = "https://api.spotify.com/v1/me/";
        axios
            .get(url, { headers })
            .then((response) => {
                if (response.error) {
                    sessionStorage.removeItem("token");
                    window.location = this.state.redirect_uri;
                }
                console.table(response.data);
                this.setState({
                    user: response.data,
                });
            })
            .catch(() => {
                sessionStorage.removeItem("token");
                window.location = this.state.redirect_uri;
                this.setState({
                    error: true,
                });
            });
    };

    componentWillUnmount() {
        clearInterval(this.token);
    }

    render() {
        const { redirect_uri, token, error } = this.state;

        return (
            <div>
                {!token && (
                    <div className="init-view">
                        <div className="init-title">¿Buscando música?</div>
                        <a href={redirect_uri} className="init-button">
                            Inicia sesión en Spotify
                        </a>
                    </div>
                )}

                {token && !error && <Search />}

                {token && error && (
                    <div>Ha ocurrido un error iniciando sesión</div>
                )}
            </div>
        );
    }
}

export default OAuth;
