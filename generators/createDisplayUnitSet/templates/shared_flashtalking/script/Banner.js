import fitText from '@mediamonks/display-temple/util/fitText';
import politeLoadImages from '@mediamonks/display-temple/util/politeLoadImages';
import timelineScrubber from '@mediamonks/display-temple/util/timelineScrubber';

export default class Banner {
  constructor(config) {
    // add required components here
    this.config = config;
    this.myFT = new FT();
    if (DEVELOPMENT) {
      this.myFT.testMode = true; //to enable local testing and load the FT api
    }
  }

  async init() {
    this.banner = document.body.querySelector('.banner');
    await politeLoadImages(this.banner);
    await document.fonts.ready; //need to wait until fonts are loaded. Otherwise we will run fitText on the wrong fonts

    const title = document.body.querySelector('.title');
    const ctaCopy = document.body.querySelector('.cta_copy');
    fitText([title, ctaCopy]);

    this.domMainExit = document.body.querySelector('.mainExit');

    this.domMainExit.addEventListener('click', this.handleClick);
    this.domMainExit.addEventListener('mouseover', this.handleRollOver);
    this.domMainExit.addEventListener('mouseout', this.handleRollOut);

    this.myFT.applyClickTag(this.domMainExit, 1);

    if (DEVELOPMENT) {
      // domMainExit.style.display = 'none';
    }
  }

  setAnimation(animation) {
    this.animation = animation;
    //creates new timeline and pauses it
    this.animation.getTimeline().paused(true);
    // this.animation.getTimeline().eventCallback('onComplete', this.handleAnimationComplete);

    if (DEVELOPMENT) {
      // timelineScrubber(this.animation.getTimeline());
    }
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
  handleRollOver = () => {};

  /**
   * When mouse rolls out unit.
   */
  handleRollOut = () => {};

  start() {
    this.animation.play();
  }
}
