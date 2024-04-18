import neo4j, { Driver, Session } from "neo4j-driver";

interface CircleData {
  id: string;
  name: string;
  age?: number;
  follows: string[];
}

class DataStorage {
  private driver: Driver;
  private _session!: Session;

  constructor() {
    // Connect to Neo4j database
    // Replace URI, username, and password according to your Neo4j database setup
    this.driver = neo4j.driver(
      "bolt://localhost:7687",
      neo4j.auth.basic("neo4j", "password")
    );
  }

  async connect(): Promise<void> {
    try {
      this._session = this.driver.session();
      await this._session.run("RETURN 1"); // Try executing a simple query to check the connection
      console.log("Connected to Neo4j successfully.");
    } catch (error) {
      console.error("Error connecting to Neo4j:", error);
      throw error;
    }
  }

  get session() {
    return this._session;
  }

  async storeCircleData(circleData: CircleData[]): Promise<void> {
    if (!this._session) {
      throw new Error("Session not initialized. Call connect() first.");
    }

    const query = `
            UNWIND $circleData AS member
            MERGE (p:Person {id: member.id})
            SET p += {name: member.name, age: member.age}
            WITH p, member
            UNWIND member.follows AS followsId
            MATCH (f:Person {id: followsId})
            MERGE (p)-[:FOLLOWS]->(f)
        `;

    try {
      await this._session.run(query, { circleData });
      console.log("Circle data stored successfully.");
    } catch (error) {
      console.error("Error storing circle data:", error);
      throw error;
    }
  }

  async calculateAndSortCentrality(): Promise<void> {
    if (!this.session) {
      throw new Error("Session not initialized. Call connect() first.");
    }

    const query = `
            CALL gds.betweenness.stream({
                nodeProjection: 'Person',
                relationshipProjection: {
                    follows: {
                        type: 'FOLLOWS',
                        orientation: 'UNDIRECTED'
                    }
                }
            })
            YIELD nodeId, score
            RETURN gds.util.asNode(nodeId).id AS id, score
            ORDER BY score DESC
        `;

    try {
      const result = await this.session.run(query);
      const centralityScores = result.records.map((record) => ({
        id: record.get("id"),
        score: record.get("score").toNumber(), // Assuming score is a Neo4j Integer
      }));
      console.log("Centrality scores:", centralityScores);
    } catch (error) {
      console.error("Error calculating centrality:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this._session) {
      await this._session.close();
    }
    await this.driver.close();
  }
}

export const dataStorage = new DataStorage();
