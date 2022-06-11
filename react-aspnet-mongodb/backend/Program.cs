using System;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Models;

var builder = WebApplication.CreateBuilder(args);

string connectionString = File.ReadAllText("/run/secrets/db-connection");
builder.Services.AddTransient<MongoClient>((_provider) => new MongoClient(connectionString));

var app = builder.Build();

app.MapGet("/api", async (MongoClient connection) => {
    try
    {
        var client = new MongoClient(connectionString);  
        var database = client.GetDatabase("BackendMongoDb");  

        var collection = database.GetCollection<ToDo>("ToDos");
        var results = await collection.Find(_ => true).ToListAsync().ConfigureAwait(false);

        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
});

app.Run();