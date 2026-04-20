using SqlSugar;
using CodebuddyBlogApi.Data;
using CodebuddyBlogApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure SqlSugar with SQLite
var dbPath = Path.Combine(AppContext.BaseDirectory, "blog.db");
var connectionString = $"Data Source={dbPath};";
builder.Services.AddScoped<ISqlSugarClient>(sp => new SqlSugarClient(new ConnectionConfig
{
    DbType = DbType.Sqlite,
    ConnectionString = connectionString,
    IsAutoCloseConnection = true,
    InitKeyType = InitKeyType.Attribute
}));

// Register DbContext
builder.Services.AddScoped<BlogDbContext>();

// Register DataSeeder
builder.Services.AddScoped<DataSeeder>();

// Register Repositories
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

var app = builder.Build();

// 初始化数据库
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.InitializeDatabaseAsync();
}

// 映射 OpenAPI 端点
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
