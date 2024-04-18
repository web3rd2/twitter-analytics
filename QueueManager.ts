import amqp, { Channel, Connection } from "amqplib";

interface Task {
  // Define the structure of your task here
  [key: string]: any;
}

class QueueManager {
  private connectionString: string;
  private queueName: string;
  private channel: Channel | null;
  private connection: Connection | null;

  constructor() {
    this.connectionString = "amqp://localhost";
    this.queueName = "taskQueue";
    this.channel = null;
    this.connection = null;
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.connectionString);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async enqueue(task: Task): Promise<void> {
    if (!this.channel) await this.connect();
    this.channel?.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(task)),
      { persistent: true }
    );
  }

  async pull(
    processTaskCallback: (task: Task) => Promise<void>
  ): Promise<void> {
    if (!this.channel) await this.connect();
    const msg: any = await this.channel?.get(this.queueName, { noAck: false });
    if (msg) {
      this.channel?.ack(msg);
      const task: Task = JSON.parse(msg.content.toString());
      await processTaskCallback(task);
    }
  }
  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.channel = null;
      this.connection = null;
    }
  }
}

export const queueManager = new QueueManager();
