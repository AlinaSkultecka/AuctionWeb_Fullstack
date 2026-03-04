using Lab3_v2_Backend.Core.Services;
using Lab3_v2_Backend.Core.Services.Interface;
using Lab3_v2_Backend.Data;
using Lab3_v2_Backend.Data;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Lab3_v2_Backend.Data.Repos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// -------------------- DATABASE --------------------

var connString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Lab3_v2_Auction_Db;Integrated Security=True;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connString)
);

// -------------------- REPOSITORIES --------------------

builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IAuctionRepo, AuctionRepo>();
builder.Services.AddScoped<IBidRepo, BidRepo>();


// -------------------- SERVICES --------------------

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuctionService, AuctionService>();
builder.Services.AddScoped<IBidService, BidService>();


// -------------------- AUTOMAPPER --------------------

builder.Services.AddAutoMapper(
    typeof(Lab3_v2_Backend.Core.Mapping.MappingProfile).Assembly
);


// -------------------- JWT AUTHENTICATION --------------------

var jwtSettings = builder.Configuration.GetSection("Jwt");

var secret = jwtSettings["Key"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ClockSkew = TimeSpan.Zero,

            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();


// -------------------- SWAGGER --------------------

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Auction API",
        Description = "Web API for Lab 3 Fullstack Auction"
    });

    // Enable JWT in Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter 'Bearer {your token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
});

// -------------------- CORS --------------------

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();


// -------------------- MIDDLEWARE --------------------
app.UseCors("AllowFrontend");
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();
