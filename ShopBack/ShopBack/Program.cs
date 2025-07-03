using ShopBack.Data;
using ShopBack.Models;
using ShopBack.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShopBack.Repositories;
using Microsoft.OpenApi.Models;
using System.Data;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment()) // ������ ����� �������� �� ����, �������� SSL-������������
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
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"])),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SelfOrAdminAccess", policy => // �������� �� �������� - ��� ��� ������������, ��� �����
        policy.RequireAssertion(async context =>
        {
            var httpContext = context.Resource as HttpContext;
            if (httpContext == null)
                return false;

            // �������� ���� Admin
            if (httpContext.User.IsInRole("Admin"))
                return true;

            // �������� userId �� ������
            var currentUserId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return false;

            // ��������� userId �� route
            var routeData = httpContext.GetRouteData();
            var routeUserId = routeData.Values["userId"]?.ToString();

            if (routeUserId == currentUserId)
                return true;

            // ���� � route ���, ��������� body
            try
            {
                // ������ body �������
                httpContext.Request.EnableBuffering(); // ����� ��� ���������� ������ body
                var body = await new StreamReader(httpContext.Request.Body).ReadToEndAsync();
                httpContext.Request.Body.Position = 0; // ���������� ������� ��� ������������ ������

                if (!string.IsNullOrEmpty(body))
                {
                    var json = JObject.Parse(body);
                    var bodyUserId = json["userId"]?.ToString(); // ������������, ��� userId ���� � ����

                    if (bodyUserId == currentUserId)
                        return true;
                }
            }
            catch
            {
                // � ������ ������ �������� ������ ���������� body
            }

            return false;
        }));

    options.AddPolicy("AdminOrModerAccess", policy => // �������� �� �������� - ������ ����� ��� �����
        policy.RequireAssertion(context =>
        {
            var httpContext = context.Resource as HttpContext;
            if (httpContext == null)
                return false;

            return httpContext.User.IsInRole("Admin") || httpContext.User.IsInRole("Moder");
        }));
});

builder.Services.AddControllers();

builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

//����������� ������������
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IReviewsRepository, ReviewsRepository>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<ITokensRepository, TokensRepository>();

//����������� �������� 
builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));
builder.Services.AddScoped<AnalyticsService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<OrdersService>();
builder.Services.AddScoped<ProductsService>();
builder.Services.AddScoped<ReviewsService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // ��������� ������ ����������� � Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization", // �������� ���������
        In = ParameterLocation.Header, // ��� ��������� �����
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // ���������, ��� ����� ��������� ��� ���� ���������� (� ���������� [Authorize])
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

// ��������� ��������� ��������
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
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
        }
        if (!db.Roles.Any())
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
        if (!db.UserRoles.Any(u => u.RoleId == 1))
        {
            Console.WriteLine("Creating admin user...");
            var adminLogin = "Admin";
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

app.UseExceptionHandler(appError => // ������������� ����������� ����������� ������
{
    appError.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>(); // �������� ���������� �� ������ �� �������
        var exception = exceptionHandlerFeature?.Error;

        context.Response.ContentType = "application/json";
        var (statusCode, message) = exception switch // ������������ ������ ������
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, "������ �� ������"),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "������ ��������"),
            ArgumentException => (StatusCodes.Status400BadRequest, "�������� ��������� �������"),
            _ => (StatusCodes.Status500InternalServerError, "���������� ������ �������")
        };

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new // ���������� ������ � ����������
        {
            StatusCode = statusCode,
            Message = message,
            Details = exception?.Message
        });
    });
});

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
