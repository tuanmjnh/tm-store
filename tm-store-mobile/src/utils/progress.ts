import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  // Animation mode
  easing: "ease",
  // Speed ​​of the progress bar
  speed: 500,
  // Whether to display the loading ico
  showSpinner: false,
  // Automatic increment interval
  trickleSpeed: 200,
  // Minimum percentage at initialization
  minimum: 0.3,
  // Parent element of the loading bar
  parent: "body"
});

export default NProgress;
