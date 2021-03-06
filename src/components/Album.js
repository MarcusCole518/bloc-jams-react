import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {

    constructor(props) {
        super(props);

        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            currentVol: 0,
            duration: album.songs[0].duration,
            isPlaying: false
        };

        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
    }

    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
                this.setState({ currentTime: this.audioElement.currentTime });
            },
            durationchange: e => {
                this.setState({ duration: this.audioElement.duration });
            }
        };
        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('duration', this.eventListeners.durationchange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);

    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }

    play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
    }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause();
        } else {
            if (!isSameSong) {this.setSong(song); }
            this.play();
        }
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleNextClick() {
        const currentIndx = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndx = Math.min(4, currentIndx + 1);
        const newSng = this.state.album.songs[newIndx];
        this.setSong(newSng);
        this.play();
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
    }

    handleVolChange(e) {
        this.audioElement.volume = e.target.value;
    }

    handleMouseOn(song) {
        this.setState({ isEntered : song });
    }

    handleMouseOff(song) {
        this.setState({ isEntered: song });
    }

    formatTime(time) {
        let space = (num, size) => {
            return ('000' + num).slice(size * -1);
        }
        time = parseFloat(time).toFixed(3);
        let minutes = Math.floor( time / 60 % 60);
        let seconds = Math.floor( time % 60);
        return space(minutes, 1) + ':' + space(seconds, 2);
    }

    changeIcon (song, index) {
        if (song === this.state.isEntered) {
            if (song === this.state.currentSong && this.state.isPlaying) {
                return (<span className="icon ion-md-pause"></span>);
            } else {
                return (<span className="icon ion-md-play-circle"></span>);
            }
        } else {
            if ( song === this.state.currentSong ) {
                return (<span className="icon ion-md-pause"></span>)
            } else {
                return (index + 1);
            }
        }

    }




    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.title}</h1>
                        <h2 className="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                </section>
                <table id="song-list" className="track-list">
                    <colgroup>
                        <col id="song-number-column" />
                        <col id="song-title-column" />
                        <col id="song-duration-column" />
                    </colgroup>
                    <tbody>
                        {
                            this.state.album.songs.map( (song, index) =>
                                <tr className="song" key={index} onClick={() => this.handleSongClick(song) } onMouseEnter={ () => this.handleMouseOn(song) } onMouseLeave={ () => this.handleMouseOff } >
                                    <td key="track_number">{this.changeIcon(song, index)}</td>
                                    <td key="song_title">{song.title}</td>
                                    <td key="song_duration">{this.formatTime(song.duration)}</td>
                                </tr>)
                        }
                    </tbody>
                </table>
                <PlayerBar
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    duration={this.audioElement.duration}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolChange={(e) => this.handleVolChange(e)}
                    formatTime={(time) => this.formatTime(time)}
                    />
            </section>
        );
    }
}

export default Album;