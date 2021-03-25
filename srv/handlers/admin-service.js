const cds = require('@sap/cds');

const { Productos, Duenios, Tiendas_duenios } = cds.entities;


const getProducto = (idProd) => {

    return new Promise(async (resolve, reject) => {

        await cds.run(SELECT.one(Productos).where({ ID: idProd }))
            .then(re => {
                if (!!re)
                    resolve(re)
                else
                    reject('No se encontraron datos')
            });
    });
}

const setearStock = (prod, datos) => {

    return new Promise(async (resolve, reject) => {

        let cantidadNueva = prod.cantidad;

        if (datos.retira)
            cantidadNueva -= datos.cantidad;
        else
            cantidadNueva += datos.cantidad;

        try {
            console.log(`la cantidad nueva es ${cantidadNueva}`);

            await cds.run(UPDATE(Productos)
                .set({ cantidad: cantidadNueva })
                .where({ ID: datos.productoID }));

            resolve('datos actualizados correctamente');

        } catch (error) {
            console.log(err);
            reject(error);
        }
    })
};

module.exports = cds.service.impl((srv) => {

    srv.on('actualizarPrecios', async (req) => {

        const datos = req.data;

        let respuesta = {
            correctos: [],
            erroneos: []
        };

        await new Promise((resolve) => {

            datos.conjuntoProductos.forEach(element => {

                try {
                    cds.run(UPDATE(Productos)
                        .set({ precio_ID: element.precio_ID })
                        .where({ ID: element.ID }));


                    respuesta.correctos.push({
                        productoID: element.ID,
                        precioID: element.precio_ID
                    });

                } catch (error) {
                    console.log('Se produjo un error al actualizar:');
                    console.log(error);

                    respuesta.erroneos.push({
                        productoID: element.ID,
                        precioID: element.precio_ID
                    });
                }


            });

            resolve(respuesta);

        })
            .then(resultado => {
                req.reply(JSON.stringify(resultado));
            });

    });

    srv.on('setStock', async (req) => {

        const datos = req.data;

        await getProducto(datos.productoID)
            .then(resultado => {
                return setearStock(resultado, datos)
            })
            .then(resultado => {
                console.log(resultado);
                req.reply(resultado)
            })
            .catch(err => {
                req.reject(err);
            });
    });

    // PENDIENTE punto 2: agregar tiendas cuando se crea dueño por url.

    // srv.after('CREATE', 'Duenios', (dueniosCreados, req) => {
    //     const datos = req.data;

    //     console.log("pasando por after");
    //     console.log(req);
    // });

    // srv.after('CREATE', 'Duenios', (dueniosCreados, req) => {

    // console.log('pasando por after');
    // console.log(dueniosCreados);
    // console.log(req.data.tienda);

    // new Promise((resolve) => {
    // cds.ql(INSERT.into(Tiendas_duenios).columns(
    //     'duenio_ID', 'tienda_ID'
    // ).values(
    //     201, 'Wuthering Heights', 101, 12
    // ));


    // cds.run(INSERT(Tiendas_duenios)
    // .values({ duenio_ID: element.precio_ID }));
    // })
    //     .then(resultado => {
    //         req.reply(JSON.stringify(resultado));
    //     });


    // });

    // srv.on('CREATE', 'Duenios', (req) => {

    //     const datos = req.data;

    //     new Promise((resolve) => {

    //         console.log('pasando por insert');
    //         console.log(datos.nombre);

    //         // const cqnInsert = {
    //         //     INSERT: {
    //         //         into: { ref: [Duenios] },
    //         //         columns: [Duenios.nombre],
    //         //         values: [datos.nombre]
    //         //     }
    //         // };

    //         cds.run(INSERT.into(Duenios)
    //             .entries({ nombre: datos.nombre }));

    //         resolve('ok');



    //         // cds.run(INSERT(Tiendas_duenios)
    //         // .values({ duenio_ID: element.precio_ID }));
    //     })
    //         .then(resultado => {
    //             req.reply(resultado);
    //         });


    // });


});