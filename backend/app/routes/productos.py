from flask import Blueprint, request, jsonify
from app.services.productos_service import leer_productos, escribir_productos, generar_id_unico, sincronizar_productos
from rich.console import Console

# Crear una instancia de Console
console = Console()

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/api/productos', methods=['GET'])
def obtener_productos():
    try:
        productos = leer_productos()
        console.log(f"[green]Productos obtenidos con éxito[/green]")
        return jsonify(productos), 200
    except Exception as e:
        console.log(f"[red]Error al obtener productos: {str(e)}[/red]")
        return jsonify({'error': str(e)}), 500

@productos_bp.route('/api/productos', methods=['POST'])
def agregar_producto():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        precio = data.get('precio')

        if precio is None:
            console.log("[yellow]El precio es obligatorio[/yellow]")
            return jsonify({'error': 'El precio es obligatorio'}), 400

        productos = leer_productos()
        id_producto = generar_id_unico(productos)

        nuevo_producto = {
            'id_producto': id_producto,
            'nombre': nombre,
            'descripcion': descripcion,
            'precio': precio
        }

        productos.append(nuevo_producto)
        escribir_productos(productos)

        console.log(f"[green]Producto agregado con éxito: {nuevo_producto['nombre']}[/green]")
        return jsonify(nuevo_producto), 201
    except Exception as e:
        console.log(f"[red]Error al agregar producto: {str(e)}[/red]")
        return jsonify({'error': str(e)}), 500

@productos_bp.route('/api/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    try:
        productos = leer_productos()
        producto = next((p for p in productos if p['id_producto'] == id), None)

        if producto:
            productos.remove(producto)
            escribir_productos(productos)
            console.log(f"[green]Producto eliminado: {producto['nombre']}[/green]")
            return jsonify({'message': 'Producto eliminado'}), 200
        else:
            console.log(f"[yellow]Producto no encontrado: ID {id}[/yellow]")
            return jsonify({'error': 'Producto no encontrado'}), 404
    except Exception as e:
        console.log(f"[red]Error al eliminar producto: {str(e)}[/red]")
        return jsonify({'error': str(e)}), 500

@productos_bp.route('/api/sincronizar', methods=['GET'])
def sincronizar():
    try:
        sincronizar_productos()
        console.log("[green]Productos sincronizados correctamente[/green]")
        return jsonify({'message': 'Productos sincronizados'}), 200
    except Exception as e:
        console.log(f"[red]Error al sincronizar productos: {str(e)}[/red]")
        return jsonify({'error': str(e)}), 500

@productos_bp.route('/api/productos/<int:id>', methods=['PUT'])
def editar_producto(id):
    try:
        data = request.get_json()
        if not data:
            console.log("[yellow]No se proporcionaron datos en la solicitud[/yellow]")
            return jsonify({'error': 'No se proporcionaron datos'}), 400

        productos = leer_productos()
        producto = next((p for p in productos if p['id_producto'] == id), None)

        if not producto:
            console.log(f"[yellow]Producto no encontrado: ID {id}[/yellow]")
            return jsonify({'error': 'Producto no encontrado'}), 404

        producto['nombre'] = data.get('nombre', producto['nombre'])
        producto['descripcion'] = data.get('descripcion', producto['descripcion'])
        producto['precio'] = data.get('precio', producto['precio'])

        try:
            producto['precio'] = float(producto['precio'])
            if producto['precio'] <= 0:
                console.log("[yellow]El precio debe ser mayor a 0[/yellow]")
                return jsonify({'error': 'El precio debe ser mayor a 0'}), 400
        except ValueError:
            console.log("[yellow]El precio proporcionado no es válido[/yellow]")
            return jsonify({'error': 'El precio debe ser un número válido'}), 400

        escribir_productos(productos)
        console.log(f"[green]Producto actualizado correctamente: ID {id}[/green]")
        return jsonify({'message': 'Producto actualizado', 'producto': producto}), 200

    except Exception as e:
        console.log(f"[red]Error al editar producto: {str(e)}[/red]")
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500
