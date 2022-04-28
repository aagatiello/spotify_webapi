import React from "react";
import Modal from "react-modal";
import "./Styles.css";

class ReactModal extends React.Component {
    render() {
        const { closeModal, playlists, addToPlaylist, user } = this.props;

        return (
            <div className="Modal">
                <Modal
                    isOpen={true}
                    style={{
                        content: {
                            background: "#137e38f3",
                        },
                    }}
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
                            <button onClick={closeModal}>Cerrar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ReactModal;
