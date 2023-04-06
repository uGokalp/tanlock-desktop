use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct UserRecord<'a> {
    id: u64,
    login: &'a str,
    cname: &'a str,
    employee: u64,
    active: bool,
    four_eye: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DeviceRecord<'a> {
    id: u64,
    name: &'a str,
    ip: &'a str,
    location: &'a str,
    contact: &'a str,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MediumRecord<'a> {
    id: u64,
    r#type: u64,
    identifier: &'a str,
    login:  &'a str,
    start: bool,
    next: u64,
}

