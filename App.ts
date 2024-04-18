import { queueManager } from "./QueueManager";
import { Crawler } from "./Crawler";
import { IStrategy } from "./IStrategy";

class App {
  private crawler: Crawler;

  constructor() {
    this.crawler = new Crawler(); // 将策略注入Crawler
  }

  async run(seedTasks: any[], strategy: IStrategy): Promise<void> {
    // 首先确保QueueManager连接
    await queueManager.connect();
    console.log("QueueManager connected successfully.");

    await this.crawler.init(strategy);

    // 添加种子任务
    for (const task of seedTasks) {
      await queueManager.enqueue(task);
    }
    console.log("Seed tasks enqueued successfully.");
    // 开始监听和处理任务
    await this.crawler.startListening();
    console.log("Crawler started listening for tasks.");
  }

  async close(): Promise<void> {
    // 关闭QueueManager的连接
    await queueManager.closeConnection();
    console.log("QueueManager connection closed.");
  }
}

export default App;
