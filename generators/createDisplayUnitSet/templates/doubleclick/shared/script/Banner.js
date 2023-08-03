import fitText from '@mediamonks/display-temple/util/fitText';
import untilEnablerIsInitialized from '@mediamonks/display-temple/doubleclick/untilEnablerIsInitialized';
import dataBind from '@mediamonks/display-temple/util/dataBind';
import getEventDispatcher from '@mediamonks/display-temple/doubleclick/getEventDispatcher';
import Events from '@mediamonks/display-temple/doubleclick/Events';
import getDynamicData from './getDynamicData';
import timelineScrubber from '@mediamonks/display-temple/util/timelineScrubber';

export default class Banner {
  constructor(config) {
    // add required components here
    this.config = config;
  }

  async init() {
    this.banner = document.body.querySelector('.banner');
    await untilEnablerIsInitialized();
    await document.fonts.ready; //need to wait until fonts are loaded. Otherwise we will run fitText on the wrong fonts
    await this.addEventListeners();

    this.feed = getDynamicData();

    // values of feed are set on container. with data-bind="src: OBJECT_PATH"
    dataBind(this.feed, this.banner);

    this.mainExit = this.feed.exit_url.Url;

    // fit text according to parent container
    const title = document.body.querySelector('.title');
    const ctaCopy = document.body.querySelector('.cta_copy');

    fitText([title, ctaCopy]);
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

  async addEventListeners() {
    this.domMainExit = document.body.querySelector('.mainExit');
    this.domMainExit.addEventListener('click', this.handleClick);
    this.domMainExit.addEventListener('mouseover', this.handleRollOver);
    this.domMainExit.addEventListener('mouseout', this.handleRollOut);

    this.dispatcher = await getEventDispatcher();
    //on exit handler
    this.dispatcher.addEventListener(Events.EXIT, this.handleExit);

    if (DEVELOPMENT) {
      // domMainExit.style.display = 'none';
    }
  }

  handleExit = () => {
    this.animation.getTimeline().progress(1);
  };

  /**
   * When client clicks this function will be triggered.
   */
  handleClick = () => {
    Enabler.exitOverride('Default Exit', this.mainExit);
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
