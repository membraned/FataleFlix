import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { setFilms, setUser } from '../../actions/actions';

import FilmsList from '../films-list/films-list';

import { FilmView } from '../film-view/film-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import './main-view.scss';

export class MainView extends React.Component {

     constructor() {
          super();

          this.state = {};
     }


     componentDidMount() {
          let accessToken = localStorage.getItem('token');
          if (accessToken !== null) {
               const user = localStorage.getItem('user');
               this.props.setUser(user);
               this.getFilms(accessToken);
               this.getUserInfo(user, accessToken);
               window.scrollTo(0, 0);
          }
     }


     getFilms(token) {
          axios.get('https://fataleflix.herokuapp.com/films', {
               headers: { Authorization: `Bearer ${token}` },
          })
               .then(response => {
                    this.props.setFilms(response.data);
               })
               .catch(function (err) {
                    console.log(err);
               });
     }


     onLoggedIn(authData) {
          console.log(authData);
          this.setState({
               user: authData.user.Username
          });

          localStorage.setItem('token', authData.token);
          localStorage.setItem('user', authData.user.Username);
          this.getFilms(authData.token);
     }

     onLoggedOut() {
          this.setState({
               user: null
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.open('/', '_self');
     }

     render() {
          let { films, user } = this.props;

          // if (!user) return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;
          // //before the films have been loaded
          if (!films) return <div className="main-view" />;

          return (
               <Router basename="/client">
                    <Navbar sticky="top" className="navbar-style" variant="dark" expand="lg">
                         <Navbar.Brand className="navbar-brand" href="/"><img width="150px" src="https://i.postimg.cc/MT7tXv8K/fataleflixlogo.png"></img></Navbar.Brand>
                         <Navbar.Toggle aria-controls="basic-navbar-nav" />
                         <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="mr-auto">
                                   <Nav.Link href='/client'>home</Nav.Link>
                                   <Nav.Link href='/client/users/:Username'>profile</Nav.Link>
                                   <Nav.Link href='/client/register'>register</Nav.Link>
                                   <Nav.Link href='/client/login'>login</Nav.Link>
                                   <Nav.Link onClick={() => this.onLoggedOut()}>logout</Nav.Link>
                              </Nav>
                              <Form inline>
                                   <FormControl type="text" placeholder="search for a film!" className="mr-sm-2" />
                                   <Button variant="outline-danger" className="search-button">search</Button>
                              </Form>
                         </Navbar.Collapse>
                    </Navbar>
                    <div className="main-view">
                         <Container fluid>
                              <Row className="main-container">
                                   <Route exact path="/" render={() => {
                                        if (!user) return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;
                                        return <FilmsList films={films} />;
                                   }} />

                                   <Route path="/register" render={() => <RegistrationView />} />

                                   <Route exact path="/films/:filmId" render={({ match }) => (<FilmView film={films.find((f) => f._id === match.params.filmId)} />)} />

                                   <Route path="/films/genres/:name" render={({ match }) => {
                                        if (!films) return <div className="main-view" />;
                                        return (
                                             <GenreView
                                                  genre={
                                                       films.find((f) => f.Genre.Name === match.params.name).Genre
                                                  }
                                                  otherFilms={films.filter(
                                                       (f) => f.Genre.Name === match.params.name
                                                  )} />
                                        );
                                   }}
                                   />

                                   <Route path="/films/directors/:name" render={({ match }) => <DirectorView director={films.find((f) => f.Director.Name === match.params.name)} />
                                   } />
                                   <Route path="/users/:Username" render={() => <ProfileView films={films} />}
                                   />
                              </Row>
                         </Container>
                    </div>
               </Router >
          );
     }
}

let mapStateToProps = (state) => {
     return { films: state.films };
}

export default connect(mapStateToProps, { setFilms })(MainView);
