from rich.console import Console

# Crear una instancia de la consola
console = Console()

def info(message):
    console.print(f"[bold green]INFO:[/bold green] {message}")

def warning(message):
    console.print(f"[bold yellow]WARNING:[/bold yellow] {message}")

def error(message):
    console.print(f"[bold red]ERROR:[/bold red] {message}")

def success(message):
    console.print(f"[bold green]SUCCESS:[/bold green] {message}")
