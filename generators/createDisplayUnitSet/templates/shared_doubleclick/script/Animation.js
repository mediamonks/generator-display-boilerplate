import FrameAnimation from '@mediamonks/display-temple/animation/FrameAnimation';

export default class Animation extends FrameAnimation {
  /**
   *
   * @param {HTMLDivElement} container
   * @param {null} config
   */
  constructor(container, config) {
    super();

    this.container = container;
    this.config = config;
    this.dimensions = `${this.config.settings.size.width}x${this.config.settings.size.height}`;

    //when objects are not found gsap will not throw a warning
    // gsap.config({ nullTargetWarn: false });
    // gsap.defaults({ ease: 'expo.out' });
  }

  /**
   *
   * @param {gsap.core.Timeline} tl
   */
  frame0(tl) {
    tl.to('.content', { duration: 1, opacity: 1 });
  }
}
