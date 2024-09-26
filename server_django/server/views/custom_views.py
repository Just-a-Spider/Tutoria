from rest_framework import viewsets, views
from server.middleware.auth import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated

class CustomAuthenticatedModelViewset(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

class CustomAuthenticatedAPIView(views.APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]