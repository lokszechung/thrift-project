from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model

from .serializers.common import UserSerializer, UserRegisterSerializer

from datetime import datetime, timedelta
import jwt
from django.conf import settings

from rest_framework.exceptions import NotFound
from .serializers.populated import PopulatedUserSerializer

from rest_framework.permissions import IsAuthenticatedOrReadOnly

User = get_user_model()
# Create your views here.

class RegisterView(APIView):

    def post(self, request):
        try:
            user_to_register = UserRegisterSerializer(data=request.data)
            if user_to_register.is_valid():
                user_to_register.save()
                return Response('Registration successful', status.HTTP_201_CREATED)
            return Response(user_to_register.errors, status.HTTP_422_UNPROCESSABLE_ENTITY) 
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):   
    
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        try:
            user_to_login = User.objects.get(email=email)
        except User.DoesNotExist as e:
            raise PermissionDenied('Invalid credentials')
        
        if not user_to_login.check_password(password):  
            print('Password incorrect')
            raise PermissionDenied('Invalid credentials')

        dt = datetime.now() + timedelta(days=7)  
        dt_as_seconds = int(dt.strftime('%s'))
        token = jwt.encode(
          { 'sub': user_to_login.id, 'exp': dt_as_seconds },
          settings.SECRET_KEY,
          'HS256'
        )
        print(token)    

        return Response({
            'message': f'Welcome back, {user_to_login.first_name}',
            'token': token
        }, status.HTTP_202_ACCEPTED)


class UserListView(APIView):

    def get(self, _request):
        users = User.objects.all()
        try:
            populated_serialized_users = PopulatedUserSerializer(users, many=True)
            return Response(populated_serialized_users.data)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(APIView):

    def get(self, _request, pk):
        user = User.objects.get(pk=pk)
        try:
            populated_serialized_user = PopulatedUserSerializer(user)
            return Response(populated_serialized_user.data)
        except User.DoesNotExist as e:
            raise NotFound(str(e))
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    
    def get(self, request):
        try:
            headers = request.headers.get('Authorization')
            token = headers.replace('Bearer ', '')
            payload = jwt.decode(token, settings.SECRET_KEY, 'HS256')
            user = User.objects.get(pk=payload['sub'])
            populated_serialized_user = PopulatedUserSerializer(user)
            return Response(populated_serialized_user.data)
        except User.DoesNotExist as e:
            raise NotFound(str(e))
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)