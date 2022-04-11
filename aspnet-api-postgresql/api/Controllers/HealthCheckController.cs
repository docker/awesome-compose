using aspnet_api_postgresql.Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnet_api_postgresql.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthCheckController : ControllerBase
{
    private readonly ILogger<HealthCheckController> _logger;
    private readonly ApplicationDbContext _dbContext;

    public HealthCheckController(ApplicationDbContext dbContext, ILogger<HealthCheckController> logger)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet]
    public string Ping()
    {
        try
        {
            _dbContext.Database.OpenConnection();
            _dbContext.Database.ExecuteSqlRaw("SELECT 1");
            _dbContext.Database.CloseConnection();
            return "OK";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error connecting to database");
            return "Error connecting to database";
        }
    }
}
