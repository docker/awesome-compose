#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_derive;
extern crate rocket_contrib;

use rocket_contrib::json::Json;

#[derive(Serialize)]
struct HelloMessage {
    message: String,
}

#[get("/")]
fn index() -> Json<HelloMessage> {
    Json(HelloMessage {
        message: String::from("Hello, world"),
    })
}

fn main() {
    rocket::ignite().mount("/", routes![index]).launch();
}
