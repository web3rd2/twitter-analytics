import { IStrategy } from "./IStrategy";
import {
  resourceId,
  resourceIds,
  scrollDownHalfScreen,
} from "./WebdriverHelpers";

export class TwitterStrategy implements IStrategy {
  async parse(
    task: any,
    driver: WebdriverIO.Browser,
    addTask: (newTask: any) => Promise<void>
  ): Promise<any> {
    const deepLinkUrl = `twitter://user?screen_name=${task}`;

    // 使用 driver.execute 方法来发送一个 Android intent
    await driver.execute("mobile:deepLink", {
      url: deepLinkUrl,
      package: "com.twitter.android",
    });

    await resourceId(
      driver,
      "com.twitter.android:id/user_name"
    ).waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "wait for profile page timeout",
    });

    const nameElement = await resourceId(driver, "com.twitter.android:id/name");
    const name = await nameElement.getText();
    const userNameElement = await resourceId(
      driver,
      "com.twitter.android:id/user_name"
    );
    const user_name = await userNameElement.getText();

    const userBioElement = await resourceId(
      driver,
      "com.twitter.android:id/user_bio"
    );
    const user_bio = await userBioElement.getText();

    const userProfileElementIsExisting = await resourceId(
      driver,
      "com.twitter.android:id/profile_header_location"
    ).isExisting();
    let profile_header_location = "";
    if (userProfileElementIsExisting) {
      profile_header_location = await resourceId(
        driver,
        "com.twitter.android:id/profile_header_location"
      ).getText();
    }

    const userProfileWebSiteElementIsExisting = await resourceId(
      driver,
      "com.twitter.android:id/profile_header_website"
    ).isExisting();
    let profile_header_website = "";
    if (userProfileWebSiteElementIsExisting) {
      profile_header_website = await resourceId(
        driver,
        "com.twitter.android:id/profile_header_website"
      ).getText();
    }

    const joinDateElement = await resourceId(
      driver,
      "com.twitter.android:id/profile_header_join_date"
    );
    const profile_header_join_date = await joinDateElement.getText();

    const followersStatElement = await resourceId(
      driver,
      "com.twitter.android:id/followers_stat"
    );
    const followers_stat = await resourceId(
      followersStatElement,
      "com.twitter.android:id/value_text_1"
    ).getText();

    const followingElement = await resourceId(
      driver,
      "com.twitter.android:id/following_stat"
    );
    const following_stat = await resourceId(
      followingElement,
      "com.twitter.android:id/value_text_1"
    ).getText();

    let user = {
      name,
      user_name,
      user_bio,
      profile_header_location,
      profile_header_join_date,
      profile_header_website,
      followers_stat,
      following_stat,
    };
    console.log(">>>>>>>>>>>>> user", user);

    await followingElement.click();

    let isDisplayed = false;
    const user_names = new Set();
    while (!isDisplayed) {
      const elements = await resourceIds(
        driver,
        "com.twitter.android:id/screenname_item"
      );

      // 遍历元素并获取文本
      for (const element of elements) {
        const text = await element.getText();
        user_names.add(text);
      }
      // 调用函数进行滚动
      await scrollDownHalfScreen(driver);

      await driver.pause(10000000);

      let endElement = await resourceId(
        driver,
        "com.twitter.android:id/progress_dot"
      );
      isDisplayed = await endElement.isDisplayed();
    }

    console.log(">>>>>>>>>>>>>>>> user_names,", user_names);
    // await addTask(text);

    return user;
  }
  async storeData(dataStorage: any, parsedData: any): Promise<void> {
    console.log(`Storing Twitter data: ${parsedData}`);
  }
}
