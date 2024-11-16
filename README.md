# Pasos para replicar backend (so far lo que hay)
> [!IMPORTANT]
> No olviden que deben estar corriendo sus servicios de postgres y redis de docker 
> O en local si quieren hacerlo en local

## Crear tu entorno e instalar dependencias
> [!NOTE]
> Los comandos los dejaré para Windows, I do recommend usar el CLI de CMD no Powershell

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
```bash
# Database, rellena de acuerdo a los datos que usen
DB_ENGINE="django.db.backends.mysql"
DB_USER=""
DB_PASSWORD=""
DB_NAME=""
DB_HOST=""
DB_PORT=""

# Para la autenticación con Google. Revisen info de las apis y credenciales de Google
GOOGLE_OAUTH2_KEY=""
GOOGLE_OAUTH2_SECRET=""

# Redis
REDIS_URL="redis://localhost:6379" # O el puerto que usen, dejar en "" si para manejar en memoria

# Email, Para esto tienen que sacar credenciales de google(again). Pueden buscarlo en la Docu
# de Django creo
EMAIL_HOST_USER=""
EMAIL_HOST_PASSWORD=""
```
## Migraciones
> [!IMPORTANT]
> No omitan esto

```bash
py manage.py makemigrations
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
