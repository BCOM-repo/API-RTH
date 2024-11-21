-- PROCEDIMIENTOS PARA TABLA radiostation
-- INSERTAR estación de radio -----------------------
DELIMITER $$
CREATE PROCEDURE sp_InsRadio(
  IN _nombrestation VARCHAR(80),
  IN _frequency     FLOAT(20),
  IN _streamurl     TINYTEXT,
  IN _logourl       TINYTEXT,
  IN _backgroundimg TINYTEXT
)
BEGIN
  INSERT INTO RadioStation (nombreStation, Frequency, StreamURL, LogoURL, BackgroundImage)
  VALUES (_nombrestation, _frequency, _streamurl, _logourl, _backgroundimg);
END$$
DELIMITER ;

-- ELIMINAR estación de radio --------------------------
DELIMITER $$
CREATE PROCEDURE sp_DelRadio(
  IN _id_station INT
)
BEGIN
    IF EXISTS(SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
        DELETE FROM RadioStation WHERE id_station = _id_station;
        SELECT '0' AS com_estatus;
    ELSE
        SELECT '1' AS com_estatus;
    END IF;
END$$
DELIMITER ;

-- ACTUALIZACION de datos radiostation ------------------------------
DELIMITER $$
CREATE PROCEDURE sp_UptRadio(
  IN _id_station INT,
  IN _nombrestation VARCHAR(80),
  IN _frequency     FLOAT(20),
  IN _streamurl     TINYTEXT,
  IN _logourl       TINYTEXT,
  IN _backgroundimg TINYTEXT
)
BEGIN
    IF EXISTS(SELECT * FROM RadioStation WHERE id_station = _id_station) THEN
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

-- Procedimiento para ver las estaciones de radio registrados ---------------------------
DELIMITER $$
CREATE PROCEDURE sp_GetRadioStations()
BEGIN
    SELECT * FROM radiostation;
END$$
DELIMITER ;
-- ------------------------------------------------------------------------------------------------------
-- Procedimientos para la tabla banner -----------------------------------------------------------------
-- Insersion de banner
DELIMITER $$
CREATE PROCEDURE sp_InsBanner(
IN _id_station INT,
IN _ImageURL TINYTEXT,
IN _Link 	TINYTEXT ,
IN _date	DATE
)
BEGIN
-- Asignar NULL si _date no tiene valor
    SET _date = IFNULL(_date, NULL);
	IF EXISTS (SELECT * FROM radiostation where id_station = _id_station) THEN
    INSERT INTO banner (id_station,ImageURL,Link,banner_date) VALUES (_id_station,_ImageURL,_Link,_date);
		SELECT '0' AS com_estatus;
	ELSE
    	SELECT '1' AS com_estatus;
	END IF;
END$$
DELIMITER ;


-- Eliminiacion de banner
DELIMITER $$

CREATE PROCEDURE sp_DelBanner(
  IN _id_banner INT
)
BEGIN
  IF EXISTS ( SELECT * FROM banner where id_banner=_id_banner) THEN
    DELETE FROM banner WHERE id_banner = _id_banner;
    SELECT '0' AS com_estatus;
  ELSE
    SELECT '1' AS com_estatus;
  END IF;
END $$
DELIMITER ;

-- Procedimiento para actualización de datos
DELIMITER $$
CREATE PROCEDURE sp_UptBanner(
  IN _id_banner 	INT,
  IN _id_station 	INT,
  IN _imageURL     	TINYTEXT,
  IN _Link     		TINYTEXT,
  IN _banner_date   DATE
)
BEGIN
    IF EXISTS(SELECT * FROM banner WHERE id_banner = _id_banner) THEN
		IF EXISTS (SELECT * FROM radiostation WHERE id_station = _id_station)THEN
        UPDATE banner
        SET id_station = _id_station, 
            ImageURL = _imageURL, 
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


-- PROCEDIMIENTO PARA VER LISTA DE BANNER
DELIMITER $$
CREATE PROCEDURE sp_GetBanner()
BEGIN
SELECT * FROM BANNER;
END$$
DELIMITER ;
-- ------------------------------------------------------------------------------------------------
-- PROCEDIMIENTOS PARA TABLA PROGRAM
-- INSERTAR programa
DELIMITER $$
	CREATE PROCEDURE sp_InsProgram(
    IN _ProgramTitle tinytext,
    IN	_Description mediumtext
    )
    BEGIN
    INSERT INTO program(ProgramTitle,Description) VALUES(
    _ProgramTitle,_Description);
    END$$
DELIMITER ;

-- ELIMINAR programa
DELIMITER $$
	CREATE PROCEDURE sp_DelProgram(
    IN _id_program INT
    )
    BEGIN
    IF EXISTS (SELECT * FROM program WHERE id_program = _id_program)THEN
		DELETE FROM program WHERE id_program = _id_program;
        SELECT '0' AS com_estatus;
        ELSE
        SELECT '1' AS com_estatus;
		END IF;
    END$$    
DELIMITER ;
-- ACTUALIZAR REGISTROS programa --------------------------------------------------------------------
DELIMITER $$
	CREATE PROCEDURE sp_UptProgramm(
    IN 	_id_program 	INT,
    IN 	_ProgramTitle	TINYTEXT,
    IN	_Description	MEDIUMTEXT,
    )    
	BEGIN
	IF EXISTS(SELECT * FROM program WHERE id_program = _id_program) THEN
	UPDATE program
    SET
		ProgramTitle = _ProgramTitle,
		Description =	_Description
    
    WHERE id_program = _id_program;
		SELECT '0' AS com_estatus;
	ELSE
		SELECT '1' AS com_estatus;
	END IF;
    END$$
DELIMITER ; 


-- PROCEDMIENTO PARA VER LISTA DE PROGRAMAS
DELIMITER $$
CREATE PROCEDURE sp_GetProgram()
BEGIN
	SELECT*FROM program;
END $$
DELIMITER ;


-- PROCEDIMIENTOS PARA channel --------------------------------------------------------------------
-- INSERTAR CHANNEL
DELIMITER $$
CREATE PROCEDURE sp_InsChannel(
IN _channel_name 		TINYTEXT,
IN _channel_description	TINYTEXT,
IN _channel_number		FLOAT,
IN _channel_url			TINYTEXT
)
BEGIN
	INSERT INTO channel(channel_name,channel_description,channel_number,channel_stream_url) 
    VALUES(_channel_name,_channel_description,_channel_number,_channel_url);
END $$
DELIMITER ; 

-- ELIMINAR CHANNEL

DELIMITER $$
CREATE PROCEDURE sp_DelChannel(
  IN _id_channel INT
)
BEGIN
    IF EXISTS(SELECT * FROM channel WHERE id_channel = _id_channel) THEN
        DELETE FROM channel WHERE id_channel = _id_channel;
        SELECT '0' AS com_estatus;
    ELSE
        SELECT '1' AS com_estatus;
    END IF;
END$$
DELIMITER ;

-- ACTUALIZAR REGISTROS channel

DELIMITER $$
	CREATE PROCEDURE sp_UptChannel(
    IN 	_id_channel 			INT,
    IN 	_channel_name			TINYTEXT,
    IN	_channel_description	TINYTEXT,
    IN	_channel_number			FLOAT,
    IN	_channel_url			TINYTEXT
    )    
	BEGIN
	IF EXISTS(SELECT * FROM channel WHERE id_channel = _id_channel) THEN
	UPDATE channel
    SET
		channel_name = _channel_name,
		channel_description =	_channel_description,
		channel_number	= _channel_number,
		channel_stream_url		=	_channel_url
    WHERE id_channel = _id_channel;
		SELECT '0' AS com_estatus;
	ELSE
		SELECT '1' AS com_estatus;
	END IF;
    END$$
DELIMITER ; 

-- PROCEDIMIENTO PARA VISTA DE channel
DELIMITER $$
CREATE PROCEDURE sp_GetChannel()
BEGIN
SELECT * FROM channel;
END$$
DELIMITER ;
 
-- Procedimientos para DaySchedule ----------------------------------------------------------------
-- INSERTAR DaySchedule
DELIMITER $$
CREATE PROCEDURE sp_InsDaySchedule(
IN	_day				INT,
IN 	_StartTime			TIME,
IN 	_EndTime			TIME
)
BEGIN
INSERT INTO dayschedule(Day,StartTime,EndTime) 
VALUES (_day,_StartTime,_EndTime);
END $$
DELIMITER ;

-- UPDATE DaySchedule
DELIMITER $$
CREATE PROCEDURE sp_UptDaySchedule(
	IN _id_Dayschedule		INT,
	IN	_day				INT,
	IN 	_StartTime			TIME,
	IN 	_EndTime			TIME
)
BEGIN
UPDATE  dayschedule
	SET 
	Day =		_day,
    StartTime = _StartTime,
    EndTime	=	_EndTime
WHERE 	id_Dayschedule = _id_Dayschedule;
    
END $$
DELIMITER ;


-- PROCEDIMIENTO PARA ELIMINAR REGISTROS
DELIMITER $$
	CREATE PROCEDURE sp_DelDayschedule(
    IN _id_Dayschedule INT
    )
BEGIN
	 IF EXISTS(SELECT * FROM dayschedule WHERE id_Dayschedule = _id_Dayschedule) THEN
        DELETE FROM dayschedule WHERE id_Dayschedule = _id_Dayschedule;
        SELECT '0' AS com_estatus;
    ELSE
        SELECT '1' AS com_estatus;
    END IF;
    
END $$
DELIMITER ;

-- PROCEDIMIENTO PARA VISTA DE Dayschedule

DELIMITER $$
CREATE PROCEDURE sp_GetDayschedule ()
BEGIN
	SELECT * FROM Dayschedule;

END $$
DELIMITER ; 