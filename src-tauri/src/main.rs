#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod handler;
pub mod records;

use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            on_button_clicked,
            handler::ping,
            handler::users_to_csv,
            handler::devices_to_csv,
            handler::mediums_to_csv,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
