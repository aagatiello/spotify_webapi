import "../styles/Styles.css";

import LogOut from "./LogOut";
import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Recommendations from "./Recommendations";
import Search from "./Search";
import TypeAnimation from "react-type-animation";
import Wrapped from "./Wrapped";
import axios from "axios";
import usericon from "../img/usericon.png";

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
        const { redirect_uri, token, error, user } = this.state;

        return (
            <div>
                {!token && (
                    <div className="init-view">
                        <div className="init-title">
                            ??Buscando
                            <TypeAnimation
                                cursor={true}
                                sequence={[
                                    "m??sica?",
                                    3000,
                                    "artistas?",
                                    3000,
                                    "estad??sticas?",
                                    3000,
                                    "recomendaciones?",
                                    3000,
                                ]}
                                wrapper="a"
                                className="init-title"
                                repeat={Infinity}
                            />
                        </div>

                        <a href={redirect_uri} className="init-button">
                            Inicia sesi??n en Spotify
                        </a>
                    </div>
                )}

                {token && !error && user.display_name && (
                    <ReactFullpage
                        licenseKey={"OPEN-SOURCE-GPLV3-LICENSE"}
                        scrollingSpeed={750}
                        navigation={true}
                        sectionsColor={[
                            "#191414",
                            "#1db954",
                            "#191414",
                            "#1db954",
                        ]}
                        render={() => {
                            let icon;
                            if (user.images[0].url !== undefined) {
                                icon = user.images[0].url;
                            } else {
                                icon = usericon;
                            }
                            return (
                                <ReactFullpage.Wrapper>
                                    <div className="section fp-noscroll">
                                        <Search
                                            redirect_uri={redirect_uri}
                                            token={token}
                                            error={error}
                                            user={user}
                                        />
                                    </div>
                                    <div className="section fp-noscroll">
                                        <Wrapped
                                            redirect_uri={redirect_uri}
                                            token={token}
                                            error={error}
                                        />
                                    </div>
                                    <div className="section fp-noscroll">
                                        <Recommendations
                                            redirect_uri={redirect_uri}
                                            token={token}
                                            error={error}
                                        />
                                    </div>
                                    <div className="section fp-noscroll">
                                        <LogOut img={icon} />
                                    </div>
                                </ReactFullpage.Wrapper>
                            );
                        }}
                    />
                )}

                {token && error && (
                    <div>Ha ocurrido un error iniciando sesi??n</div>
                )}
            </div>
        );
    }
}

export default OAuth;
