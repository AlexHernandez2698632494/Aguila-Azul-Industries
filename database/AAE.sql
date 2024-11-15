-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS AAE;
USE AAE;

-- Crear la tabla Usuarios si no existe
CREATE TABLE IF NOT EXISTS Usuarios (
    UsuarioID INT PRIMARY KEY AUTO_INCREMENT,
    UsuarioIDGoogle INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    CorreoElectronico VARCHAR(100) UNIQUE NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    Contraseña VARCHAR(255),
    NivelUsuario INT NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (NivelUsuario IN (0, 1, 2)),
    CHECK (UsuarioIDGoogle IN (0,1))
);

-- Crear la tabla Categorías si no existe
CREATE TABLE IF NOT EXISTS Categorias (
    CategoriaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Imagen VARCHAR(255), 
    estadoEliminacion INT NOT NULL DEFAULT 1
);

-- Crear la tabla Proveedores si no existe
CREATE TABLE IF NOT EXISTS Proveedores (
    ProveedorID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Teléfono VARCHAR(20),
    Dirección VARCHAR(255),
    estadoEliminacion INT NOT NULL DEFAULT 1
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
    estadoEliminacion INT NOT NULL DEFAULT 1,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
);

-- Crear la tabla Especificaciones si no existe
CREATE TABLE IF NOT EXISTS Especificaciones (
    EspecificacionID INT PRIMARY KEY AUTO_INCREMENT,
    ProductoID INT,
    NombreEspecificacion VARCHAR(100) NOT NULL,
    ValorEspecificacion VARCHAR(255) NOT NULL,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
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
CREATE TABLE Ventas (
    VentaID INT PRIMARY KEY AUTO_INCREMENT,
    UsuarioID INT,
    Departamento VARCHAR(100),
    Municipio VARCHAR(100),
    Descuento DECIMAL(10, 2),
    CostoEnvio DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    Total DECIMAL(10, 2),
    TiempoDiasEntrega INT,
    QuienRecibe VARCHAR(100),
    DireccionEnvio TEXT,
    FechaVenta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaEnvio DATETIME GENERATED ALWAYS AS (FechaVenta + INTERVAL TiempoDiasEntrega DAY),
    EstadoEnvio ENUM('Pendiente', 'En tránsito', 'Entregado', 'Fallido') DEFAULT 'Pendiente',
    PRIMARY KEY (VentaID)
);

CREATE TABLE VentasProductos (
    VentaProductoID INT PRIMARY KEY AUTO_INCREMENT,
    VentaID INT,
    ProductoID INT,
    Cantidad INT,
    PrecioProducto DECIMAL(10, 2),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID)
);

-- Inserciones para la tabla Usuarios
INSERT INTO Usuarios (UsuarioIDGoogle, Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario) VALUES
(0, 'Alex hernandez', 'alexhernandez@example.com', 'alex.hernandez', '$2a$10$RMs4RcgK2h25pA989J5I5.wZ.o4zNuDlX4.5FBDHiLgsLpIXqvxpm', 0),
(0, 'Águila Azul', 'aguila.azul@example.com', 'aguila.azul', '$2a$10$RMs4RcgK2h25pA989J5I5.wZ.o4zNuDlX4.5FBDHiLgsLpIXqvxpm', 1);

-- Inserciones para la tabla Usuarios

-- Inserciones para la tabla Categorías
INSERT INTO Categorias (CategoriaID, Nombre, Imagen, estadoEliminacion) VALUES 
(1, 'Tecnología de recuperación extraterrestre', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/alienrecovery.webp?token=GHSAT0AAAAAACSGCQHOG6O5H5WATC6XZCFOZXPPPJA', 1),
(2, 'Tecnología de creación extraterrestre', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/extraterrestrialcreation.webp?token=GHSAT0AAAAAACSGCQHO34RFHDCWR3S7XOUKZXPPPPQ', 1),
(3, 'Biotecnología', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/biotecnology.webp?token=GHSAT0AAAAAACSGCQHP55EEO6BGC5BQPY4UZXPPPVQ', 1),
(4, 'Alimentos', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/food.webp?token=GHSAT0AAAAAACSGCQHOQJVRCV4EKLBDJGCKZXPPP4A', 1),
(5, 'Construcción naval', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/shipbuilding.webp?token=GHSAT0AAAAAACSGCQHOTE4ANECBMWLFSAXOZXPPQDA', 1),
(6, 'Aeroespacial', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/aerospace.webp?token=GHSAT0AAAAAACSGCQHPFTE2XTJWUBNQ2NFAZXPPM6A', 1),
(7, 'Productos químicos', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/chemical.webp?token=GHSAT0AAAAAACSGCQHPC3OGWGRHSTDMPSF6ZXPPQUA', 1),
(8, 'Servicios médicos', 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/medicsevices.webp?token=GHSAT0AAAAAACSGCQHOBGFGZBERKOTAZ3UEZXPR7PQ', 1);

-- Inserciones para la tabla Proveedores
INSERT IGNORE INTO Proveedores (Nombre, Contacto, Teléfono, Dirección,estadoEliminacion) VALUES
('Galactic Tech', 'Juan Pérez', '555-0123', 'Av. Espacial 123, Ciudad Galáctica',1),
('Astro Industries', 'María López', '555-4567', 'Calle de los Astros 45, Estación Orbital',1),
('Cosmic Supplies', 'Andrés Martínez', '555-7890', 'Paseo de la Nebulosa 87, Sector 7',1),
('Interstellar Solutions', 'Laura González', '555-2345', 'Ruta de los Cometas 12, Base Lunar',1),
('Stellar Engineering', 'Pedro Ramírez', '555-6789', 'Plaza Galáctica 8, Colonia Estelar',1),
('Space Innovations', 'Elena Torres', '555-3456', 'Calle de los Planetarios 56, Ciudad Espacial',1),
('Nebula Products', 'Carlos Ríos', '555-9876', 'Bulevar de las Estrellas 34, Sector 5',1),
('Galactic Logistics', 'Sofía Jiménez', '555-6543', 'Avenida de los Planetas 78, Ciudad Espacial',1);

-- Inserciones para la tabla Productos
INSERT INTO Productos (`Nombre`, `Descripcion`, `Precio`, `Imagen`, `CategoriaID`, `ProveedorID`, `estadoEliminacion`) VALUES 
('Escáner Cuántico', 'Escáner para detectar estructuras extraterrestres.', 299.99, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/cuanticscanner.jpeg?raw=true', 1, 1, 1),
('Teletransportador', 'Tecnología avanzada de teletransportación.', 1500.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/teletransport.jpg?raw=true', 1, 2, 1),
('Comunicador Galáctico', 'Dispositivo de comunicación entre galaxias.', 750.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/galacticcomunicator.jpeg?raw=true', 1, 3, 1),
('Traje de Exploración', 'Traje para entornos extremos.', 1200.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/exploring%20suit.jpeg?raw=true', 1, 4, 1),
('Generador Cuántico', 'Generador de energía sostenible.', 5000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/cuantic%20generator.jpeg?raw=true', 1, 5, 1),
('Nave de Exploración', 'Nave para exploraciones interplanetarias.', 25000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/spaceship.jpeg?raw=true', 1, 6, 1),
('Creador de Materia', 'Máquina que crea materia a partir de energía.', 20000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/material%20cuantic%20genenrator.jpeg?raw=true', 2, 1, 1),
('Impresora 3D Espacial', 'Impresora 3D intergaláctica.', 8000.00, 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/449169eecb893dab6bcbd6545ceee312e820c5a7/3d%20printer.jpeg', 2, 2, 1),
('Replicador', 'Dispositivo que replica objetos.', 10000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/replicator.jpeg?raw=true', 2, 3, 1),
('Nanoensamblador', 'Ensamblador de nanoestructuras.', 3000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/nanoassembler.jpeg?raw=true', 2, 4, 1),
('Campo de Fuerza', 'Generador de campos protectores.', 15000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/force%20field.jpeg?raw=true', 2, 5, 1),
('Laboratorio de Biociencia', 'Laboratorio para biociencias avanzadas.', 18000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/biosciend%20laboratory.jpeg?raw=true', 2, 6, 1),
('Suplemento Energético', 'Suplemento para mejorar capacidades.', 50.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/energy%20suplement.jpeg?raw=true', 3, 1, 1),
('Kit de Diagnóstico', 'Kit para diagnósticos rápidos.', 120.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/disgnostic%20kit.jpeg?raw=true', 3, 2, 1),
('Terapia Genética', 'Tratamiento con terapia genética.', 2000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/genetics%20therapy.jpeg?raw=true', 3, 3, 1),
('Bioimpresora', 'Impresora para crear tejidos biológicos.', 15000.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/bioprinter.jpeg?raw=true', 3, 4, 1),
('Agente Curativo', 'Sustancia que acelera la curación.', 300.00, 'https://github.com/AlexHernandez2698632494/pictures/blob/main/curative%20agent.jpeg?raw=true', 3, 5, 1),
('Vacuna Personalizada', 'Vacuna adaptada a necesidades individuales.', 250.00, 'https://raw.githubusercontent.com/AlexHernandez2698632494/pictures/refs/heads/main/vaccine.webp', 3, 6, 1),
('Alimento Energético', 'Alimento para viajes prolongados.', 10.00, 'ruta/a/alimento.jpg', 4, 1, 1),
('Snack Nutritivo', 'Snack de origen extraterrestre.', 5.00, 'ruta/a/snack.jpg', 4, 2, 1),
('Bebida Revitalizante', 'Bebida energizante.', 15.00, 'ruta/a/bebida.jpg', 4, 3, 1),
('Comida Deshidratada', 'Comida para exploradores.', 20.00, 'ruta/a/comida.jpg', 4, 4, 1),
('Pastillas Nutricionales', 'Alimento en forma de pastillas.', 25.00, 'ruta/a/pastillas.jpg', 4, 5, 1),
('Sustituto Alimenticio', 'Sustituto alimenticio de alta calidad.', 30.00, 'ruta/a/sustituto.jpg', 4, 6, 1),
('Material de Construcción', 'Material para construir naves.', 2000.00, 'ruta/a/material.jpg', 5, 1, 1),
('Propulsor', 'Sistema de propulsión para naves.', 15000.00, 'ruta/a/propulsor.jpg', 5, 2, 1),
('Panel Solar Avanzado', 'Paneles solares para naves espaciales.', 12000.00, 'ruta/a/panel_solar.jpg', 5, 3, 1),
('Soporte Estructural', 'Estructura para naves grandes.', 5000.00, 'ruta/a/soporte.jpg', 5, 4, 1),
('Navegación Estelar', 'Sistema de navegación para el espacio.', 10000.00, 'ruta/a/navegacion.jpg', 5, 5, 1),
('Cámara de Vacío', 'Cámara para condiciones de vacío.', 8000.00, 'ruta/a/camara_vacio.jpg', 5, 6, 1),
('Avión de Combate', 'Avión de combate moderno.', 100000.00, 'ruta/a/avion.jpg', 6, 1, 1),
('Sonda Planetaria', 'Sonda para exploración planetaria.', 50000.00, 'ruta/a/sonda.jpg', 6, 2, 1),
('Drone de Carga', 'Drone para transportar cargas.', 25000.00, 'ruta/a/drone.jpg', 6, 3, 1),
('Satélite de Comunicación', 'Satélite para comunicaciones.', 75000.00, 'ruta/a/satelite.jpg', 6, 4, 1),
('Cohete de Lanzamiento', 'Cohete para lanzar cargas al espacio.', 300000.00, 'ruta/a/cohete.jpg', 6, 5, 1),
('Reactor de Propulsión', 'Reactor para propulsión espacial.', 200000.00, 'ruta/a/reactor.jpg', 6, 6, 1),
('Sustancia Química', 'Química para experimentos avanzados.', 500.00, 'ruta/a/sustancia_quimica.jpg', 7, 1, 1),
('Reactivo Industrial', 'Reactivo para procesos industriales.', 200.00, 'ruta/a/reactivo.jpg', 7, 2, 1),
('Catalizador', 'Catalizador para reacciones químicas.', 750.00, 'ruta/a/catalizador.jpg', 7, 3, 1),
('Solvente Específico', 'Solvente para aplicaciones específicas.', 300.00, 'ruta/a/solvente.jpg', 7, 4, 1),
('Compuesto Sintético', 'Compuesto creado en laboratorio.', 400.00, 'ruta/a/compuesto.jpg', 7, 5, 1),
('Biocombustible', 'Combustible alternativo para naves.', 600.00, 'ruta/a/biocombustible.jpg', 7, 6, 1),
('Tratamiento Alienígena', 'Tratamiento especializado para alienígenas.', 5000.00, 'ruta/a/tratamiento.jpg', 8, 1, 1), 
('Escudo de Protección', 'Escudo para proteger de ataques.', 15000.00, 'ruta/a/escudo.jpg', 8, 2, 1), 
('Sistema de Seguridad', 'Sistema de seguridad avanzada.', 10000.00, 'ruta/a/sistema_seguridad.jpg', 8, 3, 1),
('Detector de Amenazas', 'Detector de amenazas potenciales.', 8000.00, 'ruta/a/detector.jpg', 8, 4, 1), 
('Red de Monitoreo', 'Red para monitorear condiciones.', 20000.00, 'ruta/a/red_monitoreo.jpg', 8, 5, 1), 
('Analizador de Riesgos', 'Analizador de riesgos y amenazas.', 12000.00, 'ruta/a/analizador.jpg', 8, 6, 1);

INSERT IGNORE INTO Especificaciones (ProductoID, NombreEspecificacion, ValorEspecificacion) VALUES 
-- Tecnología de recuperación extraterrestre
(1, 'Frecuencia de operación', '2.4 GHz'),
(1, 'Rango de detección', '50 km'),
(2, 'Tiempo de teletransportación', '2 segundos'),
(2, 'Capacidad máxima', '5 toneladas'),
(3, 'Rango de comunicación', '30,000 km'),
(3, 'Tipo de energía', 'Solar'),
(4, 'Material', 'Resistencia a temperaturas extremas'),
(4, 'Peso', '15 kg'),
(5, 'Eficiencia energética', '90%'),
(5, 'Tipo de energía', 'Cuántica'),
(6, 'Capacidad de carga', '100 personas'),
(6, 'Velocidad máxima', '25,000 km/h'),

-- Tecnología de creación extraterrestre
(7, 'Tipo de materia creada', 'Orgánica e inorgánica'),
(7, 'Tiempo de creación', '5 minutos por kg'),
(8, 'Resolución de impresión', '0.1 mm'),
(8, 'Materiales compatibles', 'Plástico, metal'),
(9, 'Tipo de objetos replicables', 'Sistemas mecánicos y electrónicos'),
(9, 'Tasa de replicación', '10 objetos por hora'),
(10, 'Precisión de ensamblaje', '99%'),
(10, 'Velocidad de operación', '1.5 m/s'),
(11, 'Rango de protección', '100 m²'),
(11, 'Tiempo de carga', '1 hora'),
(12, 'Equipamiento incluido', 'Microscopio, centrifugadora'),
(12, 'Capacidad máxima', '10 muestras'),

-- Biotecnología
(13, 'Tipo de suplemento', 'Energético y proteico'),
(13, 'Dosis recomendada', '2 cápsulas diarias'),
(14, 'Componentes', 'Electrodos, tiras reactivas'),
(14, 'Resultados en', '15 minutos'),
(15, 'Tipo de terapia', 'Génica'),
(15, 'Duración del tratamiento', '6 meses'),
(16, 'Tipo de tejido creado', 'Tejidos humanos y animales'),
(16, 'Tiempo de impresión', '3 horas por cm²'),
(17, 'Propósito', 'Curación de heridas'),
(17, 'Efecto', 'Rápido'),
(18, 'Tipo de vacuna', 'Personalizada'),
(18, 'Efectividad', '95%'),

-- Alimentos
(19, 'Calorías por porción', '250 kcal'),
(19, 'Duración de conservación', '2 años'),
(20, 'Ingredientes', 'Frutos secos, proteínas'),
(20, 'Sabor', 'Chocolate'),
(21, 'Calorías por botella', '100 kcal'),
(21, 'Duración de conservación', '1 año'),
(22, 'Duración de conservación', '5 años'),
(22, 'Contenido de agua', '5%'),
(23, 'Calorías por pastilla', '10 kcal'),
(23, 'Efecto', 'Nutricional'),
(24, 'Contenido proteico', '20 g por porción'),
(24, 'Duración de conservación', '3 años'),

-- Construcción naval
(25, 'Tipo de material', 'Compuesto'),
(25, 'Resistencia a la tracción', '300 MPa'),
(26, 'Potencia de propulsión', '10,000 hp'),
(26, 'Tipo de combustible', 'Hidrógeno'),
(27, 'Eficiencia', '80%'),
(27, 'Capacidad de generación', '10,000 kWh'),
(28, 'Capacidad de carga', '50 toneladas'),
(28, 'Resistencia', 'Bajo condiciones de vacío'),
(29, 'Tipo de sistema', 'Navegación GPS'),
(29, 'Precisión', '10 metros'),
(30, 'Tamaño', '3 m de diámetro'),
(30, 'Material', 'Acero inoxidable'),

-- Aeroespacial
(31, 'Tipo de avión', 'Caza'),
(31, 'Velocidad máxima', 'Mach 2.5'),
(32, 'Rango de operación', '250,000 km'),
(32, 'Tiempo de vida', '5 años'),
(33, 'Carga máxima', '5 toneladas'),
(33, 'Autonomía', '2 horas'),
(34, 'Tipo de comunicación', 'Digital'),
(34, 'Frecuencia de operación', '10 GHz'),
(35, 'Capacidad de carga', '10 toneladas'),
(35, 'Altura máxima', '10,000 km'),
(36, 'Potencia', '100,000 hp'),
(36, 'Tiempo de lanzamiento', '30 minutos'),

-- Productos químicos
(37, 'Pureza', '99.9%'),
(37, 'Estado', 'Líquido'),
(38, 'Tipo de reacción', 'Endotérmica'),
(38, 'Volumen', '1 litro'),
(39, 'Aplicaciones', 'Catalizadores, farmacéuticos'),
(39, 'Forma', 'Polvo'),
(40, 'Estado físico', 'Líquido'),
(40, 'Densidad', '0.9 g/cm³'),
(41, 'Uso', 'Combustibles alternativos'),
(41, 'Origen', 'Biológico'),
(42, 'Tipo de compuesto', 'Inorgánico'),
(42, 'Estructura', 'Molecular'),

-- Servicios médicos
(43, 'Tipo de tratamiento', 'Inmunoterapia'),
(43, 'Duración', '1 mes'),
(44, 'Tipo de virus', 'Viral'),
(44, 'Dosis recomendada', '1 vez al año'),
(45, 'Contenido', 'Vendas, desinfectantes'),
(45, 'Duración de conservación', '3 años'),
(46, 'Tipo de equipos', 'Ultrasonido, rayos X'),
(46, 'Garantía', '2 años'),
(47, 'Tipo de terapia', 'Regenerativa'),
(47, 'Duración', '3 meses'),
(48, 'Modalidad', 'Virtual'),
(48, 'Duración de la consulta', '30 minutos'),

-- Tecnología de recuperación extraterrestre (continuación)
(49, 'Capacidad de análisis', 'Avanzada'),
(49, 'Peso máximo del objeto', '1 tonelada'),
(50, 'Protocolo de seguridad', 'Alta seguridad'),
(50, 'Tipo de material', 'Metálico'),
(51, 'Tamaño de la pantalla', '15 pulgadas'),
(51, 'Conectividad', 'Bluetooth, Wi-Fi'),
(52, 'Número de frecuencias', '5'),
(52, 'Tipo de detección', 'Pasiva y activa'),
(53, 'Capacidad de energía', '5 MW'),
(53, 'Sistema de refrigeración', 'Eficiente'),
(54, 'Nivel de ruido', 'Bajo'),
(54, 'Compatibilidad', 'Multiplataforma'),

-- Tecnología de creación extraterrestre (continuación)
(55, 'Velocidad de impresión', '100 mm/s'),
(55, 'Capacidad de almacenamiento', '1 TB'),
(56, 'Frecuencia de trabajo', '60 Hz'),
(56, 'Tipo de energía utilizada', 'Solar y eólica'),
(57, 'Escala de replicación', '1:1'),
(57, 'Materiales de entrada', 'Cualquier tipo'),
(58, 'Conexión a Internet', 'Requerida'),
(58, 'Frecuencia de uso', 'Diaria'),
(59, 'Tipo de campo generado', 'Electromagnético'),
(59, 'Ámbito de uso', 'Industrial'),
(60, 'Tamaño del laboratorio', '100 m²'),
(60, 'Equipamiento estándar', 'Microscopio, reactivos'),

-- Biotecnología (continuación)
(61, 'Efectos secundarios', 'Ninguno conocido'),
(61, 'Regulación', 'Aprobado por FDA'),
(62, 'Tipo de tratamiento', 'Inmunoterapia'),
(62, 'Efectividad', '90%'),
(63, 'Duración de tratamiento', '6 meses'),
(63, 'Costo estimado', '$2000'),
(64, 'Cantidad por caja', '30 unidades'),
(64, 'Presentación', 'Cápsulas'),
(65, 'Tipo de prueba', 'Prueba rápida'),
(65, 'Resultados en', '15 minutos'),
(66, 'Material utilizado', 'Tejido biológico'),
(66, 'Eficiencia', 'Alta'),

-- Alimentos (continuación)
(67, 'Origen', 'Extraterrestre'),
(67, 'Sabor', 'Variedad de sabores'),
(68, 'Contenido de carbohidratos', '60 g'),
(68, 'Contenido de proteínas', '10 g'),
(69, 'Ingredientes principales', 'Frutas, verduras'),
(69, 'Uso recomendado', 'Diario'),
(70, 'Formato', 'Bebible'),
(70, 'Tipo de empaque', 'Reciclable'),
(71, 'Contenido de grasas', '5 g'),
(71, 'Porción recomendada', '1 botella'),
(72, 'Información nutricional', 'Detallada'),
(72, 'Beneficios', 'Energético y saludable');

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

