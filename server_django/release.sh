#!/usr/bin/env bash

# Collect static files
python manage.py collectstatic --no-input

# Make and apply migrations
python manage.py migrate

# Create a superuser
# Only create the superuser if it doesn't already exist
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python manage.py createsuperuser --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL" || true
else
    echo "Superuser credentials are not set. Skipping superuser creation."
fi
