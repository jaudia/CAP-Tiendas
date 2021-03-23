using {misTiendas as my} from '../db/schema';

service AdminService @(_requires : 'authenticated-user') {
    entity Tiendas               as projection on my.Tiendas;
    entity Duenios               as projection on my.Duenios;
    entity Productos             as projection on my.Productos;
    entity Precios               as projection on my.Precios;
    entity Marcas                as projection on my.Marcas;
    entity Tipos                 as projection on my.Tipos;
    entity Subtipos              as projection on my.Subtipos;
    entity Tiendas_duenios       as projection on my.Tiendas_duenios;
    entity Tiendas_productos     as projection on my.Tiendas_productos;

    entity verProductos          as
        select
            nombre,
            subTipo.Tipo.nombreTipo,
            subTipo.nombreSubTipo,
            marca.nombreMarca
        from Productos;


    entity verProductosPorPrecio as
        select
            nombre,
            precio.price as precio
        from Productos
        order by
            precio;

    action actualizarPrecios(conjuntoProductos : array of Productos) returns String;
// action setTiendas() returns String;

//  function actualizarPrecios (parametro:Integer) returns String;


}
