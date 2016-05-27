import React from 'react';
import '../styles/landing-page.less';

export default class LandingPage extends React.Component {
  render() {
    return (
      <div className='landing-page'>
        <div className='page-hero'>
          <div className='hero-content _constrain'>
            <div className='site-title'>
              <h1 className='title'>Assassin</h1>
              <div className='subtitle'>Kill them all.</div>
            </div>
            <div className='cta'>
              <div className='default-button'>Coming soon</div>
            </div>
          </div>
        </div>
        <div className='shadow-row'>
          <div className='content _constrain'>
            <div className='section-header'>
              <h2 className='header'>Join the fiercest killers on Earth</h2>
              <div className='sub'>Everyone is born with a gift. Sometimes that gift is murder.</div>
            </div>
            <p>Play the classic live-action game Assassin, but with a modern twist. Instead of eliminating players by touching them with objects or placing bombs, players are killed by "shooting" them with your camera. Play with your friends, earn points, and compete with players across the world.</p>
            <div className='section-header'>
              <h2 className='header'>How to Play</h2>
            </div>
            <ol>
              <li>Sign up and start a game with your friends</li>
              <li>Kill your assigned target by uploading a photo here</li>
              <li>When your kill is confirmed, you are assigned their target</li>
              <li>Confirm other players' kills for more points</li>
              <li>Continue until you're eliminated or you become the champion!</li>
            </ol>
          </div>
        </div>
        <footer className='page-footer _constrain'>
          &copy; Copyright 2016 <a target='_blank' href='http://www.zackmichener.net'>Zack Michener</a>
        </footer>
      </div>
    );
  }
}