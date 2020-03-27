#![allow(proc_macro_derive_resolution_fallback)]

use diesel;
use diesel::prelude::*;
use super::schema::users;

#[derive(Queryable, AsChangeset, Serialize, Deserialize)]
#[table_name = "users"]
pub struct User {
    pub id: i32,
    pub login: String,
}

impl User {
    pub fn all(connection: &PgConnection) -> QueryResult<Vec<User>> {
        users::table.load::<User>(&*connection)
    }
}
