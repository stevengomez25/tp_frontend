import os

# 1. Agregamos '.env' a la lista de cosas prohibidas
IGNORAR = {
    '.venv', '__pycache__', '.git', 'dist', 'build', 
    '.pytest_cache', 'civi.spec', '.env', '.env.local'
}

def unificar_proyecto(ruta_raiz, archivo_salida):
    with open(archivo_salida, 'w', encoding='utf-8') as outfile:
        for raiz, dirs, archivos in os.walk(ruta_raiz):
            # Filtrar carpetas ignoradas
            dirs[:] = [d for d in dirs if d not in IGNORAR]
            
            for nombre_archivo in archivos:
                # 2. FILTRO DE SEGURIDAD EXTRA:
                # Si el archivo es EXACTAMENTE '.env' o empieza por '.env.', lo saltamos.
                if nombre_archivo == '.env' or nombre_archivo.startswith('.env.'):
                    continue

                # Solo leemos los archivos de código que permitimos
                extensiones_permitidas = ('.py', '.yml', '.yaml', '.env.example', '.sql','.ts','.html')
                if nombre_archivo.endswith(extensiones_permitidas):
                    ruta_completa = os.path.join(raiz, nombre_archivo)
                    outfile.write(f"\n{'='*50}\n")
                    outfile.write(f"ARCHIVO: {os.path.relpath(ruta_completa, ruta_raiz)}\n")
                    outfile.write(f"{'='*50}\n\n")
                    
                    try:
                        with open(ruta_completa, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error al leer {nombre_archivo}: {e}")
                    outfile.write("\n")

if __name__ == "__main__":
    unificar_proyecto('.', 'todo_mi_codigo.txt')
    print("✅ ¡Listo! El archivo 'todo_mi_codigo.txt' se creó sin datos sensibles.")