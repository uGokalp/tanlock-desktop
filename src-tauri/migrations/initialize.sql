--
-- File generated with SQLiteStudio v3.4.3 on Sat Mar 4 11:29:16 2023
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: device
DROP TABLE IF EXISTS device;

CREATE TABLE IF NOT EXISTS device (
    id                  INTEGER NOT NULL
                                PRIMARY KEY AUTOINCREMENT,
    device__name        TEXT,
    device__contact     TEXT    NOT NULL,
    device__location    TEXT    NOT NULL,
    device__serialno    TEXT    NOT NULL,
    network__macaddr    TEXT    NOT NULL,
    network__ip         TEXT    NOT NULL,
    network__netmask    TEXT    NOT NULL,
    network__dns        TEXT    NOT NULL,
    network__gateway    TEXT    NOT NULL,
    relais__r1          BOOLEAN NOT NULL,
    relais__r0          BOOLEAN NOT NULL,
    time__time          TEXT    NOT NULL,
    time__offset        TEXT    NOT NULL,
    time__invalid       BOOLEAN NOT NULL,
    time__stamp         INTEGER NOT NULL,
    version__filesystem TEXT    NOT NULL,
    version__hwdesc     TEXT    NOT NULL,
    version__software   TEXT    NOT NULL,
    version__flavor     TEXT    NOT NULL,
    version__hash       TEXT    NOT NULL,
    version__branch     TEXT    NOT NULL,
    version__firmware   TEXT    NOT NULL,
    version__build      TEXT    NOT NULL,
    version__date       TEXT    NOT NULL,
    version__hardware   TEXT    NOT NULL,
    external__s2        BOOLEAN NOT NULL,
    external__s1        BOOLEAN NOT NULL,
    sensor__lock        BOOLEAN NOT NULL,
    sensor__handle      BOOLEAN NOT NULL,
    sensor__motor       BOOLEAN NOT NULL
);


-- Table: device_group
DROP TABLE IF EXISTS device_group;

CREATE TABLE IF NOT EXISTS device_group (
    id   INTEGER PRIMARY KEY AUTOINCREMENT
                 NOT NULL,
    name TEXT    NOT NULL
                 UNIQUE
);


-- Table: device_group_xref
DROP TABLE IF EXISTS device_group_xref;

CREATE TABLE IF NOT EXISTS device_group_xref (
    id        INTEGER PRIMARY KEY AUTOINCREMENT
                      NOT NULL,
    group_id  INTEGER REFERENCES device_group (id) ON DELETE CASCADE
                      NOT NULL,
    device_id INTEGER REFERENCES device (id) ON DELETE CASCADE
                      NOT NULL
);


-- Table: device_user_xref
DROP TABLE IF EXISTS device_user_xref;

CREATE TABLE IF NOT EXISTS device_user_xref (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    device_xref_id INTEGER REFERENCES device_group_xref (id) ON DELETE CASCADE,
    user_xref_id   INTEGER REFERENCES user_group_xref (id) ON DELETE CASCADE
);


-- Table: user
DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user (
    id       INTEGER NOT NULL
                     PRIMARY KEY AUTOINCREMENT,
    login    TEXT    NOT NULL,
    cname    TEXT    NOT NULL,
    employee TEXT    NOT NULL,
    active   BOOLEAN NOT NULL,
    four_eye BOOLEAN NOT NULL,
    uid      INTEGER
);


-- Table: user_group
DROP TABLE IF EXISTS user_group;

CREATE TABLE IF NOT EXISTS user_group (
    id   INTEGER PRIMARY KEY AUTOINCREMENT
                 NOT NULL,
    name TEXT    NOT NULL
                 UNIQUE
);


-- Table: user_group_xref
DROP TABLE IF EXISTS user_group_xref;

CREATE TABLE IF NOT EXISTS user_group_xref (
    id       INTEGER PRIMARY KEY AUTOINCREMENT
                     NOT NULL,
    user_id  INTEGER NOT NULL
                     REFERENCES user (id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES user_group (id) ON DELETE CASCADE
                     NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
