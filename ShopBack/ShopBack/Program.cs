using ShopBack.Data;
using ShopBack.Models;
using ShopBack.Services;
using ShopBack.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Diagnostics;
using ShopBack.Authorization;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment()) // убрать после поднятия на прод, проверка SSL-сертификатов
{
    builder.Services.AddHttpClient("NoSSL").ConfigurePrimaryHttpMessageHandler(() =>
        new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://ziragon.ru")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();

        policy.WithOrigins("https://js.stripe.com", "https://merchant-ui-api.stripe.com")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });

});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secret = builder.Configuration["Jwt:Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("JWT Secret is not configured");
        }
        var key = Encoding.ASCII.GetBytes(secret);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddCustomPolicies();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

//подключение репозиториев
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IReviewsRepository, ReviewsRepository>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<ITokensRepository, TokensRepository>();
builder.Services.AddScoped<IPayMethodsRepository, PayMethodsRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

//Подключение сервисов 
builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));
builder.Services.AddScoped<AnalyticsService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<OrdersService>();
builder.Services.AddScoped<ProductsService>();
builder.Services.AddScoped<ReviewsService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<PayMethodsService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<IPaymentGateway, StripePaymentGateway>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Добавляем кнопку авторизации в Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization", // Название заголовка
        In = ParameterLocation.Header, // Где передаётся токен
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Указывает, что токен требуется для всех эндпоинтов (с параметром [Authorize])
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Настройка конвейера запросов
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>(); // Применение миграций при запуске приложения
    try
    {
        if (!db.Database.CanConnect())
        {
            Console.WriteLine("Creating database...");
            db.Database.EnsureCreated();
        }
        else
        {
            Console.WriteLine("Applying migrations...");
            db.Database.Migrate();
            db.EnsureSequencesAreSynced();
        }
        if (!db.Roles.Any()) // Создание ролей, если их нету в бд
        {
            Console.WriteLine("Seeding initial roles...");
            db.Roles.AddRange(
                new Roles { Id = 1, Name = "Admin" },
                new Roles { Id = 2, Name = "Moder" },
                new Roles { Id = 3, Name = "User" }
            );
            await db.SaveChangesAsync();
            Console.WriteLine("Initial roles seeded successfully.");
        }
        if (!db.UserRoles.Any(u => u.RoleId == 1)) // Если нету пользователя с ролью админа, создаем нового
        {
            Console.WriteLine("Creating admin user...");
            var adminLogin = "Admin@ya.ru";
            var adminPassword = "Password";

            var userService = scope.ServiceProvider.GetRequiredService<UserService>();
            var userRoleService = scope.ServiceProvider.GetRequiredService<IService<UserRoles>>();
            var success = await userService.RegisterAsync(adminLogin, adminPassword, "Nikita", "Aleeksevich", "Shushakov");

            if (success != null)
            {
                Console.WriteLine("Admin user created successfully.");

                var existingUserRole = await db.UserRoles
                    .FirstOrDefaultAsync(u => u.UserId == success.UserId);

                if (existingUserRole != null)
                {
                    db.UserRoles.Remove(existingUserRole);
                    await db.SaveChangesAsync();
                }

                var newUserRole = new UserRoles
                {
                    UserId = success.UserId,
                    RoleId = 1
                };

                db.UserRoles.Add(newUserRole);
                await db.SaveChangesAsync();

                Console.WriteLine("Admin role assigned successfully.");
            }
            else
            {
                Console.WriteLine("Failed to create admin user.");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database error: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
    }
}

app.UseExceptionHandler(appError => // использование глобального обработчика ошибок
{
    appError.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>(); // получаем информацию об ошибке из сервиса
        var exception = exceptionHandlerFeature?.Error;

        context.Response.ContentType = "application/json";
        var (statusCode, message) = exception switch // обрабатываем статус ошибки
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, exception.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
            InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Внутренняя ошибка сервера"),
        };

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new // выкидываем ошибку в контроллер
        {
            StatusCode = statusCode,
            Message = message,
        });
    });
});

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
