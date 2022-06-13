using System;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Models;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("DocumentDbConnection");
string databaseName = builder.Configuration["DocumentDbName"] ?? "BackendMongoDb";
string collectionName = builder.Configuration["DocumentCollectionName"] ?? "ToDos";

builder.Services.AddTransient<MongoClient>((_provider) => new MongoClient(connectionString));

var app = builder.Build();

app.MapGet("/api/todos", async (MongoClient connection) => {
    try
    {
        var client = new MongoClient(connectionString);  
        var database = client.GetDatabase(databaseName);  

        var collection = database.GetCollection<ToDo>(collectionName);
        var results = await collection.Find(_ => true).ToListAsync().ConfigureAwait(false);

        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});


app.MapGet("/api/todos/{id}", async (string id, MongoClient connection) => {
    try
    {
        var client = new MongoClient(connectionString);  
        var database = client.GetDatabase(databaseName);  

        var collection = database.GetCollection<ToDo>(collectionName);
        var result = await collection.FindAsync(record => record.Id == id).ConfigureAwait(false);

        return result is ToDo todo
                ? Results.Ok(todo)
                : Results.NotFound();
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});

app.MapPost("/api/todos", async (ToDo record, MongoClient connection) => {
    try
    {
        var client = new MongoClient(connectionString);  
        var database = client.GetDatabase(databaseName);  

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
