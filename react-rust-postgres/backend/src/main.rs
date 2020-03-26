#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;

mod schema;
mod user;

use rocket::config::{Config, Environment, Value};
use rocket::fairing::AdHoc;
use rocket_contrib::json::Json;
use std::collections::HashMap;
use std::env;

// This macro from `diesel_migrations` defines an `embedded_migrations` module
// containing a function named `run`. This allows the example to be run and
// tested without any outside setup of the database.
embed_migrations!();

#[database("my_db")]
struct MyDBConn(diesel::PgConnection);

#[derive(Serialize)]
struct HelloMessage {
    message: String,
}

#[get("/")]
fn index(conn: MyDBConn) -> Json<HelloMessage> {
    let result = match user::User::all(&*conn) {
        Ok(res) => res.len(),
        Err(_) => 0,
    };

    Json(HelloMessage {
        message: format!("Hello with {} users", result),
    })
}

fn get_config() -> Config {
    let mut database_config = HashMap::new();
    let mut databases = HashMap::new();

    let env_address = env::var("ROCKET_ADDRESS")
        .or::<String>(Ok(String::from("localhost")))
        .unwrap();

    let env_mode = env::var("ROCKET_ENV")
        .or(Ok(String::from("development")))
        .and_then(|value| value.parse::<Environment>())
        .unwrap();

    let database_url = match env::var("DATABASE_URL") {
        Ok(value) => value,
        Err(_) => String::from("postgres://localhost/postgres"),
    };

    database_config.insert("url", Value::from(database_url));
    databases.insert("my_db", Value::from(database_config));

    let config = Config::build(env_mode)
        .address(env_address)
        .extra("databases", databases)
        .finalize()
        .unwrap();

    config
}

fn run_db_migrations(r: rocket::Rocket) -> Result<rocket::Rocket, rocket::Rocket> {
    let conn = MyDBConn::get_one(&r).expect("database connection");
    match embedded_migrations::run(&*conn) {
        Ok(()) => Ok(r),
        Err(e) => {
            println!("Failed to run database migrations: {:?}", e);
            Err(r)
        }
    }
}

fn main() {
    let config = get_config();
    rocket::custom(config)
        .attach(MyDBConn::fairing())
        .attach(AdHoc::on_attach("Database Migrations", run_db_migrations))
        .mount("/", routes![index])
        .launch();
}
