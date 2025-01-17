import os
import json
import random
import requests
from app.utils.logger import info, error, success, warning

# Ruta del archivo de productos
productos_file = 'app/models/productos.json'

def leer_productos():
    """Lee los productos desde el archivo JSON."""
    if not os.path.exists(productos_file):
        return []
    with open(productos_file, 'r') as f:
        return json.load(f)

def escribir_productos(productos):
    """Escribe la lista de productos en el archivo JSON."""
    with open(productos_file, 'w') as f:
        json.dump(productos, f, indent=2)

def generar_id_unico(productos):
    """Genera un ID único para un nuevo producto."""
    if productos:
        ids = [producto['id_producto'] for producto in productos]
        return max(ids) + 1
    return 1

def sincronizar_productos():
    """Sincroniza los productos con una API externa."""
    try:
        response = requests.get('https://jsonplaceholder.typicode.com/posts')
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            productos_api = response.json()
            productos = leer_productos()

            nuevos = 0
            for producto in productos_api:
                # Comprobar si el producto ya existe en la lista
                if not any(p['nombre'] == producto['title'] for p in productos):
                    precio = round(random.uniform(5.0, 100.0), 2)  # Precio aleatorio
                    nuevo_producto = {
                        'id_producto': generar_id_unico(productos),
                        'nombre': producto['title'],
                        'descripcion': producto['body'],
                        'precio': precio
                    }
                    productos.append(nuevo_producto)
                    nuevos += 1

            # Escribir los nuevos productos en el archivo
            if nuevos > 0:
                escribir_productos(productos)
                success(f"[green]{nuevos} productos sincronizados con éxito[/green]")
            else:
                warning("No se encontraron productos nuevos para sincronizar")
        else:
            error("[red]Error al obtener productos de la API externa. Código de respuesta: {response.status_code}[/red]")
    
    except requests.exceptions.RequestException as e:
        error(f"[red]Error al conectar con la API: {str(e)}[/red]")
    except Exception as e:
        error(f"[red]Error inesperado al sincronizar productos: {str(e)}[/red]")

