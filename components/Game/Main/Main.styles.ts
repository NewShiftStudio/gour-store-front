import buttonSmallImage from 'assets/images/game/button-small.svg';
import buttonImage from 'assets/images/game/button.svg';

const sx = {
  player: {
    bottom: '85px',
    paddingRight: '15px',
  },
  controlBtn: {
    background: `url("${buttonImage}")`,
    width: '78px',
    height: '78px',
    boxShadow: 'none',
    position: 'absolute',
    zIndex: 100,
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: '45px',
    },
    '&:active': {
      borderRadius: '45px',
      opacity: '0.8',
      transform: 'translateY(3px)',
      boxShadow: '0 3px #666',
    },
  },

  smallBtn: {
    background: `url("${buttonSmallImage}")`,
    minWidth: '54px',
    height: '30px',
    boxShadow: 'none',
    zIndex: 100,
    borderRadius: '9px',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '&:active': {
      opacity: '0.8',
      transform: 'translateY(3px)',
      boxShadow: '0 3px #666',
    },
  },

  helpBtn: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '135px',
    left: '50px',
  },

  startBtn: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '135px',
    right: '50px',
  },

  userLives: {
    display: 'flex',
    marginTop: '10px',
    alignItems: 'center',
  },

  btnText: {
    width: 'fit-content',
    marginTop: '8px',
    fontSize: {
      md: '14px',
      xs: '10px',
    },
  },

  alarm: {
    top: '105px',
    left: '270px',
  },

  gameLives: {
    top: '150px',
  },

  counter: {
    top: '94px',
    right: '250px',
  },

  topLeftBtn: {
    top: '293px',
    left: '40px',
  },
  bottomLeftBtn: {
    top: '399px',
    left: '40px',
  },
  topRightBtn: {
    top: '293px',
    right: '40px',
  },
  bottomRightBtn: {
    top: '399px',
    right: '40px',
  },

  firstCheese: {
    top: '215px',
    left: '185px',
  },
  secondCheese: {
    top: '245px',
    left: '225px',
  },
  thirdCheese: {
    top: '270px',
    left: '275px',
  },

  firstSausage: {
    top: '350px',
    left: '180px',
  },
  secondSausage: {
    top: '380px',
    left: '225px',
  },
  thirdSausage: {
    top: '395px',
    left: '270px',
  },

  firstJamon: {
    top: '200px',
    right: '185px',
  },
  secondJamon: {
    top: '220px',
    right: '250px',
  },
  thirdJamon: {
    top: '250px',
    right: '295px',
  },

  firstChicken: {
    top: '340px',
    right: '185px',
  },
  secondChicken: {
    top: '380px',
    right: '230px',
  },
  thirdChicken: {
    top: '390px',
    right: '285px',
  },
};

export default sx;
