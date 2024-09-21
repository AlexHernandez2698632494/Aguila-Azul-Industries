-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS AAE;
USE AAE;

-- Crear la tabla Usuarios si no existe
CREATE TABLE IF NOT EXISTS Usuarios (
    UsuarioID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    CorreoElectronico VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    NivelUsuario INT NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (NivelUsuario IN (0, 1, 2)) -- Asegura que solo se permitan los valores 0, 1 y 2
);

-- Crear la tabla Categorías si no existe
CREATE TABLE IF NOT EXISTS Categorias (
    CategoriaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) UNIQUE NOT NULL
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

-- Inserciones en la tabla Categorías (solo si la tabla está vacía)
INSERT IGNORE INTO Categorias (Nombre) VALUES 
('Tecnología de recuperación extraterrestre'),
('Tecnología de creación extraterrestre'),
('Biotecnología'),
('Alimentos'),
('Construcción naval'),
('Aeroespacial'),
('Productos químicos'),
('Servicios médicos');

-- Inserciones en la tabla Proveedores (solo si la tabla está vacía)
INSERT IGNORE INTO Proveedores (Nombre, Contacto, Teléfono, Dirección) VALUES 
('Proveedor A', 'Juan Pérez', '123456789', 'Calle Falsa 123'),
('Proveedor B', 'María López', '987654321', 'Avenida Siempre Viva 742');

-- Inserciones en la tabla Productos (solo si la tabla está vacía)
INSERT IGNORE INTO Productos (Nombre, Descripcion, Precio, CategoriaID, ProveedorID) VALUES 
('Producto 1', 'Descripción del producto 1', 100.00, 1, 1),
('Producto 2', 'Descripción del producto 2', 150.00, 2, 2),
('Producto 3', 'Descripción del producto 3', 200.00, 3, 1),
('Producto 4', 'Descripción del producto 4', 250.00, 4, 2);

-- Inserciones en la tabla Inventario (solo si la tabla está vacía)
INSERT IGNORE INTO Inventario (ProductoID, CantidadComprada, CantidadVendida) VALUES 
(1, 100, 0),
(2, 200, 0),
(3, 150, 0),
(4, 80, 0);

-- Inserciones en la tabla Usuarios (solo si la tabla está vacía)
INSERT IGNORE INTO Usuarios (Nombre, CorreoElectronico, Contraseña, NivelUsuario) VALUES 
('Alice', 'alice@example.com', 'password123', 2), -- Cliente
('Bob', 'bob@example.com', 'password123', 1),   -- Vendedor
('Charlie', 'charlie@example.com', 'password123', 0); -- Gerente

-- Inserciones en la tabla Ventas (solo si la tabla está vacía)
INSERT IGNORE INTO Ventas (ClienteID, Total) VALUES 
(1, 250.00),
(1, 400.00);

-- Inserciones en la tabla DetallesVenta (solo si la tabla está vacía)
INSERT IGNORE INTO DetallesVenta (VentaID, ProductoID, Cantidad, Precio) VALUES 
(1, 1, 1, 100.00),
(1, 2, 1, 150.00),
(2, 3, 2, 200.00),
(2, 4, 1, 250.00);

-- Inserciones en la tabla Envíos (solo si la tabla está vacía)
INSERT IGNORE INTO Envíos (VentaID, Dirección, Estado) VALUES 
(1, 'Calle del Comercio 456', 'Pendiente'),
(2, 'Avenida Central 789', 'En tránsito');
