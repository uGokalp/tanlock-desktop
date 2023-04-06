use crate::records::{DeviceRecord, MediumRecord, UserRecord};

#[tauri::command]
pub fn users_to_csv(path: String, data: Vec<UserRecord<'_>>) -> bool {
    let mut wtr = csv::Writer::from_path(path).unwrap();
    for row in data {
        wtr.serialize(row).unwrap();
    }
    true
}

#[tauri::command]
pub fn devices_to_csv(path: String, data: Vec<DeviceRecord<'_>>) -> bool {
    let mut wtr = csv::Writer::from_path(path).unwrap();
    for row in data {
        wtr.serialize(row).unwrap();
    }
    true
}

#[tauri::command]
pub fn mediums_to_csv(path: String, data: Vec<MediumRecord<'_>>) -> bool {
    let mut wtr = csv::Writer::from_path(path).unwrap();
    for row in data {
        wtr.serialize(row).unwrap();
    }
    true
}

#[tauri::command]
pub async fn ping(ip: String) -> bool {
    let payload = [];
    let addr = ip.parse().unwrap();
    let result = surge_ping::ping(addr, &payload).await;
    match result {
        Ok(_) => true,
        Err(_) => false,
    }
}
