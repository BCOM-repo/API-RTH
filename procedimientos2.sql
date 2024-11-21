-- INSERTAR RadioStation
DELIMITER $$
CREATE PROCEDURE sp_InsRadioStation(
  IN _nombrestation VARCHAR(80),
  IN _frequency FLOAT(20),
  IN _streamurl TINYTEXT,
  IN _logourl TINYTEXT,
  IN _backgroundimg TINYTEXT
)
BEGIN
  INSERT INTO RadioStation (nombreStation, Frequency, StreamURL, LogoURL, BackgroundImage)
  VALUES (_nombrestation, _frequency, _streamurl, _logourl, _backgroundimg);
END$$
DELIMITER ;

-- ELIMINAR RadioStation
DELIMITER $$
CREATE PROCEDURE sp_DelRadioStation(
  IN _id_station INT
)
BEGIN
  IF EXISTS (SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
    DELETE FROM RadioStation WHERE id_station = _id_station;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- ACTUALIZAR RadioStation
DELIMITER $$
CREATE PROCEDURE sp_UptRadioStation(
  IN _id_station INT,
  IN _nombrestation VARCHAR(80),
  IN _frequency FLOAT(20),
  IN _streamurl TINYTEXT,
  IN _logourl TINYTEXT,
  IN _backgroundimg TINYTEXT
)
BEGIN
  IF EXISTS (SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
    UPDATE RadioStation
    SET nombreStation = _nombrestation,
        Frequency = _frequency,
        StreamURL = _streamurl,
        LogoURL = _logourl,
        BackgroundImage = _backgroundimg
    WHERE id_station = _id_station;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- VISTA de RadioStation
DELIMITER $$
CREATE PROCEDURE sp_GetRadioStations()
BEGIN
  SELECT * FROM RadioStation;
END$$
DELIMITER ;
-- -----------------------------------------------------------------------------------------------
-- -----------------------------------------------------------------------------------------------
-- INSERTAR Banner
DELIMITER $$
CREATE PROCEDURE sp_InsBanner(
  IN _id_station INT,
  IN _ImageURL TINYTEXT,
  IN _Link TINYTEXT,
  IN _date DATE
)
BEGIN
  SET _date = IFNULL(_date, NULL);
  IF EXISTS (SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
    INSERT INTO Banner (id_station, ImageURL, Link, banner_date)
    VALUES (_id_station, _ImageURL, _Link, _date);
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- ELIMINAR Banner
DELIMITER $$
CREATE PROCEDURE sp_DelBanner(
  IN _id_banner INT
)
BEGIN
  IF EXISTS (SELECT * FROM Banner WHERE id_banner = _id_banner) THEN
    DELETE FROM Banner WHERE id_banner = _id_banner;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- ACTUALIZAR Banner
DELIMITER $$
CREATE PROCEDURE sp_UptBanner(
  IN _id_banner INT,
  IN _id_station INT,
  IN _ImageURL TINYTEXT,
  IN _Link TINYTEXT,
  IN _banner_date DATE
)
BEGIN
  IF EXISTS (SELECT * FROM Banner WHERE id_banner = _id_banner) THEN
    IF EXISTS (SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
      UPDATE Banner
      SET id_station = _id_station,
          ImageURL = _ImageURL,
          Link = _Link,
          banner_date = _banner_date
      WHERE id_banner = _id_banner;
      SELECT '0' AS com_estatus;
    ELSE
      SELECT '2' AS com_estatus;
    END IF;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- VISTA de Banner
DELIMITER $$
CREATE PROCEDURE sp_GetBanner()
BEGIN
  SELECT * FROM Banner;
END$$
DELIMITER ;

-- ----------------------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------------------
-- INSERTAR programa
DELIMITER $$
CREATE PROCEDURE sp_InsProgram(
  IN _ProgramTitle TINYTEXT,
  IN _Description MEDIUMTEXT,
  IN _id_channel INT
)
BEGIN
IF EXISTS (SELECT * FROM channel WHERE id_channel = _id_channel) THEN
  INSERT INTO program (ProgramTitle, Description, id_channel)
  VALUES (_ProgramTitle, _Description, _id_channel);
  SELECT '0' AS com_estatus;
  ELSE
  SELECT '1' AS com_estatus;
  END IF;

END$$
DELIMITER ;

-- ELIMINAR programa
DELIMITER $$
CREATE PROCEDURE sp_DelProgram(
  IN _id_program INT
)
BEGIN
  IF EXISTS (SELECT * FROM program WHERE id_program = _id_program) THEN
    DELETE FROM program WHERE id_program = _id_program;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- ACTUALIZAR programa
DELIMITER $$
CREATE PROCEDURE sp_UptProgram(
  IN _id_program INT,
  IN _ProgramTitle TINYTEXT,
  IN _Description MEDIUMTEXT,
  IN _id_channel INT
)
BEGIN
  IF EXISTS (SELECT * FROM program WHERE id_program = _id_program) THEN
    UPDATE program
    SET ProgramTitle = _ProgramTitle,
        Description = _Description,
        id_channel = _id_channel
    WHERE id_program = _id_program;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- VISTA de programas
DELIMITER $$
CREATE PROCEDURE sp_GetProgram()
BEGIN
  SELECT * FROM program;
END$$
DELIMITER ;





-- --------------------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------------------
-- INSERTAR canal
DELIMITER $$
CREATE PROCEDURE sp_InsChannel(
  IN _channel_name TINYTEXT,
  IN _channel_description TINYTEXT,
  IN _channel_number FLOAT,
  IN _channel_url TINYTEXT
)
BEGIN
  INSERT INTO channel (channel_name, channel_description, channel_number, channel_stream_url)
  VALUES (_channel_name, _channel_description, _channel_number, _channel_url);
END$$
DELIMITER ;

-- ELIMINAR canal
DELIMITER $$
CREATE PROCEDURE sp_DelChannel(
  IN _id_channel INT
)
BEGIN
  IF EXISTS (SELECT * FROM channel WHERE id_channel = _id_channel) THEN
    DELETE FROM channel WHERE id_channel = _id_channel;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- ACTUALIZAR canal
DELIMITER $$
CREATE PROCEDURE sp_UptChannel(
  IN _id_channel INT,
  IN _channel_name TINYTEXT,
  IN _channel_description TINYTEXT,
  IN _channel_number FLOAT,
  IN _channel_url TINYTEXT
)
BEGIN
  IF EXISTS (SELECT * FROM channel WHERE id_channel = _id_channel) THEN
    UPDATE channel
    SET channel_name = _channel_name,
        channel_description = _channel_description,
        channel_number = _channel_number,
        channel_stream_url = _channel_url
    WHERE id_channel = _id_channel;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END$$
DELIMITER ;

-- VISTA de canales
DELIMITER $$
CREATE PROCEDURE sp_GetChannel()
BEGIN
  SELECT * FROM channel;
END$$
DELIMITER ;

-- --------------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------------
-- Procedieminto para insertar horario programa y canal
DELIMITER $$
CREATE PROCEDURE sp_InsDaySchedule(
    IN _Day INT,
    IN _StartTime TIME,
    IN _EndTime TIME,
    IN _id_channel INT,
    IN _id_programm INT
)
BEGIN
    -- Inserta en la tabla DaySchedule y obtiene el id autoincrementable generado
    INSERT INTO DaySchedule (Day, StartTime, EndTime) 
    VALUES (_Day, _StartTime, _EndTime);
    
    -- Obtiene el id del DaySchedule recién insertado
    SET @last_daySchedule_id = LAST_INSERT_ID();

    -- Inserta en la tabla program_dayschedule usando el id generado y los otros parámetros
    INSERT INTO program_dayschedule (id_day_schedule, id_channel, id_program) 
    VALUES (@last_daySchedule_id, _id_channel, _id_programm);

END$$
DELIMITER ;

-- ELIMINAR DaySchedule ----------------------------------------------------------------
DELIMITER $$ 
CREATE PROCEDURE sp_DelPDS(
IN _id_pd INT,
IN _id_dayschedule INT
)
BEGIN
	DELETE FROM Program_DaySchedule WHERE id_pd = _id_pd;
    DELETE FROM DaySchedule WHERE id_dayschedule = _id_dayschedule;
END $$
DELIMITER ;

-- VISTA de DaySchedule -----------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE sp_GetDaySchedule()
BEGIN
  SELECT * FROM dayschedule;
END$$
DELIMITER ;

-- ACTUALIZAR HORARIO -------------------------------------------------------------------
DELIMITER $$
CREATE  PROCEDURE `sp_UptDaySchedule`(
  IN _id_Dayschedule INT,
  IN _day INT,
  IN _StartTime TIME,
  IN _EndTime TIME
)
BEGIN
  IF EXISTS (SELECT * FROM dayschedule WHERE id_Dayschedule = _id_Dayschedule) THEN
    UPDATE dayschedule
    SET `Day` = _day,
        StartTime = _StartTime,
        EndTime = _EndTime
    WHERE id_Dayschedule = _id_Dayschedule;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END $$ 
DELIMITER ;
-- ---------------------------------------------------------------------




-- --------------------------------------------------------------------------------------------------
-- PROCEDIMIENTO PARA OBTENER INFORMACION APARTIR DE EL ID CANAL-------------------------------------
DELIMITER $$
CREATE PROCEDURE sp_GetProgramInfo(
IN _id_channel INT
)
BEGIN
    SELECT 
        ch.channel_name AS channel_name,
        ch.id_channel AS id_channel,
        p.ProgramTitle AS ProgramTitle,
        p.Description AS ProgramDescription,
        ds.Day AS Day,
        ds.StartTime AS StartTime,
        ds.EndTime AS EndTime
    FROM 
        `channel` ch
   INNER JOIN 
        program p ON p.id_channel = ch.id_channel
    INNER JOIN 
        program_dayschedule pd ON pd.id_program = p.id_program
    INNER JOIN 
        dayschedule ds ON ds.id_dayschedule = pd.id_day_schedule
    WHERE 
         ch.id_channel = _id_channel;
END $$
DELIMITER ;
-- --------------------------------------------------------------------
-- -------------------------------------------------------------------------------------------------
-- Procedimiento para obtener los programas de un canal
DELIMITER $$
CREATE PROCEDURE sp_GetChannelPrograms(
IN _id_channel INT
)
BEGIN
    SELECT 
        ch.channel_name AS channel_name,
        ch.id_channel AS id_channel,
        p.ProgramTitle AS ProgramTitle,
        p.Description AS ProgramDescription,
        ds.Day AS Day,
        ds.StartTime AS StartTime,
        ds.EndTime AS EndTime
    FROM 
        `channel` ch
   INNER JOIN 
        program p ON p.id_channel = ch.id_channel
    INNER JOIN 
        program_dayschedule pd ON pd.id_program = p.id_program
    INNER JOIN 
        dayschedule ds ON ds.id_dayschedule = pd.id_day_schedule
    WHERE 
         ch.id_channel = _id_channel;
END $$
DELIMITER ;