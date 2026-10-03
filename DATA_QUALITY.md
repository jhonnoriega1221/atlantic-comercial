# Reporte de Calidad de Datos (Data Quality) y Modelado

Este documento detalla los hallazgos de calidad encontrados durante la fase de exploración del archivo fuente (`Base_Original.xlsx`), el impacto cuantitativo de cada anomalía y las decisiones de ingeniería y negocio aplicadas en el pipeline de ingesta (`pipeline/data_ingestion.py`) y en la definición del esquema de base de datos (`db/schema.sql`).

---

## Registros Duplicados en Tablas Maestras

Se identificaron filas idénticas duplicadas en el achivo de excel en las tablas de materiales, clientes y relacion de cliente - asesores.

- **Impacto Cuantitativo:**
  - `Materiales`: 94 registros duplicados (de 2.888 filas totales).
  - `Clientes`: 133 registros duplicados (de 11.421 filas totales).
  - `Asesores`: 332 registros duplicados de la relación Cliente-Asesor (de 11.620 filas totales).

- **Resolución:** Se eliminaron los duplicados por clave primaria en el pipeline de Python mediante `.drop_duplicates()`, garantizando la unicidad de las llaves primarias en las tablas de dimensiones `dim_materiales`, `dim_clientes` y en la tabla relacional `rel_cliente_asesor`.

---

## 2. Inconsistencia de Formatos en Columna Fecha (`Periodo`)

La columna `Periodo` en la tabla de transacciones de ventas presentaba una formatos distintos para las fechas (`2026.01`, `2026_02`, `2026.03`, `2026-04`, `2026/05`, `2026 06`).

- **Impacto Cuantitativo:** 446.742 registros afectados (todas las filas de la tabla `Ventas`).

- **Resolución:** Se implementó una normalización por medio de expresiones regulares (`str.replace(r'\D', '', regex=True)`) para obtener únicamente los caracteres numéricos (`YYYYMM`) y formatearlos al estándar ISO 8601 de fecha completa (`YYYY-MM-01`). A partir de esto, se generó dinámicamente la dimensión dim_tiempo para mejorar el modelo analítico. (Tambien se coloca 01 en los días para mantener formato yyyy-mm-dd exigido por TypeORM, asi se pueden hacer consultas nativas en NestJS para las fechas).

---

## 3. Tratamiento de Montos Negativos y Ceros en Columna `Neto`

Se detectaron valores en cero y negativos en la la columna `Neto` de la tabla `Ventas`.

- **Impacto Cuantitativo:**
  - Registros con `Neto == 0`: 11.428 transacciones.
  - Registros con `Neto < 0`: 3.127 transacciones (rango de valores entre -$0.01 y -$10.880.360,00 COP).

- **Resolución / Justificación de Negocio:**
  - **Negativos:** No se alteran ni se eliminan. Representan devoluciones o anulaciones. Se conservarán para permitir que el backend calcule el indicador de **% Devoluciones**.
  - **Ceros:** No se eliminan. Representan bonificaciones, muestras comerciales o entregas promocionales a costo cero. Se conservan para no afectar al conteo total de transacciones reales ni el cálculo del **Ticket Promedio** en la API REST.

---

## 4. Estandarización de Formato de Texto en Columna `Sede`

En la tabla de Sedes en el Excel, la ubicación "COTA" estaba registrada tipo título (`Cota`), mientras que el resto de sedes estaban en mayúsculas (`BOGOTA`, `MEDELLIN`, `CALI`, `BARRANQUILLA`, `CARTAGENA`, `BUCARAMANGA`, `PEREIRA`).

- **Impacto Cuantitativo:** 1 registro en la tabla maestra `Sedes` (`ASE-022`).
- **Resolución:** Se estandarizó la columna `Sede` aplicando transformación a mayúsculas sostenidas (`str.upper().str.strip()`) durante el script de `data_ingestion.py`.

---

## 5. Integridad Referencial y Asesores Inactivos

Al cruzar la tabla de ventas con sus respectivos origenes, se detectó un asesor sin actividad comercial.

- **Impacto Cuantitativo:**
  - **Asesores Inactivos/Sin Ventas:** 1 asesor (`ASE-022`, "Asesor Cota 01") registrado en la tabla de Sedes no posee asignación de clientes ni ventas en el semestre enero-junio 2026.

- **Resolución:** Se preservó al asesor `ASE-022` en la dimensión `dim_asesores`. La relación **cliente-asesor** se aisló en la tabla puente `rel_cliente_asesor`, permitiendo realizar `LEFT JOIN` seguros en las vistas SQL para que los reportes de dicho asesor o sede retornen cero ventas y no rompan la estructura analítica.

---

## 6. Rigurosidad del Esquema Estrella (DDL)

Para que los tipos de datos no queden inferidos por pandas al leer los datos. Se define un schema en donde se definen las tablas de la base de datos basandose en el esquema estrella.

- **Resolución:** Se creó un script de migraciones/DDL (`db/schema.sql`) que define el Esquema Estrella con sus llaves primarias **(PRIMARY KEY)**, llaves foráneas **(FOREIGN KEY)** e índices **(INDEX)**. El pipeline de Python ejecuta este script antes de poblar los datos, garantizando una estructura relacional estricta e idempotente.

---

## 7. Pruebas de Calidad Automatizadas

Se implementó una suite de pruebas con `pytest` en `pipeline/test_pipeline.py` que valida automáticamente tres criterios críticos:

1. **Integridad Volumétrica:** Confirmación de exactamente 446.742 registros en `fact_ventas`.
2. **Unicidad de Dimensiones:** Verificación de cero duplicados en las llaves de `dim_clientes`, `dim_materiales`, `dim_asesores` y `dim_tiempo`.
3. **Consistencia Financiera:** Coincidencia exacta de la cifra de venta neta acumulada por $19.692.465.172,79 COP.
