import mongoose from 'mongoose';

//los tres puntitos representan un operador rest, que significa que la funcion puede definir muchos parametros, y estos se agrupan en un array llamado paramNames. Luego se itera sobre este array para validar cada parametro.
export const validateObjectId = (...paramNames) => (req, res, next) => {
    for (const paramName of paramNames) {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) { //se pone entre corchetes porque se quiere acceder a la propiedad del objeto req.params que tiene el nombre que se encuentra en la variable paramName
            return res.status(400).json({ message: `${paramName} inválido` });
        }
    }
    next();
};
