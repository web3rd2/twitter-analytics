import { Session } from "neo4j-driver";

export interface IStrategy {
  parse(
    task: any,
    client: WebdriverIO.Browser,
    addTask: (newTask: any) => Promise<void>
  ): Promise<void>;
  storeData(session: Session, data: any): Promise<void>;
}
