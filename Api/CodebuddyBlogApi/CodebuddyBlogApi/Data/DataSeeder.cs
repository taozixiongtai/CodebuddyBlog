using CodebuddyBlogApi.Models;
using SqlSugar;

namespace CodebuddyBlogApi.Data
{
    public class DataSeeder
    {
        private readonly ISqlSugarClient _db;

        public DataSeeder(ISqlSugarClient db)
        {
            _db = db;
        }

        public async Task InitializeDatabaseAsync()
        {
            try
            {
                // 初始化表结构
                InitializeTables();

                // 检查数据是否已经存在
                var categoryCount = await _db.Queryable<Category>().CountAsync();
                if (categoryCount == 0)
                {
                    // 插入分类数据
                    await SeedCategoriesAsync();

                    // 插入文章数据
                    await SeedArticlesAsync();

                    // 插入文章分类关系
                    await SeedArticleCategoryRelationsAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("数据库初始化失败", ex);
            }
        }

        private void InitializeTables()
        {
            _db.CodeFirst.SetStringDefaultLength(200).InitTables(
                typeof(Category),
                typeof(Article),
                typeof(ArticleCategoryRelation)
            );
        }

        private async Task SeedCategoriesAsync()
        {
            var categories = new List<Category>
            {
                new Category
                {
                    Id = 1,
                    Name = "C# 编程",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = 2,
                    Name = ".NET 开发",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = 3,
                    Name = "Web 开发",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = 4,
                    Name = "数据库",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Id = 5,
                    Name = "API 设计",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            await _db.Insertable(categories).ExecuteCommandAsync();
        }

        private async Task SeedArticlesAsync()
        {            var articles = new List<Article>
            {
                new Article
                {
                    Id = 1,
                    Title = "C# 异步编程完全指南",
                    Content = "本文详细介绍了 C# 中的异步编程，包括 async/await 关键字、Task、Task<T> 等核心概念。通过实际案例演示如何编写高效的异步代码。",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Article
                {
                    Id = 2,
                    Title = ".NET 中的依赖注入（DI）",
                    Content = "深入理解 .NET Core 中的依赖注入容器，学习如何配置服务、管理生命周期和解决依赖关系。",
                    CreatedAt = DateTime.UtcNow.AddDays(-29),
                    UpdatedAt = DateTime.UtcNow.AddDays(-29)
                },
                new Article
                {
                    Id = 3,
                    Title = "Entity Framework Core 最佳实践",
                    Content = "EF Core 是 .NET 中最流行的 ORM。本文介绍了 EF Core 的最佳实践，包括性能优化、查询优化和数据映射。",
                    CreatedAt = DateTime.UtcNow.AddDays(-28),
                    UpdatedAt = DateTime.UtcNow.AddDays(-28)
                },
                new Article
                {
                    Id = 4,
                    Title = "ASP.NET Core REST API 设计指南",
                    Content = "学习如何设计和构建符合 RESTful 原则的 API，包括路由设计、HTTP 方法使用、状态码处理等。",
                    CreatedAt = DateTime.UtcNow.AddDays(-27),
                    UpdatedAt = DateTime.UtcNow.AddDays(-27)
                },
                new Article
                {
                    Id = 5,
                    Title = "SqlSugar ORM 快速上手",
                    Content = "SqlSugar 是一个轻量级的 ORM 框架。本文介绍了 SqlSugar 的基本用法，包括增删改查、条件查询和关联查询。",
                    CreatedAt = DateTime.UtcNow.AddDays(-26),
                    UpdatedAt = DateTime.UtcNow.AddDays(-26)
                },
                new Article
                {
                    Id = 6,
                    Title = "SQLite 数据库优化技巧",
                    Content = "SQLite 是一个轻量级的关系数据库。本文分享了一些 SQLite 的性能优化技巧，适合小型应用和桌面应用使用。",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    UpdatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Article
                {
                    Id = 7,
                    Title = "CORS 跨域资源共享详解",
                    Content = "了解 CORS 的工作原理，学习如何在 ASP.NET Core 中配置 CORS 策略，解决前后端分离中的跨域问题。",
                    CreatedAt = DateTime.UtcNow.AddDays(-24),
                    UpdatedAt = DateTime.UtcNow.AddDays(-24)
                },
                new Article
                {
                    Id = 8,
                    Title = "Docker 容器化 .NET 应用",
                    Content = "学习如何将 .NET Core 应用程序打包成 Docker 镜像，并了解容器化部署的基本流程和优势。",
                    CreatedAt = DateTime.UtcNow.AddDays(-23),
                    UpdatedAt = DateTime.UtcNow.AddDays(-23)
                },
                new Article
                {
                    Id = 9,
                    Title = "Redis 缓存实战技巧",
                    Content = "在高并发应用中，Redis 是不可或缺的缓存组件。本文介绍如何在 .NET 中高效使用 Redis。",
                    CreatedAt = DateTime.UtcNow.AddDays(-22),
                    UpdatedAt = DateTime.UtcNow.AddDays(-22)
                },
                new Article
                {
                    Id = 10,
                    Title = "微服务架构入门",
                    Content = "微服务架构是现代后端开发的趋势。本文探讨了微服务的基本概念、优缺点以及常用技术栈。",
                    CreatedAt = DateTime.UtcNow.AddDays(-21),
                    UpdatedAt = DateTime.UtcNow.AddDays(-21)
                },
                new Article
                {
                    Id = 11,
                    Title = "C# 12 新特性深度解析",
                    Content = "C# 12 带来了主构造函数、集合表达式等诸多新特性。让我们一起看看它们如何简化代码编写。",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new Article
                {
                    Id = 12,
                    Title = "使用 Serilog 记录结构化日志",
                    Content = "日志是排查问题的关键。本文介绍如何使用 Serilog 实现结构化日志记录，并将其推送到 Elasticsearch 或 Seq。",
                    CreatedAt = DateTime.UtcNow.AddDays(-19),
                    UpdatedAt = DateTime.UtcNow.AddDays(-19)
                },
                new Article
                {
                    Id = 13,
                    Title = "ASP.NET Core 身份认证与授权",
                    Content = "深入了解 Identity 框架，学习如何实现 JWT 认证、基于角色的授权和基于策略的授权。",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-18)
                },
                new Article
                {
                    Id = 14,
                    Title = "LINQ 高级查询技巧",
                    Content = "LINQ 是 C# 的强大武器。本文分享一些 LINQ 的高级使用技巧，让你的数据处理代码更优雅。",
                    CreatedAt = DateTime.UtcNow.AddDays(-17),
                    UpdatedAt = DateTime.UtcNow.AddDays(-17)
                },
                new Article
                {
                    Id = 15,
                    Title = "Unit Testing 与 xUnit",
                    Content = "编写单元测试是保证代码质量的基础。本文介绍如何使用 xUnit 和 Moq 在 .NET 中进行测试。",
                    CreatedAt = DateTime.UtcNow.AddDays(-16),
                    UpdatedAt = DateTime.UtcNow.AddDays(-16)
                },
                new Article
                {
                    Id = 16,
                    Title = "AutoMapper 简化对象映射",
                    Content = "在 DTO 和 Entity 之间手动转换很繁琐。学习如何使用 AutoMapper 自动完成对象之间的属性映射。",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    UpdatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new Article
                {
                    Id = 17,
                    Title = "SignalR 实现实时通信",
                    Content = "SignalR 使得在 Web 应用中实现实时推送变得非常简单。本文演示如何构建一个简单的聊天室。",
                    CreatedAt = DateTime.UtcNow.AddDays(-14),
                    UpdatedAt = DateTime.UtcNow.AddDays(-14)
                },
                new Article
                {
                    Id = 18,
                    Title = "RabbitMQ 消息队列实战",
                    Content = "消息队列可以实现应用解耦和异步处理。本文介绍如何在 .NET 中集成 RabbitMQ 进行消息收发。",
                    CreatedAt = DateTime.UtcNow.AddDays(-13),
                    UpdatedAt = DateTime.UtcNow.AddDays(-13)
                },
                new Article
                {
                    Id = 19,
                    Title = "使用 FluentValidation 验证模型",
                    Content = "FluentValidation 提供了比 DataAnnotations 更灵活的验证方式。学习如何编写清晰的验证规则。",
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new Article
                {
                    Id = 20,
                    Title = "分布式锁的实现方案",
                    Content = "在分布式系统中，如何保证同一时间只有一个实例执行特定逻辑？本文探讨了基于 Redis 和数据库的分布式锁。",
                    CreatedAt = DateTime.UtcNow.AddDays(-11),
                    UpdatedAt = DateTime.UtcNow.AddDays(-11)
                },
                new Article
                {
                    Id = 21,
                    Title = "Git 版本控制进阶指南",
                    Content = "除了基础的 push/pull，你还应该掌握 rebase、cherry-pick 和 stash 等进阶操作。",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Article
                {
                    Id = 22,
                    Title = "前端 Vue.js 3 快速入门",
                    Content = "作为后端开发者，了解前端框架很有必要。本文带你快速上手 Vue 3 组合式 API。",
                    CreatedAt = DateTime.UtcNow.AddDays(-9),
                    UpdatedAt = DateTime.UtcNow.AddDays(-9)
                },
                new Article
                {
                    Id = 23,
                    Title = "TypeScript 与 JavaScript 的区别",
                    Content = "TypeScript 为 JS 带来了强类型检查。本文分析了 TS 的核心优势及其在大型项目中的应用。",
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    UpdatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new Article
                {
                    Id = 24,
                    Title = "MongoDB 文档数据库初探",
                    Content = "MongoDB 是最流行的 NoSQL 数据库之一。学习如何使用 C# 驱动程序操作 MongoDB。",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                },
                new Article
                {
                    Id = 25,
                    Title = "Elasticsearch 搜索引擎入门",
                    Content = "如何实现高性能的全文搜索？本文介绍 Elasticsearch 的基本安装、索引和查询操作。",
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new Article
                {
                    Id = 26,
                    Title = "OAuth 2.0 与 OpenID Connect",
                    Content = "理解第三方登录背后的协议原理。学习如何实现标准的授权码流程。",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Article
                {
                    Id = 27,
                    Title = "Kubernetes 核心概念入门",
                    Content = "K8s 已成为容器编排的标准。本文解释 Pod、Service、Deployment 等核心资源的含义。",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new Article
                {
                    Id = 28,
                    Title = "使用 GitHub Actions 实现 CI/CD",
                    Content = "自动化构建和部署可以显著提高效率。学习如何编写 GitHub Actions Workflow。",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Article
                {
                    Id = 29,
                    Title = "领域驱动设计 (DDD) 核心思想",
                    Content = "DDD 是一种处理复杂业务逻辑的方法论。本文介绍了聚合、实体、值对象和领域服务等概念。",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Article
                {
                    Id = 30,
                    Title = "高性能 C#：Span 和 Memory",
                    Content = "在追求极致性能的场景下，Span<T> 可以减少内存分配。学习如何在底层代码中使用这些特性。",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _db.Insertable(articles).ExecuteCommandAsync();
        }

        private async Task SeedArticleCategoryRelationsAsync()
        {            var relations = new List<ArticleCategoryRelation>();

            // 为 30 篇文章生成一些关联数据
            for (int i = 1; i <= 30; i++)
            {                // 每篇文章至少关联一个分类，分类 ID 1-5 循环
                relations.Add(new ArticleCategoryRelation { ArticleId = i, CategoryId = (i % 5) + 1 });
                
                // 偶数 ID 的文章额外关联一个分类
                if (i % 2 == 0)
                {                    relations.Add(new ArticleCategoryRelation { ArticleId = i, CategoryId = ((i + 1) % 5) + 1 });
                }
            }

            await _db.Insertable(relations).ExecuteCommandAsync();
        }
    }
}
