import pytest
import sqlite3
import os

# Constante con ruta dinámica a la base de datos SQLite
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'db', 'afs-comercial.sqlite')

@pytest.fixture
def db_conn():
    """Preparando entorno para pruebas."""
    assert os.path.exists(DB_PATH), f"La base de datos no existe en: {DB_PATH}. Ejecuta 'python pipeline/ingesta.py' primero."
    conn = sqlite3.connect(DB_PATH)
    yield conn
    conn.close()

# 1. Prueba de conteo de filas
def test_conteo_filas_fact_ventas(db_conn):
    """Verifica que la tabla de ventas (hechos) contenga exactamente los 446.742 registros procesados."""
    cursor = db_conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM fact_ventas")
    total_filas = cursor.fetchone()[0]
    assert total_filas == 446742, f"Se esperaban 446.742 filas, pero se encontraron {total_filas}."

# 2. Prueba de unicidad de llaves primarias en dimensiones
def test_unicidad_llaves_dimensiones(db_conn):
    """Verifica que las dimensiones no contengan llaves duplicadas."""
    cursor = db_conn.cursor()
    
    # Unicidad en Dim Clientes
    cursor.execute("SELECT COUNT(*), COUNT(DISTINCT [Cod Cliente]) FROM dim_clientes")
    total_c, distinct_c = cursor.fetchone()
    assert total_c == distinct_c, f"Existen clientes duplicados: {total_c} filas vs {distinct_c} únicos."

    # Unicidad en Dim Materiales
    cursor.execute("SELECT COUNT(*), COUNT(DISTINCT [Cod Material]) FROM dim_materiales")
    total_m, distinct_m = cursor.fetchone()
    assert total_m == distinct_m, f"Existen materiales duplicados: {total_m} filas vs {distinct_m} únicos."

    # Unicidad en Dim Asesores
    cursor.execute("SELECT COUNT(*), COUNT(DISTINCT [Cod Asesor]) FROM dim_asesores")
    total_a, distinct_a = cursor.fetchone()
    assert total_a == distinct_a, f"Existen asesores duplicados: {total_a} filas vs {distinct_a} únicos."
    
    # Unicidad en Dim Tiempos
    cursor.execute("SELECT COUNT(*), COUNT(DISTINCT [Fecha]) FROM dim_tiempo")
    total_a, distinct_a = cursor.fetchone()
    assert total_a == distinct_a, f"Existen fechas duplicadas: {total_a} filas vs {distinct_a} únicos."

# 3. Prueba de integridad en el valor global de ventas
def test_total_ventas_integridad(db_conn):
    """Verifica que la cifra total de venta neta coincida exactamente con el consolidado financiero."""
    cursor = db_conn.cursor()
    cursor.execute("SELECT SUM(Neto) FROM fact_ventas")
    total_neto = cursor.fetchone()[0]
    
    # Total esperado exacto procesado del Excel: $19,692,465,172.79 COP
    assert total_neto is not None, "El monto total de ventas es nulo."
    assert round(total_neto, 2) == 19692465172.79, f"El total de ventas no cuadra. Esperado: 19692465172.79, Obtención: {total_neto}"