using System;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string connectionString = builder.Configuration.GetConnectionString("DocumentDbConnection");
string databaseName = builder.Configuration.GetConnectionString("DocumentDbName") ?? "BackendMongoDb";
string collectionName = builder.Configuration.GetConnectionString("DocumentCollectionName") ?? "ToDos";

builder.Services.AddTransient<MongoClient>((_provider) => new MongoClient(connectionString));

var app = builder.Build();

var isSwaggerEnabledFromConfig = bool.TrueString.Equals(builder.Configuration["EnableSwagger"] ?? "", StringComparison.OrdinalIgnoreCase);
if (isSwaggerEnabledFromConfig) 
{
    Console.WriteLine("Swagger enabled via appsettings.json");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || isSwaggerEnabledFromConfig)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/api/todos", async (MongoClient connection) =>
{
    try
    {
        var database = connection.GetDatabase(databaseName);
        var collection = database.GetCollection<ToDo>(collectionName);
        var results = await collection.Find(_ => true).ToListAsync().ConfigureAwait(false);

        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});

app.MapGet("/api/todos/{id}", async (string id, MongoClient connection) =>
{
    try
    {
        var database = connection.GetDatabase(databaseName);
        var collection = database.GetCollection<ToDo>(collectionName);
        var result = await collection.FindAsync(record => record.Id == id).ConfigureAwait(false) as ToDo;
        
        if (result is null) 
        {
            return Results.NotFound();
        }

        return Results.Created($"/todoitems/{result.Id}", result);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});

app.MapPost("/api/todos", async (ToDo record, MongoClient connection) =>
{
    try
    {
        var database = connection.GetDatabase(databaseName);
        var collection = database.GetCollection<ToDo>(collectionName);
        await collection.InsertOneAsync(record).ConfigureAwait(false);

        return Results.Created($"/api/todos/{record.Id}", record);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});

app.Run();
