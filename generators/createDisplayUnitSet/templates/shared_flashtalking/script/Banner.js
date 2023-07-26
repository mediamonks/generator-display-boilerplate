import fitText from '@mediamonks/display-temple/util/fitText';
import politeLoadImages from '@mediamonks/display-temple/util/politeLoadImages';

export default class Banner {
  constructor(config) {
    // add required components here
    this.config = config;
    this.myFT = new FT();
  }

  async init() {
    this.banner = document.body.querySelector('.banner');
    await politeLoadImages(this.banner)
    await document.fonts.ready; //need to wait until fonts are loaded. Otherwise we will run fitText on the wrong fonts

    const title = document.body.querySelector('.title');
    const ctaCopy = document.body.querySelector('.cta_copy');
    fitText([title, ctaCopy]);

    this.domMainExit = this.myFT.$('.mainExit');

    this.domMainExit.on('click', this.handleClick);
    this.myFT.applyClickTag(this.domMainExit, 1);

    this.myFT.on('rollover', this.handleRollOver);
    this.myFT.on('rollout', this.handleRollOut); 
  }

  setAnimation(animation){
    this.animation = animation;
    //creates new timeline and pauses it
    this.animation.getTimeline().paused(true);
    // this.animation.getTimeline().eventCallback('onComplete', this.handleAnimationComplete);
  }

  handleExit = () => {
    this.animation.getTimeline().progress(1);
  };

  /**
   * When client clicks this function will be triggerd.
   */
  handleClick = () => {
    this.handleExit();
  };

  /**
   * When mouse rolls over unit.
   */
  handleRollOver = () => {
    gsap.to('.cta', {duration: 1, scale: 1.1, ease: 'power2.out'});
  };

  /**
   * When mouse rolls out unit.
   */
  handleRollOut = () => {
    gsap.to('.cta', {duration: 1, scale: 1, ease: 'power2.out'})
  };

  start() {
    this.animation.play();
  }
}

