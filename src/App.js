import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import './vue.js'
var Spotify = require('spotify-web-api-js');
var spotifyWebApi = new Spotify();

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      genres: props.genres,
      order: props.order //number in list of faves
    }
  }
  render(){
    return(<div>{this.state.order + ". " + this.state.name+" (" + this.state.genres.slice(0,5) + ")"}</div>)
  }
}

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      artist: props.artist,
      order: props.order, //number in list of faves
      album: props.album
    }
  }
  render(){
    return(<div>{this.state.order + ". " + this.state.name+" by " + this.state.artist +" on " + this.state.album}</div>)
  }
}

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      },
      favoriteTracks: '',
      favoriteArtists: '',
      tracksArray: [],
    }
    if (token){
      spotifyWebApi.setAccessToken(token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getInfo(){
    this.getNowPlaying();
    this.getTopTracks();
    this.getTopArtists();
  }
  getNowPlaying(){
    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url
        }
      })
    })
  }
  getTopTracks(){
    spotifyWebApi.getMyTopTracks().then((response) => {
        var arr = Array(20).fill(null);
        for(let i=0;i<20;i++){
          var item = response.items[i];
          var artist = item.artists[0];
          var artistId = artist.id;
          arr[i] = {name: item.name, 
                    artist: artist.name,
                    album: item.album.name,
                  }
        }
        this.setState({favoriteTracks: arr})
    })
  }
  getTopArtists(){
    spotifyWebApi.getMyTopArtists().then((response) => {
        var arr = Array(20).fill(null);
        for(let i=0;i<20;i++){

          var artist = response.items[i];
          var name = artist.name;
          var genres = artist.genres;
          arr[i] = {name: name, 
                    genres: genres
                  }
        }
        this.setState({favoriteArtists: arr})
    })
  }
  renderTrack(i){
    var track = this.state.favoriteTracks[i];
    if(track){
      return <Track key={track.name} name={track.name} artist={track.artist} album={track.album} order={i+1}/>
    }
  }
  renderArtist(i){
    var artist = this.state.favoriteArtists[i]
    if(artist){
      return <Artist key={artist.name} name={artist.name} genres={artist.genres} order={i+1}/>
    }    
  }
  render() {
    var rendered = [];
    for(let i=0;i<20;i++){
      rendered.push(this.renderTrack(i));
    }
    var renderedArtists = [];
    for(let i=0;i<20;i++){
      renderedArtists.push(this.renderArtist(i));
    }
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button>Login with spotify</button>
        </a>
        <div> Now Playing: <div> { this.state.nowPlaying.name } </div> </div>
        <div>
          <img src= {this.state.nowPlaying.image } style={{width: 200}}/>
        </div> 
        <div>
          Favorite Tracks: {rendered} 
        </div><br/>
        <div>
          Favorite Artists: {renderedArtists}
        </div>
        <div>
          <button onClick={() => this.getInfo()}> Update 'Now Playing' </button>
        </div>
      </div>
    );
  }
  }

export default App;
