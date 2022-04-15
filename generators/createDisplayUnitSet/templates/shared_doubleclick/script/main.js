import Banner from "./Banner";
import Animation from "./Animation";

// config will contain the final .richmediarc content. So if a .richmediarc
// inherits from a other .richmediarc it will also contain those files.
import config from "richmediaconfig";

const banner = new Banner(config);
//first load fonts, load images etc in the init animation
banner.init().then(
  () => {
    //initializes animation and creates main timeline
    banner.setAnimation(new Animation(document.querySelector('.banner'), config));
    //plays banner
    banner.start()
  }
)
