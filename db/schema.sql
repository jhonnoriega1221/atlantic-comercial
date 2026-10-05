DROP VIEW IF EXISTS view_ventas_agregadas; -- Vista vieja
DROP VIEW IF EXISTS view_clientes_resumen;
DROP TABLE IF EXISTS agg_ventas_mensual;
DROP TABLE IF EXISTS fact_ventas;
DROP TABLE IF EXISTS dim_tiempo;
DROP TABLE IF EXISTS dim_clientes;
DROP TABLE IF EXISTS dim_materiales;
DROP TABLE IF EXISTS dim_asesores;
DROP TABLE IF EXISTS rel_cliente_asesor;

-- Dimensiones:
-- Dimensión Tiempo
CREATE TABLE dim_tiempo (
    Fecha TEXT PRIMARY KEY, -- YYYY-MM-01
    Anio INTEGER NOT NULL,
    Mes INTEGER NOT NULL,
    Nombre_Mes TEXT NOT NULL,
    Trimestre INTEGER NOT NULL
);

-- Dimensión Clientes
CREATE TABLE dim_clientes (
    [Cod Cliente] TEXT PRIMARY KEY,
    [Nombre Cliente] TEXT NOT NULL,
    [Tipo Cliente] TEXT NOT NULL
);

-- Dimensión Materiales
CREATE TABLE dim_materiales (
    [Cod Material] TEXT PRIMARY KEY,
    [Nombre Material] TEXT NOT NULL,
    [Categoria] TEXT NOT NULL,
    [Subcategoria] TEXT NOT NULL,
    [Producto Base] TEXT NOT NULL,
    [Presentacion] TEXT NOT NULL,
    [Formato] TEXT NOT NULL,
    [Calidad] TEXT NOT NULL,
    [Marca] TEXT NOT NULL
);

-- Dimensión Asesores / Sedes
CREATE TABLE dim_asesores (
    [Cod Asesor] TEXT PRIMARY KEY,
    [Nombre Asesor] TEXT NOT NULL,
    [Sede] TEXT NOT NULL
);

--- Relaciones:
-- Relación Cliente-Asesor
CREATE TABLE rel_cliente_asesor (
    [Cod Cliente] TEXT PRIMARY KEY,
    [Cod Asesor] TEXT NOT NULL,
    FOREIGN KEY ([Cod Cliente]) REFERENCES dim_clientes([Cod Cliente]),
    FOREIGN KEY ([Cod Asesor]) REFERENCES dim_asesores([Cod Asesor])
);

--- Hecho:
-- Hecho ventas
CREATE TABLE fact_ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Periodo TEXT NOT NULL,
    [Cod Principal] TEXT NOT NULL,
    [Cod Material] TEXT NOT NULL,
    Neto REAL NOT NULL,
    FOREIGN KEY (Periodo) REFERENCES dim_tiempo(Fecha),
    FOREIGN KEY ([Cod Principal]) REFERENCES dim_clientes([Cod Cliente]),
    FOREIGN KEY ([Cod Material]) REFERENCES dim_materiales([Cod Material])
);

--- Vistas:
-- Vista para el listado y ranking de clientes
CREATE VIEW view_clientes_resumen AS
SELECT 
    c.[Cod Cliente],
    c.[Nombre Cliente],
    COUNT(v.id) AS Transacciones,
    SUM(v.Neto) AS Venta_Neta
FROM dim_clientes c
LEFT JOIN fact_ventas v ON c.[Cod Cliente] = v.[Cod Principal]
GROUP BY c.[Cod Cliente], c.[Nombre Cliente];

-- Indices:
CREATE INDEX idx_fact_periodo ON fact_ventas(Periodo);
CREATE INDEX idx_fact_cliente ON fact_ventas([Cod Principal]);
CREATE INDEX idx_fact_material ON fact_ventas([Cod Material]);
CREATE INDEX IF NOT EXISTS idx_fact_ventas_periodo ON fact_ventas(Periodo);
CREATE INDEX IF NOT EXISTS idx_fact_ventas_cliente ON fact_ventas([Cod Principal]);
CREATE INDEX IF NOT EXISTS idx_fact_ventas_material ON fact_ventas([Cod Material]);
CREATE INDEX IF NOT EXISTS idx_rel_cliente_asesor ON rel_cliente_asesor([Cod Cliente], [Cod Asesor]);
CREATE INDEX IF NOT EXISTS idx_dim_asesores_sede ON dim_asesores(Sede);