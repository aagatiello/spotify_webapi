import React from "react";
import Modal from "react-modal";
import "./Styles.css";

class ReactModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addNew: false,
            newPlaylistName: "",
        };
    }

    updatePlaylistName = (e) => {
        this.setState({
            newPlaylistName: e.target.value,
        });
    };

    handleKeyDown = (e) => {
        const { newPlaylist } = this.props;
        const { newPlaylistName } = this.state;
        if (e.key === "Enter") {
            newPlaylist(newPlaylistName);
        }
    };

    addNewPlaylist = () => {
        this.setState({
            addNew: !this.state.addNew,
        });
    };

    newPlaylistValidation = () => {
        const { newPlaylistName } = this.state;
        const { newPlaylist } = this.props;
        if (newPlaylistName) {
            newPlaylist(newPlaylistName);
        } else {
            alert("Por favor, introduce un nombre válido para la playlist.");
        }
        this.addNewPlaylist();
    };

    render() {
        const { closeModal, playlists, addToPlaylist, user } = this.props;
        const { addNew } = this.state;
        return (
            <div className="Modal">
                <Modal
                    isOpen={true}
                    style={{
                        content: {
                            background: "#137e38f3",
                        },
                    }}
                    contentLabel="Example Modal"
                    overlayClassName="Overlay"
                >
                    <h2>Selecciona una playlist</h2>
                    <div className="playlist-search-results">
                        {playlists.length > 0 && (
                            <div className="results-list">
                                {playlists.map((playlist, ind) => {
                                    return (
                                        <div className="song-data" key={ind}>
                                            <div className="song-name">
                                                {playlist.name}
                                            </div>
                                            <button
                                                className="addButton"
                                                onClick={() =>
                                                    addToPlaylist(
                                                        playlist.id,
                                                        user.id ===
                                                            playlist.owner.id
                                                    )
                                                }
                                            >
                                                Añadir
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {!playlists.length && (
                            <div className="error">
                                No se han encontrado playlists.
                            </div>
                        )}
                    </div>
                    <div className="playlist-search-footer">
                        <div className="playlist-options">
                            <button onClick={this.addNewPlaylist}>
                                {!addNew ? "Crear nueva playlist" : "Cancelar"}
                            </button>
                            <button onClick={closeModal}>Cerrar</button>
                        </div>
                        {addNew && (
                            <div className="playlist-new">
                                <input
                                    type="text"
                                    placeholder="Nombre nueva playlist..."
                                    onChange={this.updatePlaylistName}
                                    onKeyDown={this.handleKeyDown}
                                    maxLength="20"
                                />
                                <button onClick={this.newPlaylistValidation}>
                                    Crear
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }
}
export default ReactModal;
