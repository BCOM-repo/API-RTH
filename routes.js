const express = require('express');
const router = express.Router();
const functions = require('./functions');
const multer = require('multer');
const path = require('path');

// Ruta raíz
router.get('/', (req, res) => {
    res.json([{ "Hola": "Hola Mundo" }]);
});

// Ruta para obtener todas las estaciones
router.get('/stations', (req, res) => {
    functions.getRadioStations((err, stations) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving radio stations' });
        }
        return res.json(stations);
    });
});

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage: storage });


// Ruta para agregar una nueva estación
router.post('/stations', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'background', maxCount: 1 }
]), (req, res) => {
    console.log(req.body);
    const { name, frequency, streamURL } = req.body;
    let logoURL = req.files['logo'] ? req.files['logo'][0].path : null; // URL del archivo subido
    let backgroundImage = req.files['background'] ? req.files['background'][0].path : null; // URL del archivo subido

    // Reemplaza \\ por / en las rutas
    if (logoURL) {
        logoURL = logoURL.replace(/\\/g, '/');
    }
    if (backgroundImage) {
        backgroundImage = backgroundImage.replace(/\\/g, '/');
    }

    // Llama a la función insertRadioStation con los datos del formulario
    functions.insertRadioStation(name, frequency, streamURL, logoURL, backgroundImage, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err }); 
        }
        res.status(201).json({ id: results.insertId, name, frequency, streamURL, logoURL, backgroundImage });
    });
});


// Ruta para actualizar una estación
router.post('/stations/update', upload.fields([
    { name: 'logoUrl', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]), (req, res) => {
    console.log(req.body);
    const { id, name, frequency, streamURL } = req.body;
    let logoURL = req.files['logoUrl'] ? req.files['logoUrl'][0].path : null;
    let backgroundImage = req.files['backgroundImage'] ? req.files['backgroundImage'][0].path : null;

    // Reemplaza \\ por / en las rutas
    if (logoURL) {
        logoURL = logoURL.replace(/\\/g, '/');
    }
    if (backgroundImage) {
        backgroundImage = backgroundImage.replace(/\\/g, '/');
    }

    // Llama a getRadioStationById con callback
    functions.getRadioStationById(id, (err, currentStation) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve current station data', details: err });
        }

        // Usa los valores actuales si logoURL o backgroundImage son nulos
        if (!logoURL) {
            logoURL = currentStation.LogoURL;
            console.log(currentStation.LogoURL);
        }
        if (!backgroundImage) {
            backgroundImage = currentStation.BackgroundImage;
        }

        // Actualiza la estación con los valores proporcionados o conservando los existentes
        functions.updateRadioStation(id, name, frequency, streamURL, logoURL, backgroundImage, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err });
            }
            res.status(200).json({ id, name, frequency, streamURL, logoURL, backgroundImage });
        });
    });
});

//Ruta para eliminar una estacion

router.delete('/stations/:id', (req,res) => {
    const id_station =req.params.id;
        functions.deleteRadioStation(id_station, (err,results)=>{
                if (err){
                    return res.status(500).json({ error: 'Error deleting station', details: err });
                }
            res.status(200).json({message: 'Station deleted successfully', results});
        });
    });  
    
    
//Ruta para obtener banners
router.get('/banners', (req, res) => {
    functions.getBanner((err, banners) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving banners' });
        }
        return res.json(banners);
    });
});

// Ruta para obtener BANNER por medio de ID



// Ruta para agregar un nuevo banner
router.post('/banners', upload.fields([
    { name: 'ImageURL', maxCount: 1 },
]), (req, res) => {
    console.log(req.body);
    const { id_station, link, banner_date } = req.body;
    let ImageURL = req.files['ImageURL'] ? req.files['ImageURL'][0].path : null; // URL del archivo subido

    // Reemplaza \\ por / en las rutas
    if (ImageURL) {
        ImageURL = ImageURL.replace(/\\/g, '/');
    }

    // Llama a la función insertRadioStation con los datos del formulario
    functions.insertBanner(id_station, ImageURL, link, banner_date, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        res.status(201).json({ id: results.insertId, ImageURL, link, banner_date });
    });
});

// Ruta para eliminar un banner
router.delete('/banners/:id', (req, res) => {
    const id_banner = req.params.id;

    functions.deleteBanner(id_banner, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el banner', details: err.message });
        }
        res.status(200).json({ message: 'Banner eliminado correctamente', results });
    });
});

//RUTA PARA ACTUALIZAR BANNER

router.post('/banners/update/', upload.fields([
    { name: 'ImageURL', maxCount: 1 },
]), async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { id, id_station, link, banner_date } = req.body;
        if (!id || !id_station || !link || !banner_date) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }


        // Manejo del archivo de imagen
        let ImageURL = req.files['ImageURL'] ? req.files['ImageURL'][0].path : null;
        if (ImageURL) {
            ImageURL = ImageURL.replace(/\\/g, '/');
        }

        functions.getBannerById(id, (err, currentBanner) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to retrieve current station data', details: err });
            }
            
            if (!ImageURL) {
                ImageURL = currentBanner.ImageURL;
            }

            // Si no se proporciona una nueva imagen, se mantendrá la URL antigua en la base de datos
            // Aquí necesitas manejar la actualización en la base de datos directamente
            functions.updateBanner(id, id_station, ImageURL, link, banner_date, (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, error: 'Database query failed', details: err });
                }

                res.status(201).json({
                    success: true,
                    id,
                    id_station,
                    ImageURL,
                    link,
                    banner_date
                });
            });

            
        });
    } catch (error) {
        // Mostrar detalles del error para depuración
        console.error('Unexpected error:', error);
        res.status(500).json({ success: false, error: 'Unexpected error', details: error.message });
    }
});



//----------------------------------------------------------------------------------------

// Ruta para obtener todos los canales
router.get('/channels', (req, res) => {
    functions.getChannel((err, channels) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving channel' });
        }
        return res.json(channels);
    });
});


// Ruta para agregar un nuevo canal
router.post('/channels', upload.fields([]),(req, res) => {
    console.log(req.body);
    const { channelName, channel_description, channel_number,channel_url } = req.body;
    // Llama a la función insertRadioStation con los datos del formulario
    functions.insertChannel(channelName, channel_description, channel_number, channel_url,(err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err }); 
        }
        res.status(201).json({ id: results.insertId, channelName, channel_description, channel_number, channel_url });
    });
});


//Ruta para actualizar un canal
router.post('/update-channels', upload.fields([]),(req,res) => {
    console.log(req.body);
    const { id_channel,channelName, channel_description, channel_number,channel_url } = req.body;
    functions.updateChannel(id_channel,channelName, channel_description, channel_number, channel_url,(err,results) =>{
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        res.status(200).json({ id_channel, channelName, channel_description, channel_number, channel_url });     
    });
    

});

//Ruta para eliminar un canal
router.delete('/channels/:id', (req,res) => {
const id_Channel =req.params.id;
    functions.deleteChannel(id_Channel, (err,results)=>{
            if (err){
                return res.status(500).json({ error: 'Error deleting channel', details: err });
            }
        res.status(200).json({message: 'Channel deleted successfully', results});
    });
});

// Ruta para insertar programa en channel
router.post('/programs', upload.fields([]),(req, res) =>{
    console.log(req.body);
    const { ProgramTitle,Description,id_channel } = req.body;   
        functions.insertProgramChannel(ProgramTitle,Description,id_channel,(err,results)=>{
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err }); 
            }
            res.status(201).json({ id: results.insertId, ProgramTitle, Description, id_channel});    
            
        });
});

// Ruta para insertar programa en estacion
router.post('/programs-station', upload.fields([]),(req, res) =>{
    console.log(req.body);
    const { ProgramTitle,Description,id_station } = req.body;   
        functions.insertProgramStation(ProgramTitle,Description,id_station,(err,results)=>{
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err }); 
            }
            res.status(201).json({ id: results.insertId, ProgramTitle, Description, id_station});    
            
        });
});





// Ruta para obtener programas por medio del canal ingresado
router.get('/programs-channel/:id', (req, res) => {
    console.log(req.body);
    const id_channel=req.params.id;
    functions.getChannelPrograms(id_channel,(err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving program' });
        }

        res.status(201).json(results);
    });
});

// Ruta para actualizar programas canales
router.post('/update-programs',upload.fields([]),(req,res) => {
    console.log(req.body);
        const {id_program, ProgramTitle,Description,id_channel} = req.body;
            functions.updateProgramChannel(id_program, ProgramTitle,Description,id_channel,(err,program)=>{

                if (err){
                    return res.status(500).json({error:'Database query field', details: err});
                }
                res.status(200).json({ id_program,ProgramTitle,Description,id_channel});

    });
});

// Ruta para actualizar programas estaciones
router.post('/update-programs-stations',upload.fields([]),(req,res) => {
    console.log(req.body);
        const {id_program, ProgramTitle,Description,id_station} = req.body;
            functions.updateProgramStation(id_program, ProgramTitle,Description,id_station,(err,program)=>{

                if (err){
                    return res.status(500).json({error:'Database query field', details: err});
                }
                res.status(200).json({ id_program,ProgramTitle,Description,id_station});

    });
});



// Ruta para eliminar programs
router.delete('/programs/:id', (req,res) => {
    const id_program =req.params.id;
        functions.deleteProgram(id_program, (err,results)=>{
                if (err){
                    return res.status(500).json({ error: 'Error deleting program', details: err });
                }
            res.status(200).json({message: 'Program deleted successfully', results});
        });
    });   
// ---------------------------------------------------------------------------------------------------------


    // Ruta para ingresar horario
    router.post('/day-schedule', upload.fields([]),(req, res) =>{
        console.log(req.body);
        const { Day,StartTime,EndTime,id_program } = req.body;   
            functions.InsertDaySchedule(Day,StartTime,EndTime,id_program,(err,results)=>{
                if (err) {
                    return res.status(500).json({ error: 'Database query failed', details: err }); 
                 }
                res.status(201).json({Day, StartTime,EndTime,id_program});    
            
            }); 
        });

 
    
    // Ruta para eliminar horario y su relacion
    router.delete('/delete-PDS/:id',(req,res) =>{
        const id_daySchedule = req.params.id;
        functions.DeletePDS(id_daySchedule,(err,results)=>{
            if (err){
                return res.status(500).json({error: 'Error eliminando horario', details: err});
            }     
            res.status(200).json({messege: 'Schedule deleted',results});

        });
    });

    // Ruta para obtener los programas y horarios de un canal --------------------------------------------------
    router.get('/channel-programs/:id',(req,res)=>{
         console.log(req.body);
            const id_Channel = req.params.id;
            functions.getChannelPrograms(id_Channel,(err,results)=>{
            if(err){
             return res.status(500).json({error:'Database query failed',details:err});
            }
             res.status(201).json(results);

            });
        });

    // Ruta para obtener los horarios de un programa
        router.get('/program-schedules/:id',(req,res)=>{
            console.log(req.body);
            const id_program= req.params.id;
            functions.getProgramSchedule(id_program,(err,results)=>{
                if(err){
                    return res.status(500).json({error: 'Database query failed',details:err});
                }
                res.status(201).json(results);                      
            });
        });


    // Ruta para actualizar los horarios de un programa
        router.post('/update-schedule',upload.fields([]),(req,res)=>{
            console.log(req.body);
            const{id_dayschedule,Day,StartTime,EndTime}= req.body;
            functions.updateDaySchedule(id_dayschedule,Day,StartTime,EndTime,(err,results)=>{
                if(err){
                    return res.status(500).json({error:'Database query failed',details:err});
                }
                res.status(201).json(results);

            });
        });

        router.get('/get-all-chanel-info', (req, res) => {
            functions.getChannelsWithProgramsAndSchedules((err, program) => {
                if (err) {
                    return res.status(500).json({ error: 'Error retrieving program' });
                }
                return res.json(program);
            });
        });
    
        router.get('/get-all-station-info', (req, res) => {
            functions.GetStationsWithProgramsAndSchedules((err, program) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.json(program);
            });
        });

        router.get('/programs-stations/:id', (req, res) => {
            console.log(req.body);
            const id_station = req.params.id;
            functions.GetStationPrograms(id_station,(err,results)=>{
            if(err){
             return res.status(500).json({error:'Database query failed',details:err});
            }
             res.status(201).json(results);

            });
        });


        
module.exports = router;
