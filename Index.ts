import App from "./App";
import { TwitterStrategy } from "./TwitterStrategy";

const app = new App();
app.run(["lepuppeteerfou"], new TwitterStrategy()).catch(console.error);
