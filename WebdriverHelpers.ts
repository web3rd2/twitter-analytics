import {
  ChainablePromiseArray,
  ChainablePromiseElement,
  Selector,
} from "webdriverio";

// 实现id方法
export function resourceId(
  client: WebdriverIO.Browser | WebdriverIO.Element,
  str: string
): ChainablePromiseElement<WebdriverIO.Element> {
  const selector = `android=new UiSelector().resourceId("${str}")`;

  const $ = client.$.bind(client);
  return $(selector);
}

export function resourceIds(
  client: WebdriverIO.Browser | WebdriverIO.Element,
  str: string
): ChainablePromiseArray<WebdriverIO.ElementArray> {
  const selector = `android=new UiSelector().resourceId("${str}")`;
  const $$ = client.$$.bind(client);
  return $$(selector);
}

export async function scrollDownHalfScreen(driver: WebdriverIO.Browser) {
  const { height, width } = await driver.getWindowRect();

  const startX = Math.floor(width / 2);
  const startY = Math.floor((height * 9) / 10); // 从屏幕底部四分之三处开始滚动
  const endY = Math.floor(height / 10); // 向上滚动超过半屏的距离，确保足够的滚动效果

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 1000, x: startX, y: startY },
        { type: "pointerDown", button: 100 },
        { type: "pause", duration: 1000 }, // 在开始滚动前稍作等待
        // 增加滚动动作的持续时间，使滚动更平滑
        { type: "pointerMove", duration: 1000, x: startX, y: endY },
        { type: "pointerUp", button: 100 },
      ],
    },
  ]);

  // 增加一个更长的等待时间，确保页面加载完毕
  await driver.pause(2000);
}
