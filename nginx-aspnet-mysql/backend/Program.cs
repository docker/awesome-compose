using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Primitives;
using MySql.Data;
using MySql.Data.MySqlClient;

class Program
{
    public static void Main(string[] args)  => WebHost.CreateDefaultBuilder(args)
        .Configure(async app =>
        {
            app.UseRouting();
                    
            string password = File.ReadAllText("/run/secrets/db-password");
            string connectionString = $"server=db;user=root;database=example;port=3306;password={password}";

            app.UseEndpoints(e =>
            {
                e.MapGet("/",  context => {
                    using MySqlConnection connection = new MySqlConnection(connectionString);
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
                        Console.WriteLine(ex.ToString());
                        context.Response.StatusCode = 500;
                        return Task.CompletedTask;
                    }
                    connection.Close();
                    
                    context.Response.StatusCode = 200;
                    context.Response.WriteAsJsonAsync(titles);

                    return Task.CompletedTask;
                });
            });
            Prepare(connectionString);

        }).Build().Run();

        private static void Prepare(string connectionString)
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
}