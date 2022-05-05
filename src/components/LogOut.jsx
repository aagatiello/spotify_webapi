import React from "react";
import "./Styles.css";

class LogOut extends React.Component {
    render() {
        const { img } = this.props;

        return (
            <div>
                {img && (
                    <div className="footer">
                        <img src={img} alt="user-logo" className="user-logo" />{" "}
                        <a
                            href={"https://accounts.spotify.com/es-ES/status"}
                            className="logoff-button"
                            onClick={sessionStorage.removeItem("token")}
                        >
                            Cerrar sesión
                        </a>
                    </div>
                )}
                {!img && <div className="footer">Inicia sesion primero</div>}
            </div>
        );
    }
}

export default LogOut;
