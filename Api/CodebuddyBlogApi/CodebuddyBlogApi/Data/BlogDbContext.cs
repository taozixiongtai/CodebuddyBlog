using CodebuddyBlogApi.Models;
using SqlSugar;

namespace CodebuddyBlogApi.Data
{
    public class BlogDbContext
    {
        private readonly ISqlSugarClient _db;

        public BlogDbContext(ISqlSugarClient db)
        {
            _db = db;
            InitializeDatabase();
        }

        public SimpleClient<Article> Articles => _db.GetSimpleClient<Article>();
        public SimpleClient<Category> Categories => _db.GetSimpleClient<Category>();
        public SimpleClient<ArticleCategoryRelation> ArticleCategoryRelations => _db.GetSimpleClient<ArticleCategoryRelation>();

        public ISqlSugarClient Db => _db;

        private void InitializeDatabase()
        {
            _db.CodeFirst.SetStringDefaultLength(200).InitTables(typeof(Article), typeof(Category), typeof(ArticleCategoryRelation));
        }
    }
}
