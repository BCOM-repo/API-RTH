const mysql = require('mysql2');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tvradioapp'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;S
  }
  console.log('Conectado a la base de datos MySQL');

  // Consulta para crear la tabla RadioStation
  const createRadioStationTable = `
    CREATE TABLE IF NOT EXISTS RadioStation (
      id_station      INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      nombreStation   VARCHAR(80) NOT NULL,
      Frequency       FLOAT(20) NOT NULL,
      StreamURL       TINYTEXT NOT NULL,
      LogoURL         TINYTEXT NOT NULL,
      BackgroundImage TINYTEXT NOT NULL
    )`;

  // Consulta para crear la tabla Banner
  const createBannerTable = `
    CREATE TABLE IF NOT EXISTS Banner (
      id_banner       INT  AUTO_INCREMENT PRIMARY KEY NOT NULL,
      id_station      INT NOT NULL,
      ImageURL        TINYTEXT NOT NULL,
      Link            TINYTEXT NOT NULL,
      banner_date            DATE DEFAULT NULL,
      FOREIGN KEY (id_station) REFERENCES RadioStation(id_station)
    )`;

  // Consulta para crear la tabla Program
  const createProgramTable = `
    CREATE TABLE IF NOT EXISTS Program (
      id_program    INT AUTO_INCREMENT PRIMARY KEY,
      ProgramTitle  TINYTEXT,
      Description   MEDIUMTEXT
    )`;

  // Consulta para crear la tabla DaySchedule
  const createDayScheduleTable = `
    CREATE TABLE IF NOT EXISTS DaySchedule (
      id_dayschedule  INT AUTO_INCREMENT  PRIMARY KEY,
      Day             INT,
      StartTime       TIME,
      EndTime         TIME
    )`;

  // Tabla Channel
  const createChannelTable = `
  CREATE TABLE IF NOT EXISTS Channel (
    id_channel          INT             AUTO_INCREMENT PRIMARY KEY NOT NULL,
    channel_name        TINYTEXT        NOT NULL,
    channel_description TINYTEXT        NOT NULL,
    channel_number      FLOAT           NOT NULL,
    channel_stream_url  TINYTEXT        NOT NULL
  )`;

  // Tabla Program_Channel
  const createProgram_ChannelTable = `
  CREATE TABLE IF NOT EXISTS programm_channel(
    id_program INT NOT NULL,
    id_channel INT NOT NULL,
    FOREIGN KEY (id_program) REFERENCES Program(id_program),
    FOREIGN KEY (id_channel) REFERENCES Channel(id_channel) 
  )`;



  // Consulta para crear la tabla DaySchedule
  const createProgram_DayScheduleTable = `
    CREATE TABLE IF NOT EXISTS Program_DaySchedule (
      id_program INT NOT NULL,
      id_dayschedule INT NOT NULL,
      FOREIGN KEY (id_program) REFERENCES Program(id_program),
      FOREIGN KEY (id_dayschedule) REFERENCES DaySchedule(id_dayschedule)
    )`;

  // Ejecutar la consulta para crear las tablas
  connection.query(createRadioStationTable, (err, result) => {
    if (err) throw err;
    console.log('Tabla RadioStation creada o ya existe');

    connection.query(createBannerTable, (err, result) => {
      if (err) throw err;
      console.log('Tabla Banner creada o ya existe');

      connection.query(createProgramTable, (err, result) => {
        if (err) throw err;
        console.log('Tabla Program creada o ya existe');

        connection.query(createDayScheduleTable, (err, result) => {
          if (err) throw err;
          console.log('Tabla DaySchedule creada o ya existe');

          connection.query(createChannelTable, (err, result) => {
            if (err) throw err;
            console.log('Tabla Channel creada o ya existe');

            connection.query(createProgram_ChannelTable, (err, result) => {
              if (err) throw err;
              console.log('Tabla Program_Channel creada o ya existe');

              connection.query(createProgram_DayScheduleTable, (err, result) => {
              if (err) throw err;
              console.log('Tabla Program_DayScheduleTable creada o ya existe');

              // Cerrar la conexión
              connection.end((err) => {
                if (err) throw err;
                console.log('Conexión cerrada');
                 });
              });
            });
          });
        });
      });
    });
  });
});

