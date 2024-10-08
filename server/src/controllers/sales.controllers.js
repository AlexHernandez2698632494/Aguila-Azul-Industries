import { pool } from '../db.js';

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ordenes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes', error });
    }
};

// Obtener una orden por ID
export const getOrdenById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Ordenes WHERE OrdenID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error });
    }
};

// Crear una nueva orden
export const createOrden = async (req, res) => {
    const { UsuarioID, Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoEntregaDias, DireccionEnvio, NombreRecibe, FechaEntrega, EstadoEnvio } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Ordenes (UsuarioID, Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoEntregaDias, DireccionEnvio, NombreRecibe, FechaEntrega, EstadoEnvio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [UsuarioID, Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoEntregaDias, DireccionEnvio, NombreRecibe, FechaEntrega, EstadoEnvio]);
        res.json({ message: 'Orden creada con éxito', OrdenID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden', error });
    }
};

// Actualizar una orden por ID
export const updateOrden = async (req, res) => {
    const { id } = req.params;
    const { Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoEntregaDias, DireccionEnvio, NombreRecibe, FechaEntrega, EstadoEnvio } = req.body;
    try {
        const [result] = await pool.query('UPDATE Ordenes SET Departamento = ?, Municipio = ?, Descuento = ?, CostoEnvio = ?, Subtotal = ?, Total = ?, TiempoEntregaDias = ?, DireccionEnvio = ?, NombreRecibe = ?, FechaEntrega = ?, EstadoEnvio = ? WHERE OrdenID = ?', [Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoEntregaDias, DireccionEnvio, NombreRecibe, FechaEntrega, EstadoEnvio, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json({ message: 'Orden actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la orden', error });
    }
};

// Eliminar una orden por ID
export const deleteOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Ordenes WHERE OrdenID = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json({ message: 'Orden eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la orden', error });
    }
};

// Obtener detalles de una orden
export const getDetallesOrdenes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM DetallesOrdenes WHERE OrdenID = ?', [req.params.ordenId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles de la orden', error });
    }
};

// Crear un nuevo detalle de orden
export const createDetalleOrden = async (req, res) => {
    const { OrdenID, ProductoID, Cantidad, Precio } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO DetallesOrdenes (OrdenID, ProductoID, Cantidad, Precio) VALUES (?, ?, ?, ?)', [OrdenID, ProductoID, Cantidad, Precio]);
        res.json({ message: 'Detalle de orden creado con éxito', DetalleID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el detalle de orden', error });
    }
};

// Crear detalles de una orden
export const createDetallesOrden = async (req, res) => {
    const { OrdenID, ProductId, Cantidad, Precio, Subtotal } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO DetallesOrdenes (OrdenID, ProductId, Cantidad, Precio, Subtotal) VALUES (?, ?, ?, ?, ?)',
            [OrdenID, ProductId, Cantidad, Precio, Subtotal]
        );
        res.json({ message: 'Detalles de orden creados con éxito', DetalleID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear los detalles de la orden', error });
    }
};


// Actualizar un detalle de orden por ID
export const updateDetalleOrden = async (req, res) => {
    const { id } = req.params;
    const { Cantidad, Precio } = req.body;
    try {
        const [result] = await pool.query('UPDATE DetallesOrdenes SET Cantidad = ?, Precio = ? WHERE DetalleID = ?', [Cantidad, Precio, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de orden no encontrado' });
        }
        res.json({ message: 'Detalle de orden actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el detalle de orden', error });
    }
};

// Eliminar un detalle de orden por ID
export const deleteDetalleOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM DetallesOrdenes WHERE DetalleID = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de orden no encontrado' });
        }
        res.json({ message: 'Detalle de orden eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el detalle de orden', error });
    }
};

// Obtener las órdenes de un usuario por nombre de usuario
export const getOrdenesByUsuario = async (req, res) => {
    const { usuario } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT Ordenes.* 
             FROM Ordenes 
             JOIN Usuarios ON Ordenes.UsuarioID = Usuarios.UsuarioID 
             WHERE Usuarios.usuario = ?`, 
            [usuario]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para el usuario especificado' });
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes del usuario', error });
    }
};
