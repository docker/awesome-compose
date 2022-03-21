using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

string password = File.ReadAllText("/run/secrets/db-password");
string connectionString = $"server=db;user=root;database=example;port=3306;password={password}";

builder.Services.AddTransient<MySqlConnection>((_provider) => new MySqlConnection(connectionString));

var app = builder.Build();

app.MapGet("/", (MySqlConnection connection) => {
    var titles = new List<string>();

    try
    {
        Console.WriteLine("Connecting to MySQL...");
        connection.Open();

        string sql = "SELECT title FROM blog";
        using var cmd = new MySqlCommand(sql, connection);
        using MySqlDataReader reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            titles.Add(reader.GetString(0));
        }
        reader.Close();
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.ToString());
    }
    connection.Close();
    
    return Results.Ok(titles);
});
Prepare(connectionString);

app.Run();

void Prepare(string connectionString)
{
    using MySqlConnection connection = new MySqlConnection(connectionString);

    connection.Open();
    using var transation = connection.BeginTransaction();

    using MySqlCommand cmd1 = new MySqlCommand("DROP TABLE IF EXISTS blog", connection, transation);
    cmd1.ExecuteNonQuery();

    using MySqlCommand cmd2 = new MySqlCommand("CREATE TABLE IF NOT EXISTS blog (id int NOT NULL AUTO_INCREMENT, title varchar(255), PRIMARY KEY (id))", connection, transation);
    cmd2.ExecuteNonQuery();
    
    for (int i = 0; i < 5; i++)
    {
        using MySqlCommand insertCommand = new MySqlCommand( $"INSERT INTO blog (title) VALUES ('Blog post #{i}');", connection, transation);
        insertCommand.ExecuteNonQuery();
    }
    transation.Commit();
    connection.Close();
}
