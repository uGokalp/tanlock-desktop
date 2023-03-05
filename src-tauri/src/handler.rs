use std::path::Path;

use serde::{Deserialize, Serialize};

extern crate glob;
use self::glob::glob;

#[derive(Serialize, Deserialize)]
pub struct InitMsg {
    status: bool,
    message: String,
}

#[tauri::command]
pub fn does_db_exist() -> InitMsg {
    let db_path = Path::new("./dev.db").try_exists();
    let status = db_path.unwrap();
    let message = if status {
        "Database exists".to_string()
    } else {
        "Database does not exist".to_string()
    };
    return InitMsg { status, message };
}

#[tauri::command]
pub fn initialize_db() -> InitMsg {
    let path = "./dev.db";
    let db_path = Path::new(path).try_exists().unwrap();
    if !db_path {
        match std::fs::File::create(path) {
            Ok(_) => println!("File created"),
            Err(e) => {
                println!("Error creating file: {}", e);
                let files = glob("*").unwrap();
                let res = files
                    .map(|f| {
                        f.unwrap()
                            .file_name()
                            .unwrap()
                            .to_str()
                            .unwrap()
                            .to_string()
                    })
                    .collect::<Vec<String>>();
                return InitMsg {
                    status: false,
                    message: res.join(","),
                };
            }
        };
    }
    let connection = sqlite::open(path).unwrap();

    let query_path = "./src/migrations/initialize.sql";
    let query_path_exists = Path::new(query_path).exists();
    if query_path_exists {
        let query = std::fs::read_to_string(query_path).unwrap();
        connection.execute(query).unwrap();
    }
    return InitMsg {
        status: true,
        message: "Database initialized".to_string(),
    };
}
