const mysql = require('mysql2');
const db = require('./db');
const { link } = require('./routes');
const { query } = require('express');
const fs = require('fs'); // Módulo para manejar archivos
const path = require('path'); // Para manejar rutas de archivos

// Funciones RadioStation
// Función para insertar una estación de radio
function insertRadioStation(nombreStation, frequency, streamURL, logoURL, backgroundImage, callback) {
    const query = `CALL sp_InsRadioStation(?, ?, ?, ?, ?);`; 
    db.query(query, [nombreStation, frequency, streamURL, logoURL, backgroundImage], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Función para eliminar una estación de radio

function deleteRadioStation(id_station, callback) {
    // Primero obtenemos los detalles de la estación
    getRadioStationById(id_station, (err, station) => {
        if (err) {
            console.error('Error al obtener la estación:', err);
            return callback(err);
        }

        if (!station) {
            console.error(`Estación con ID ${id_station} no existe.`);
            return callback(new Error(`La estación con ID ${id_station} no existe.`));
        }

        console.log('Estación obtenida:', station);

        const filesToDelete = [station.LogoURL, station.BackgroundImage];
        console.log('Archivos a eliminar:', filesToDelete);

        const deleteFiles = filesToDelete.map(filePath => {
            return new Promise((resolve, reject) => {
                if (!filePath) {
                    console.log('Archivo no especificado, pasando al siguiente.');
                    return resolve();
                }

                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error al eliminar el archivo ${filePath}:`, unlinkErr);
                        if (unlinkErr.code !== 'ENOENT') {
                            return reject(unlinkErr);
                        }
                    } else {
                        console.log(`Archivo eliminado: ${filePath}`);
                    }
                    resolve();
                });
            });
        });

        Promise.all(deleteFiles)
            .then(() => {
                const query = `CALL sp_DelRadioStation(?);`;
                db.query(query, [id_station], (dbErr, results) => {
                    if (dbErr) {
                        console.error('Error al eliminar la estación de la base de datos:', dbErr);
                        return callback(dbErr);
                    }

                    console.log('Estación eliminada de la base de datos.');
                    callback(null, results);
                });
            })
            .catch(fileErr => {
                console.error('Error al eliminar los archivos:', fileErr);
                callback(fileErr);
            });
    });
}


// Función para actualizar una estación de radio
function updateRadioStation(idStation, nombreStation, frequency, newStreamURL, newLogoURL, newBackgroundImage, callback) {
    // Primero obtenemos los detalles de la estación para acceder a los archivos actuales
    getRadioStationById(idStation, (err, station) => {
        if (err) {
            console.error('Error al obtener la estación de radio:', err);
            return callback(err);
        }

        if (!station) {
            console.error(`La estación con ID ${idStation} no existe.`);
            return callback(new Error(`La estación con ID ${idStation} no existe.`));
        }

        console.log('Estación obtenida:', station);

        // Rutas de las imágenes actuales
        const oldLogoPath = station.LogoURL;
        const oldBackgroundPath = station.BackgroundImage;

        // Eliminamos los archivos antiguos si existen
        const deleteOldFiles = () => {
            const deleteTasks = [];

            if (oldLogoPath) {
                deleteTasks.push(
                    new Promise((resolve, reject) => {
                        fs.unlink(oldLogoPath, (unlinkErr) => {
                            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                                reject(unlinkErr);
                            } else {
                                console.log(`Logo anterior eliminado: ${oldLogoPath}`);
                                resolve();
                            }
                        });
                    })
                );
            }

            if (oldBackgroundPath) {
                deleteTasks.push(
                    new Promise((resolve, reject) => {
                        fs.unlink(oldBackgroundPath, (unlinkErr) => {
                            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                                reject(unlinkErr);
                            } else {
                                console.log(`Fondo anterior eliminado: ${oldBackgroundPath}`);
                                resolve();
                            }
                        });
                    })
                );
            }

            return Promise.all(deleteTasks);
        };

        // Ejecutamos la eliminación de archivos y luego actualizamos la base de datos
        deleteOldFiles()
            .then(() => {
                console.log('Archivos antiguos eliminados correctamente.');
                
                // Actualizamos los datos en la base de datos
                const query = `CALL sp_UptRadioStation(?, ?, ?, ?, ?, ?);`;
                db.query(query, [idStation, nombreStation, frequency, newStreamURL, newLogoURL, newBackgroundImage], (dbErr, results) => {
                    if (dbErr) {
                        console.error('Error al actualizar la estación en la base de datos:', dbErr);
                        return callback(dbErr);
                    }

                    console.log('Estación actualizada correctamente en la base de datos.');
                    callback(null, results);
                });
            })
            .catch((deleteErr) => {
                console.error('Error al eliminar archivos antiguos:', deleteErr);
                callback(deleteErr);
            });
    });
}


// Función para obtener todas las estaciones de radio
function getRadioStations(callback) {
    const query = `CALL sp_GetRadioStations();`;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]); 
    });
}


function getRadioStationById(id_station, callback) {
    const query = "SELECT * FROM radiostation WHERE id_station = ?"; 
    db.query(query, [id_station], (err, results) => {
        if (err) return callback(err);
        console.log(results);
        callback(null, results[0]); // Devuelve solo el primer resultado
    });
}


// ------------------------------------------------------------------------------------------------------------------------
// FUNCIONES PARA BANNER

// Función para insertar Banner
function insertBanner(id_station, ImageURL, Link, date, callback) {
    const query = `CALL sp_InsBanner(?, ?, ?, ?);`;
    db.query(query, [id_station, ImageURL, Link, date], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

//Funcion para eliminar banner

function deleteBanner(id_banner, callback) {
    // Primero obtenemos los detalles del banner para obtener el archivo asociado
    getBannerById(id_banner, (err, banner) => {
        if (err) return callback(err);

        if (!banner) {
            return callback(new Error(`El banner con ID ${id_banner} no existe.`));
        }

        const filePath = banner.ImageURL; // Asegúrate de que `ImageURL` contiene la ruta al archivo
        console.log(filePath);
        // Intentamos eliminar el archivo
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                // Si el error no es porque el archivo no existe, devolvemos el error
                return callback(unlinkErr);
            }

            // Continuamos eliminando el registro del banner en la base de datos
            const query = `CALL sp_DelBanner(?);`;
            db.query(query, [id_banner], (dbErr, results) => {
                if (dbErr) return callback(dbErr);

                // Todo salió bien
                callback(null, results);
            });
        });
    });
}

// Función para actualizar banner
function updateBanner(id_banner, id_station, newImageURL, Link, date, callback) {
    // Primero obtenemos los detalles del banner para obtener el archivo actual
    getBannerById(id_banner, (err, banner) => {
        if (err) {
            console.error('Error al obtener el banner:', err);
            return callback(err);
        }

        if (!banner) {
            console.error(`Banner con ID ${id_banner} no existe.`);
            return callback(new Error(`El banner con ID ${id_banner} no existe.`));
        }

        console.log('Banner obtenido:', banner);

        // Ruta de la imagen actual
        const oldImagePath = banner.ImageURL;

        // Eliminamos la imagen anterior si existe
        if (oldImagePath) {
            fs.unlink(oldImagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error al eliminar la imagen anterior (${oldImagePath}):`, unlinkErr);
                    if (unlinkErr.code !== 'ENOENT') {
                        return callback(unlinkErr);
                    }
                } else {
                    console.log(`Imagen anterior eliminada: ${oldImagePath}`);
                }

                // Después de eliminar la imagen anterior, actualizamos el registro en la base de datos
                const query = `CALL sp_UptBanner(?, ?, ?, ?, ?);`;
                db.query(query, [id_banner, id_station, newImageURL, Link, date], (dbErr, results) => {
                    if (dbErr) {
                        console.error('Error al actualizar el banner en la base de datos:', dbErr);
                        return callback(dbErr);
                    }

                    console.log('Banner actualizado correctamente en la base de datos.');
                    callback(null, results);
                });
            });
        } else {
            console.warn('No se encontró una imagen anterior para eliminar.');
            
            // Si no hay imagen anterior, actualizamos directamente
            const query = `CALL sp_UptBanner(?, ?, ?, ?, ?);`;
            db.query(query, [id_banner, id_station, newImageURL, Link, date], (dbErr, results) => {
                if (dbErr) {
                    console.error('Error al actualizar el banner en la base de datos:', dbErr);
                    return callback(dbErr);
                }

                console.log('Banner actualizado correctamente en la base de datos.');
                callback(null, results);
            });
        }
    });
}

// Función para obtener todos los banners
function getBanner(callback) { 
    const query = `CALL sp_GetBanner();`;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
}
// ---------------------------------------------------

// ------------------------------------------------------------------------------------------------------------------------
// FUNCIONES PARA BANNER

// Función para insertar Banner
function insertBanner(id_station, ImageURL, Link, date, callback) {
    const query = `CALL sp_InsBanner(?, ?, ?, ?);`;
    db.query(query, [id_station, ImageURL, Link, date], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

/*
// Función para actualizar banner

function updateBanner(id_banner, id_station, ImageURL, Link, date,callback) {
    
    const query = `CALL sp_UptBanner(?, ?, ?, ?, ?);`;
    db.query(query, [id_banner, id_station, ImageURL, Link, date], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
} */

// Función para obtener todos los banners
function getBanner(callback) { 
    const query = `CALL sp_GetBanner();`;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
}
// ---------------------------------------------------
//Funciones para program

// Función para registrar programa en canal
function insertProgramChannel(ProgramTitle,Description,id_channel,callback){
    const query =`CALL sp_InsProgram(?,?,?,NULL);`;
    db.query(query, [ProgramTitle, Description,id_channel], (err, results) => {
        if (err) return callback(err);
        callback(null,results);
    });
}
// Función para registrar programa en radiostation
function insertProgramStation(ProgramTitle,Description,id_station,callback){
    const query =`CALL sp_InsProgram(?,?,NULL,?);`;
    db.query(query, [ProgramTitle, Description,id_station], (err, results) => {
        if (err) return callback(err);
        callback(null,results);
    });
}



// Función para eliminar programa
function deleteProgram(id_program,callback){
    const query = `CALL sp_DelProgram(?);`;
    db.query(query,[id_program],(err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Función para actualizar programa
function updateProgramChannel(id_program,ProgramTitle,Description,id_Channel,callback){
    const query = `CALL sp_UptProgram(?,?,?,?,NULL);`;
    db.query(query,[id_program,ProgramTitle,Description,id_Channel],(err, results) => {
        if (err) return callback(err);
        callback(null,results);       
    });
}

// Función para actualizar programa
function updateProgramStation(id_program,ProgramTitle,Description,id_station,callback){
    const query = `CALL sp_UptProgram(?,?,?,NULL,?);`;
    db.query(query,[id_program,ProgramTitle,Description,id_station],(err, results) => {
        if (err) return callback(err);
        callback(null,results);       
    });
}


// Función para obtener todas los programas
function getProgram(id_channel,callback){
    const query = `CALL sp_GetProgram(?);`;
    db.query(query,[id_channel],(err, results) => {
        if (err) return callback(err);
        callback(null,results[0]);
    });
}


// -----------------------------------------------------------------------------
//FUNCIONES PARA CHANNEL

// Función para instertar canal
function insertChannel(channelName,channel_description,channel_number,channel_url,callback){
   const query =`CALL sp_InsChannel(?,?,?,?);`; 

   db.query(query,[channelName,channel_description,channel_number,channel_url],(err,results) =>{
        if (err) return callback(err);
        callback(null,results);
   });
}

//Funcion para actualizar canal

function updateChannel(id_Channel,channelName,channel_description,channel_number,channel_url,callback){
    const query = `CALL sp_UptChannel(?,?,?,?,?);`;
    db.query(query,[id_Channel,channelName,channel_description,channel_number,channel_url],(err,results)=>{   
        if(err) return callback(err);
        callback(null,results);
    });
}

//Funcion para eliminar canal

function deleteChannel(id_Channel,callback){
    const query = `CALL sp_DelChannel(?);`;

    db.query(query,[id_Channel],(err,results)=>{
        if(err) return callback(err);
        callback(null,results);
    });
}

//// Función para obtener todos los canales

function getChannel(callback) {
    const query = ` select * from channel;`; 
    db.query(query, (err,results) => {
        if (err) return callback(err);
        callback(null,results);
    });
}


// Función para registrar horario y programa al que corresponde

function InsertDaySchedule(Day,StartTime,EndTime,id_program,callback){
    const query =  `CALL sp_InsDaySchedule(?,?,?,?);`;
    db.query(query,[Day, StartTime,EndTime,id_program],(err,results)=>{
        if(err) return callback(err);
        callback(null,results);
    });   
}

// Función para eliminar horario
function DeletePDS(id_daySchedule, callback) {
    const query = `DELETE FROM dayschedule WHERE id_dayschedule = ?`;
    db.query(query, [id_daySchedule], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}



//Funcion para obtener informacion de los programas registrados en un canal
function getChannelPrograms(id_channel,callback){
    const query =  `SELECT * FROM program where id_channel = ?`; 
    db.query (query,[id_channel],(err,results)=>{
        if(err) return callback(err);
        callback(null,results);
    });        
}


//Funcion para obtener los horarios de un programa por su id_program
function getProgramSchedule(id_program,callback){
    const   query = `CALL sp_GetProgramSchedule(?);`;
    db.query(query,[id_program],(err,results)=>{
        if(err) return callback(err);
        callback(null,results[0])
    });
}


//Funcion para actualizar los horarios

function updateDaySchedule(id_Dayschedule,Day,StartTime,EndTime,callback){
    const query = `CALL sp_UptDaySchedule(?,?,?,?);`;
    db.query(query,[id_Dayschedule,Day,StartTime,EndTime],(err,results)=>{
        if (err) return callback (err);
        callback(null,results[0])
    });
}

function getChannelsWithProgramsAndSchedules(callback){
    const query = "CALL sp_GetChannelsWithProgramsAndSchedules();";
    db.query(query,(err,results)=>{
        if (err) return callback (err);
        callback(null,results[0])
    });

}

function GetStationsWithProgramsAndSchedules(callback){
    const query = "CALL sp_GetStationsWithProgramsAndSchedules();";
    db.query(query,(err,results)=>{
        if (err) return callback (err);
        callback(null,results[0])
    });
}

function GetStationPrograms(id_station, callback){
    const query = "SELECT * FROM PROGRAM WHERE id_station= ? ;";
    db.query (query,[id_station],(err,results)=>{
        if(err) return callback(err);
        callback(null,results);
    });        
}

function getBannerById(id_banner, callback){
    const query = "SELECT * FROM banner  WHERE id_banner = ?";
    db.query(query, [id_banner], (err, results) => {
        if (err) return callback(err);
        console.log(results);
        callback(null, results[0]); // Devuelve solo el primer resultado
    });
}



// ----------------------------------------------------------------------------

// Exporta las funciones para usarlas en otros módulos
module.exports = {
    insertRadioStation,
    deleteRadioStation,
    updateRadioStation,
    getRadioStations,
    getRadioStationById,
    //---------------
    insertBanner,
    deleteBanner,
    updateBanner,
    getBanner,
    //-----------------
    insertProgramChannel,
    insertProgramStation,
    deleteProgram,
    updateProgramChannel,
    updateProgramStation,
    getProgram,
    //-----------------
    insertChannel,
    updateChannel,
    deleteChannel,
    getChannel,
    // ----------------
    InsertDaySchedule,
    DeletePDS,
    //---------------
    getChannelPrograms,
    getProgramSchedule,
    updateDaySchedule,
    getChannelsWithProgramsAndSchedules,
    GetStationsWithProgramsAndSchedules,
    GetStationPrograms,
    getBannerById

};
