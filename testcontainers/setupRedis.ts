import redis, { type RedisClientType } from "redis"
type RedisClient = RedisClientType<any, any>

export async function setupRedis(): Promise<RedisClient> {
  if (process.env.REDIS_URL) {
    return connectToRedis(process.env.REDIS_URL)
  }

  const testcontainers = await import("testcontainers")

  const environment = await new testcontainers.DockerComposeEnvironment(".", "redis.yaml")
    .withWaitStrategy("redis", testcontainers.Wait.forLogMessage("Ready to accept connections"))
    .withNoRecreate()
    .up()

  const redisPort = environment.getContainer("redis").getMappedPort(6379)
  const redisConnectionString = `redis://localhost:${redisPort}`
  const client = await connectToRedis(redisConnectionString)

  //   const testContainersRedis = await import("@testcontainers/redis")
  //   const container = await new testContainersRedis.RedisContainer().withReuse().start()
  //   const client = await connectToRedis(container.getConnectionUrl())

  process.on("SIGINT", async () => {
    await client.quit()
    process.exit()
  })

  return client
}

async function connectToRedis(url: string): Promise<RedisClient> {
  const client = redis.createClient({ url }) as RedisClient
  client.on("error", (err) => console.log("Redis Client Error", err))
  await client.connect()

  return client
}
