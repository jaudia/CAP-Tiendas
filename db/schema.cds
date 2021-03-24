using {cuid} from '@sap/cds/common';

// namespace PrimerEjercicio;
namespace misTiendas;


entity Tiendas : cuid {
    name      : String(111);
    duenios   : Association to many Tiendas_duenios
                    on duenios.tienda = $self;
    productos : Association to many Tiendas_productos
                    on productos.tienda = $self;
}

entity Duenios : cuid {
    nombre  : String(111);
    tiendas : Association to many Tiendas_duenios
                  on tiendas.duenio = $self;
}


entity Productos : cuid {
    nombre  : String(100);
    tiendas : Association to many Tiendas_productos
                  on tiendas.producto = $self;
    precio  : Association to one Precios;
    marca   : Association to one Marcas;
    subTipo : Association to one Subtipos;
    cantidad: Integer default 0
};


entity Precios : cuid {
    price : Integer;
}

entity Tipos : cuid {
    nombreTipo : String;
}

entity Subtipos : cuid {    
        nombreSubTipo : String;
        Tipo          : Association to one Tipos;

}

entity Marcas : cuid {
    nombreMarca : String;
}

entity Tiendas_duenios : cuid {
    tienda : Association to Tiendas;
    duenio : Association to Duenios;
}

entity Tiendas_productos : cuid {
    tienda   : Association to Tiendas;
    producto : Association to Productos;
}
