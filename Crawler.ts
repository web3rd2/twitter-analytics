import { remote, RemoteOptions } from "webdriverio";
import { queueManager } from "./QueueManager"; // Assume correct import
import { IStrategy } from "./IStrategy"; // Strategy interface
import { dataStorage } from "./DataStorage";
import { resourceId } from "./WebdriverHelpers";

export class Crawler {
  private client!: WebdriverIO.Browser;
  private strategy?: IStrategy;

  async init(strategy: IStrategy): Promise<void> {
    this.strategy = strategy;

    const options: RemoteOptions = {
      protocol: "http",
      hostname: "127.0.0.1",
      port: 4723,
      path: "/",
      capabilities: {
        platformName: "android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "Pixel_6",
        "appium:ensureWebviewsHavePages": true,
        "appium:nativeWebScreenshot": true,
        "appium:newCommandTimeout": 3600,
        "appium:connectHardwareKeyboard": true,
      },
    };

    this.client = await remote(options);
  }

  async startListening(): Promise<void> {
    await this.client.terminateApp("com.twitter.android");
    await this.client.activateApp("com.twitter.android");

    await resourceId(
      this.client,
      "com.twitter.android:id/toolbar"
    ).waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "wait for home page timeout",
    });

    if (!this.strategy) {
      console.warn("Crawler strategy is not set.");
      return;
    }

    const pullAndProcessTask = async () => {
      await queueManager.pull(async (task: any) => {
        // Ensure strategy is defined
        const strategy = this.strategy!;
        console.log(">>>>>>>>>>>>>>> task", task);
        try {
          const rawData = await strategy.parse(
            task,
            this.client,
            queueManager.enqueue
          );

          await strategy.storeData(dataStorage.session, rawData);
        } catch (error) {
          console.error(`Error processing task: ${error}`);
        }

        // Call pullAndProcessTask again to pull the next task
        await pullAndProcessTask();
      });
    };

    // Start the recursive pulling and processing
    await pullAndProcessTask();
  }
}
