# Twitter 社交网络爬虫与分析工具

这个项目旨在利用多种技术，如 Node.js、TypeScript、WebdriverIO、Neo4j 和 RabbitMQ 等，来爬取和分析 Twitter 社交网络数据。通过该工具，我们可以深入了解 Twitter 用户之间的关系和互动，发现有影响力的用户，并揭示社交网络的结构和动态。

## 特点

- 自动爬取 Twitter 用户资料，提取关键信息

- 将提取的数据存储在 Neo4j 图形数据库中，方便进一步分析

- 计算用户节点的中心性指标，找出网络中的关键人物

- 利用 RabbitMQ 实现任务的异步排队和处理，提高爬取效率

- 使用 Docker 容器化部署，便于在不同环境中运行

## 项目结构

本项目采用模块化的设计，主要包括以下几个部分：

- `App`：程序的入口，负责初始化和启动爬虫

- `Crawler`：爬虫的核心模块，利用 WebdriverIO 与 Twitter 网页进行交互，处理任务队列中的任务，并根据策略存储数据

- `QueueManager`：管理 RabbitMQ 任务队列，实现任务的异步入队和处理

- `TwitterStrategy`：Twitter 数据的解析和存储策略，定义了如何提取和保存 Twitter 用户信息

- `DataStorage`：与 Neo4j 数据库交互的模块，负责将爬取到的数据存入图形数据库，并提供数据分析功能

## 快速开始

1\. 克隆项目仓库到本地：

```

git clone https://github.com/web3rd2/twitter-social-network-crawler.git

```

2\. 进入项目目录，安装依赖：

```

cd twitter-analytics

npm install

```

3\. 配置环境变量：

- 在项目根目录下新建一个 `.env` 文件

- 在文件中填写 Neo4j 和 RabbitMQ 的相关配置信息

4\. 使用 Docker Compose 启动所需的服务：

```

docker-compose up -d

```

5\. 构建并运行应用：

```

npm run build

npm start

```

6\. 爬虫开始运行后，可以通过 Neo4j 浏览器或查询语句查看爬取到的数据和分析结果。

## 贡献指南

如果你对这个项目感兴趣，欢迎提出宝贵的意见和建议，或者直接参与到项目的开发中来。你可以通过以下方式贡献代码：

1\. Fork 项目仓库到自己的 GitHub 账号下

2\. 创建一个新的分支，在该分支上进行开发

3\. 提交代码变更，并创建一个 Pull Request

4\. 等待项目维护者审核和合并你的代码

如果你在使用过程中遇到任何问题，或者有任何疑问和建议，也欢迎通过 GitHub Issues 向我们反馈。

## 许可证

本项目基于 [MIT 许可证](LICENSE)发布，你可以自由地使用、修改和分发本项目的代码，但需要保留原有的版权声明和许可证文本。
