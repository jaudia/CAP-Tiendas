const cds = require('@sap/cds');

const { Productos } = cds.entities;


module.exports = cds.service.impl(async (srv) => {

    srv.on('actualizarPrecios', async (req, res) => {

        const datos = req.data;

        let respuesta = {
            correctos: [],
            erroneos: []
        };



        console.log('pasando por actualizar precios');

        console.log(datos);

        datos.conjuntoProductos.forEach(async element => {

            try {
                await cds.run(UPDATE(Productos)
                    .set({ precio_ID: element.precio_ID })
                    .where({ ID: element.ID }));

                respuesta.correctos.push(Productos.ID);

            } catch (error) {
                console.log('Se produjo un error al actualizar:');
                console.log(error);
                respuesta.erroneos.push(Productos.ID);
            }


        });

        console.log('---------------');
        console.log(res);
        console.log('---------------');
        console.log(req.reply);
        // res.send(respuesta);
    });


});