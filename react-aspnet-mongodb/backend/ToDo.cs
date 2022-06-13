using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;

public class ToDo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Text { get; set; }
}