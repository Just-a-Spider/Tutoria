# Pasos para replicar con docker
Dentro de la carpeta principal
```bash
docker compose up -d
```

Y listo.
## Importante
La integración del front en docker está como archivos estáticos en el servidor. Para que se suban los cambios mientras se está desarrollando el front, usar dentro de la carpeta /client:
```bash
npm run watch
```
Esto es un tanto inconveniente pues para que los cambios del front se actualicen en el servicio, se tiene que recargar la página. Fuera de eso, está para revisar algún bug.

# Pasos para replicar backend (so far lo que hay)
> [!IMPORTANT]
> No olviden que deben estar corriendo sus servicios de postgres y redis de docker 
> O en local si quieren hacerlo en local

## Crear tu entorno e instalar dependencias
> [!NOTE]
> Los comandos los dejaré para Windows, I do recommend usar el CLI de CMD no Powershell

Lo he probado en 2 PCs con Windows, 1 Linux Debian y un Linux Arch. Si no les corre ya F
```bash
py -m venv venv
./venv/Scrips/activate
pip install -r requirements.txt
cd server_django/
```

## Crear archivo .env
> [!NOTE]
> Que quede al mismo nivel que manage.py, osea en server_django/

Luego de crear el entorno y activarlo, toca crear tu archivo ".env"
Para esto simplemente es Ctrl+C y Ctrl+V de ".env.example" y completar los campos que dicen <completar>

## Migraciones
> [!IMPORTANT]
> No omitan esto

```bash
py manage.py migrate
```

> [!IMPORTANT]
> Si hay errores, borra todas las carpetas "migrations" dentro de las apps y corran
```bash
py manage.py makemigrations user tutoring_sessions profiles posts notifications courses chat
py manage.py migrate
```

## Hacer los tests
Puede salir algún error con las fechas y what not, es cosa para modificar luego, no influye en prod
```bash
py manage.py test
```

> [!TIP]
> Si quieren correr los test de una app en específico, por ejemplo:
```bash
py manage.py test user
```

Y para hacer los tests de los websockets
```bash
pytest
```

# Pasos para replicar el frontend

```bash
cd client
npm i
ng serve
```
