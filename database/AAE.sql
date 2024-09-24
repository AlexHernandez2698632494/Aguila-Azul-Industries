-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS AAE;
USE AAE;

-- Crear la tabla Usuarios si no existe
CREATE TABLE IF NOT EXISTS Usuarios (
    UsuarioID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    CorreoElectronico VARCHAR(100) UNIQUE NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    NivelUsuario INT NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (NivelUsuario IN (0, 1, 2)) -- Asegura que solo se permitan los valores 0, 1 y 2
);

-- Crear la tabla Categorías si no existe
CREATE TABLE IF NOT EXISTS Categorias (
    CategoriaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Imagen VARCHAR(255) -- Almacena la URL o el nombre del archivo de la imagen
);


-- Crear la tabla Proveedores si no existe
CREATE TABLE IF NOT EXISTS Proveedores (
    ProveedorID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Teléfono VARCHAR(20),
    Dirección VARCHAR(255)
);

-- Crear la tabla Productos si no existe
CREATE TABLE IF NOT EXISTS Productos (
    ProductoID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    Imagen VARCHAR(255) ,
    CategoriaID INT,
    ProveedorID INT,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
);

-- Crear la tabla Inventario si no existe
CREATE TABLE IF NOT EXISTS Inventario (
    InventarioID INT PRIMARY KEY AUTO_INCREMENT,
    ProductoID INT,
    CantidadComprada INT DEFAULT 0,
    CantidadVendida INT DEFAULT 0,
    CantidadDisponible INT GENERATED ALWAYS AS (CantidadComprada - CantidadVendida) STORED,
    FechaUltimaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- Crear la tabla Ventas si no existe
CREATE TABLE IF NOT EXISTS Ventas (
    VentaID INT PRIMARY KEY AUTO_INCREMENT,
    ClienteID INT,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ClienteID) REFERENCES Usuarios(UsuarioID)
);

-- Crear la tabla DetallesVenta si no existe
CREATE TABLE IF NOT EXISTS DetallesVenta (
    DetalleVentaID INT PRIMARY KEY AUTO_INCREMENT,
    VentaID INT,
    ProductoID INT,
    Cantidad INT NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- Crear la tabla Envíos si no existe
CREATE TABLE IF NOT EXISTS Envíos (
    EnvíoID INT PRIMARY KEY AUTO_INCREMENT,
    VentaID INT,
    Dirección VARCHAR(255) NOT NULL,
    FechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado ENUM('Pendiente', 'En tránsito', 'Entregado', 'Fallido') DEFAULT 'Pendiente',
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID)
);

-- Inserciones para la tabla Usuarios
INSERT IGNORE INTO Usuarios (Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario) VALUES
('Carlos Ruiz', 'carlos@ejemplo.com', 'carlos123', 'contraseña1', 1),
('María López', 'maria@ejemplo.com', 'maria456', 'contraseña2', 2),
('Andrés Pérez', 'andres@ejemplo.com', 'andres789', 'contraseña3', 0),
('Sofía Jiménez', 'sofia@ejemplo.com', 'sofia101', 'contraseña4', 1),
('Elena Torres', 'elena@ejemplo.com', 'elena202', 'contraseña5', 2),
('Juan Gómez', 'juan@ejemplo.com', 'juan303', 'contraseña6', 0);

-- Inserciones para la tabla Categorías
INSERT IGNORE INTO Categorias (Nombre, Imagen) VALUES 
('Tecnología de recuperación extraterrestre', 'ruta/a/imagen_tecnologia_recuperacion.jpg'),
('Tecnología de creación extraterrestre', 'ruta/a/imagen_tecnologia_creacion.jpg'),
('Biotecnología', 'ruta/a/imagen_biotecnologia.jpg'),
('Alimentos', 'ruta/a/imagen_alimentos.jpg'),
('Construcción naval', 'ruta/a/imagen_construccion_naval.jpg'),
('Aeroespacial', 'ruta/a/imagen_aeroespacial.jpg'),
('Productos químicos', 'ruta/a/imagen_productos_quimicos.jpg'),
('Servicios médicos', 'ruta/a/imagen_servicios_medicos.jpg');

-- Inserciones para la tabla Proveedores
INSERT IGNORE INTO Proveedores (Nombre, Contacto, Teléfono, Dirección) VALUES
('Galactic Tech', 'Juan Pérez', '555-0123', 'Av. Espacial 123, Ciudad Galáctica'),
('Astro Industries', 'María López', '555-4567', 'Calle de los Astros 45, Estación Orbital'),
('Cosmic Supplies', 'Andrés Martínez', '555-7890', 'Paseo de la Nebulosa 87, Sector 7'),
('Interstellar Solutions', 'Laura González', '555-2345', 'Ruta de los Cometas 12, Base Lunar'),
('Stellar Engineering', 'Pedro Ramírez', '555-6789', 'Plaza Galáctica 8, Colonia Estelar'),
('Space Innovations', 'Elena Torres', '555-3456', 'Calle de los Planetarios 56, Ciudad Espacial'),
('Nebula Products', 'Carlos Ríos', '555-9876', 'Bulevar de las Estrellas 34, Sector 5'),
('Galactic Logistics', 'Sofía Jiménez', '555-6543', 'Avenida de los Planetas 78, Ciudad Espacial');

-- Inserciones para la tabla Productos
INSERT IGNORE INTO Productos (Nombre, Descripcion, Precio, Imagen, CategoriaID, ProveedorID) VALUES 
-- Tecnología de recuperación extraterrestre
('Escáner Cuántico', 'Escáner para detectar estructuras extraterrestres.', 299.99, 'ruta/a/escaneo.jpg', 1, 1),
('Teletransportador', 'Tecnología avanzada de teletransportación.', 1500.00, 'ruta/a/teletransportador.jpg', 1, 2),
('Comunicador Galáctico', 'Dispositivo de comunicación entre galaxias.', 750.00, 'ruta/a/comunicador.jpg', 1, 3),
('Traje de Exploración', 'Traje para entornos extremos.', 1200.00, 'ruta/a/traje.jpg', 1, 4),
('Generador Cuántico', 'Generador de energía sostenible.', 5000.00, 'ruta/a/generador.jpg', 1, 5),
('Nave de Exploración', 'Nave para exploraciones interplanetarias.', 25000.00, 'ruta/a/nave.jpg', 1, 6),

-- Tecnología de creación extraterrestre
('Creador de Materia', 'Máquina que crea materia a partir de energía.', 20000.00, 'ruta/a/creador.jpg', 2, 1),
('Impresora 3D Espacial', 'Impresora 3D intergaláctica.', 8000.00, 'ruta/a/impresora.jpg', 2, 2),
('Replicador', 'Dispositivo que replica objetos.', 10000.00, 'ruta/a/replicador.jpg', 2, 3),
('Nanoensamblador', 'Ensamblador de nanoestructuras.', 3000.00, 'ruta/a/nanoensamblador.jpg', 2, 4),
('Campo de Fuerza', 'Generador de campos protectores.', 15000.00, 'ruta/a/campo.jpg', 2, 5),
('Laboratorio de Biociencia', 'Laboratorio para biociencias avanzadas.', 18000.00, 'ruta/a/laboratorio.jpg', 2, 6),

-- Biotecnología
('Suplemento Energético', 'Suplemento para mejorar capacidades.', 50.00, 'ruta/a/suplemento.jpg', 3, 1),
('Kit de Diagnóstico', 'Kit para diagnósticos rápidos.', 120.00, 'ruta/a/kit.jpg', 3, 2),
('Terapia Genética', 'Tratamiento con terapia genética.', 2000.00, 'ruta/a/terapia.jpg', 3, 3),
('Bioimpresora', 'Impresora para crear tejidos biológicos.', 15000.00, 'ruta/a/bioimpresora.jpg', 3, 4),
('Agente Curativo', 'Sustancia que acelera la curación.', 300.00, 'ruta/a/agente.jpg', 3, 5),
('Vacuna Personalizada', 'Vacuna adaptada a necesidades individuales.', 250.00, 'ruta/a/vacuna.jpg', 3, 6),

-- Alimentos
('Alimento Energético', 'Alimento para viajes prolongados.', 10.00, 'ruta/a/alimento.jpg', 4, 1),
('Snack Nutritivo', 'Snack de origen extraterrestre.', 5.00, 'ruta/a/snack.jpg', 4, 2),
('Bebida Revitalizante', 'Bebida energizante.', 15.00, 'ruta/a/bebida.jpg', 4, 3),
('Comida Deshidratada', 'Comida para exploradores.', 20.00, 'ruta/a/comida.jpg', 4, 4),
('Pastillas Nutricionales', 'Alimento en forma de pastillas.', 25.00, 'ruta/a/pastillas.jpg', 4, 5),
('Sustituto Alimenticio', 'Sustituto alimenticio de alta calidad.', 30.00, 'ruta/a/sustituto.jpg', 4, 6),

-- Construcción naval
('Material de Construcción', 'Material para construir naves.', 2000.00, 'ruta/a/material.jpg', 5, 1),
('Propulsor', 'Sistema de propulsión para naves.', 15000.00, 'ruta/a/propulsor.jpg', 5, 2),
('Panel Solar Avanzado', 'Paneles solares para naves espaciales.', 12000.00, 'ruta/a/panel_solar.jpg', 5, 3),
('Soporte Estructural', 'Estructura para naves grandes.', 5000.00, 'ruta/a/soporte.jpg', 5, 4),
('Navegación Estelar', 'Sistema de navegación para el espacio.', 10000.00, 'ruta/a/navegacion.jpg', 5, 5),
('Cámara de Vacío', 'Cámara para condiciones de vacío.', 8000.00, 'ruta/a/camara_vacio.jpg', 5, 6),

-- Aeroespacial
('Avión de Combate', 'Avión de combate moderno.', 100000.00, 'ruta/a/avion.jpg', 6, 1),
('Sonda Planetaria', 'Sonda para exploración planetaria.', 50000.00, 'ruta/a/sonda.jpg', 6, 2),
('Drone de Carga', 'Drone para transportar cargas.', 25000.00, 'ruta/a/drone.jpg', 6, 3),
('Satélite de Comunicación', 'Satélite para comunicaciones.', 75000.00, 'ruta/a/satelite.jpg', 6, 4),
('Cohete de Lanzamiento', 'Cohete para lanzar cargas al espacio.', 300000.00, 'ruta/a/cohete.jpg', 6, 5),
('Reactor de Propulsión', 'Reactor para propulsión espacial.', 200000.00, 'ruta/a/reactor.jpg', 6, 6),

-- Productos químicos
('Sustancia Química', 'Química para experimentos avanzados.', 500.00, 'ruta/a/sustancia_quimica.jpg', 7, 1),
('Reactivo Industrial', 'Reactivo para procesos industriales.', 200.00, 'ruta/a/reactivo.jpg', 7, 2),
('Catalizador', 'Catalizador para reacciones químicas.', 750.00, 'ruta/a/catalizador.jpg', 7, 3),
('Solvente Específico', 'Solvente para aplicaciones específicas.', 300.00, 'ruta/a/solvente.jpg', 7, 4),
('Compuesto Sintético', 'Compuesto creado en laboratorio.', 400.00, 'ruta/a/compuesto.jpg', 7, 5),
('Biocombustible', 'Combustible alternativo para naves.', 600.00, 'ruta/a/biocombustible.jpg', 7, 6),

-- Servicios médicos
('Tratamiento Alienígena', 'Tratamiento para enfermedades alienígenas.', 1000.00, 'ruta/a/tratamiento.jpg', 8, 1),
('Vacuna Galáctica', 'Vacuna contra virus galácticos.', 300.00, 'ruta/a/vacuna_galactica.jpg', 8, 2),
('Kit de Emergencia', 'Kit de primeros auxilios espacial.', 50.00, 'ruta/a/kit_emergencia.jpg', 8, 3),
('Equipos de Diagnóstico', 'Equipos para diagnósticos médicos.', 1500.00, 'ruta/a/equipos_diagnostico.jpg', 8, 4),
('Terapia Regenerativa', 'Terapia para regeneración celular.', 5000.00, 'ruta/a/terapia_regenerativa.jpg', 8, 5),
('Consulta Médica Espacial', 'Consulta médica a distancia.', 200.00, 'ruta/a/consulta_medica.jpg', 8, 6);

-- Inserciones para la tabla Inventario
INSERT IGNORE INTO Inventario (ProductoID, CantidadComprada, CantidadVendida) VALUES
(1, 100, 30),  -- Escáner Cuántico
(2, 50, 10),   -- Teletransportador
(3, 75, 25),   -- Comunicador Galáctico
(4, 60, 15),   -- Traje de Exploración
(5, 20, 5),    -- Generador Cuántico
(6, 10, 2),    -- Nave de Exploración
(7, 15, 3),    -- Creador de Materia
(8, 25, 7),    -- Impresora 3D Espacial
(9, 40, 12),   -- Replicador
(10, 30, 6),   -- Nanoensamblador
(11, 50, 20),  -- Suplemento Energético
(12, 80, 30),  -- Kit de Diagnóstico
(13, 20, 4),   -- Terapia Genética
(14, 5, 1),    -- Bioimpresora
(15, 35, 10),  -- Alimento Energético
(16, 100, 50), -- Snack Nutritivo
(17, 45, 15),  -- Material de Construcción
(18, 15, 2),   -- Propulsor
(19, 10, 1),   -- Avión de Combate
(20, 60, 20);  -- Sustancia Química

-- Inserciones para la tabla Ventas
INSERT IGNORE INTO Ventas (ClienteID, Total) VALUES
(1, 3500.00),  -- Venta de varios productos
(2, 1500.00),  -- Compra de un Teletransportador
(3, 250.00),   -- Compra de un Kit de Emergencia
(4, 2000.00),  -- Compra de un Tratamiento Alienígena
(5, 500.00),   -- Compra de productos químicos
(6, 100.00);   -- Consulta Médica

-- Inserciones para la tabla DetallesVenta
INSERT IGNORE INTO DetallesVenta (VentaID, ProductoID, Cantidad, Precio) VALUES
(1, 1, 1, 299.99),  -- Escáner Cuántico
(1, 5, 1, 5000.00), -- Generador Cuántico
(2, 2, 1, 1500.00), -- Teletransportador
(3, 4, 1, 50.00),   -- Kit de Emergencia
(4, 13, 1, 2000.00),-- Terapia Genética
(5, 17, 1, 500.00), -- Sustancia Química
(6, 1, 2, 299.99);  -- Consulta Médica

-- Inserciones para la tabla Envíos
INSERT IGNORE INTO Envíos (VentaID, Dirección) VALUES
(1, 'Calle Principal 123, Ciudad Galáctica'),
(2, 'Av. Secundaria 456, Ciudad Espacial'),
(3, 'Ruta Estelar 789, Base Lunar'),
(4, 'Bulevar de la Salud 101, Sector 3'),
(5, 'Calle de la Química 202, Ciudad Química'),
(6, 'Paseo de los Médicos 303, Hospital Espacial');
