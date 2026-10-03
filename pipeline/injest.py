import pandas as pd # Importamos pandas para 
import sqlite3
import os

# Definimos las constantes
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_PATH = os.path.join(BASE_DIR, '..', 'data', 'Base_Original.xlsx')
DB_PATH = os.path.join(BASE_DIR, '..', 'db', 'afs-comercial.sqlite')
SCHEMA_PATH = os.path.join(BASE_DIR, '..', 'db', 'schema.sql')

def limpiar_datos():
    print("Iniciando ingesta, limpieza y creación de base de datos con esquema estrella")
    
    # Extraer datos de excel
    df_ventas = pd.read_excel(EXCEL_PATH, sheet_name='Ventas')
    df_clientes = pd.read_excel(EXCEL_PATH, sheet_name='Clientes')
    df_materiales = pd.read_excel(EXCEL_PATH, sheet_name='Materiales')
    df_asesores = pd.read_excel(EXCEL_PATH, sheet_name='Asesores')
    df_sedes = pd.read_excel(EXCEL_PATH, sheet_name='Sedes')

    # Normalizar nombres de las sedes en mayuscula
    df_sedes['Sede'] = df_sedes['Sede'].astype(str).str.upper().str.strip()
    df_sedes['Nombre Asesor'] = df_sedes['Nombre Asesor'].astype(str).str.strip()
    
    # Eliminar duplicados
    dim_clientes = df_clientes.drop_duplicates(subset=['Cod Cliente'])
    dim_materiales = df_materiales.drop_duplicates(subset=['Cod Material'])
    dim_asesores = df_sedes.drop_duplicates(subset=['Cod Asesor'])
    rel_cliente_asesor = df_asesores.drop_duplicates(subset=['Cod Cliente'])

    # Normalizar las fechas al estandar ISO 8601 (aaaa-mm-dd)
    # Nota: Se coloca 01 en los días para mantener formato yyyy-mm-dd exigido por TypeORM, asi se pueden hacer consultas nativas en NestJS para las fechas
    df_ventas['Periodo'] = df_ventas['Periodo'].astype(str).str.replace(r'\D', '', regex=True)
    df_ventas['Periodo'] = pd.to_datetime(df_ventas['Periodo'], format='%Y%m').dt.strftime('%Y-%m-01')

    # Generar dimensión tiempo para agregarla a la base de datos
    fechas_unicas = pd.to_datetime(df_ventas['Periodo'].unique()).sort_values()
    nombres_meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    
    dim_tiempo = pd.DataFrame({
        'Fecha': fechas_unicas.strftime('%Y-%m-01'),
        'Anio': fechas_unicas.year,
        'Mes': fechas_unicas.month,
        'Nombre_Mes': [nombres_meses[m - 1] for m in fechas_unicas.month],
        'Trimestre': fechas_unicas.quarter
    })

    # Inicializar esquema en SQLite en schema.sql
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        sql_schema = f.read()
    conn.executescript(sql_schema)

    # Cargar datos a la base de datos SQLite verificando que no se repita, para la idempotencia
    dim_tiempo.to_sql('dim_tiempo', conn, if_exists='append', index=False)
    dim_clientes.to_sql('dim_clientes', conn, if_exists='append', index=False)
    dim_materiales.to_sql('dim_materiales', conn, if_exists='append', index=False)
    dim_asesores.to_sql('dim_asesores', conn, if_exists='append', index=False)
    rel_cliente_asesor.to_sql('rel_cliente_asesor', conn, if_exists='append', index=False)
    df_ventas[['Periodo', 'Cod Principal', 'Cod Material', 'Neto']].to_sql('fact_ventas', conn, if_exists='append', index=False)

    # Crear vista de resumen para que la API responda rapido si se solicita resumen
    cursor = conn.cursor()
    cursor.execute("DROP VIEW IF EXISTS view_ventas_agregadas;")
    cursor.execute("""
        CREATE VIEW view_ventas_agregadas AS
        SELECT 
            v.Periodo,
            a.Sede,
            a.[Cod Asesor],
            a.[Nombre Asesor],
            COUNT(v.[Cod Principal]) as Transacciones,
            COUNT(DISTINCT v.[Cod Principal]) as Clientes_Activos,
            SUM(v.Neto) as Venta_Neta,
            SUM(CASE WHEN v.Neto < 0 THEN v.Neto ELSE 0 END) as Devoluciones
        FROM fact_ventas v
        LEFT JOIN rel_cliente_asesor r ON v.[Cod Principal] = r.[Cod Cliente]
        LEFT JOIN dim_asesores a ON r.[Cod Asesor] = a.[Cod Asesor]
        GROUP BY v.Periodo, a.Sede, a.[Cod Asesor], a.[Nombre Asesor];
    """)
    conn.commit()
    conn.close()
    
    print(f"Base de datos creada correctamente en: {DB_PATH}")

if __name__ == "__main__":
    limpiar_datos()