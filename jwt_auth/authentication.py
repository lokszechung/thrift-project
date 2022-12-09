from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()

from django.conf import settings
import jwt

class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        print(request.headers)

        if not request.headers:
            print('no header present')
            return None

        headers = request.headers.get('Authorization')
        if not headers:
            print('authorization header not present')
            return None

        if not headers.startswith('Bearer '):
            print('invalid token format')
            raise PermissionDenied('Invalid Token')

        token = headers.replace('Bearer ', '')
        print(token)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, 'HS256')
            print('payload -> ', payload)
            user = User.objects.get(pk=payload['sub'])
            print(user)
        except User.DoesNotExist as e:
            raise PermissionDenied('User not found')
        except Exception as e:
            print(e)
            raise PermissionDenied(str(e))
        
        return (user, token)