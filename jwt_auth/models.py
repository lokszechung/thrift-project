from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.core.validators import MinLengthValidator

# Create your models here.

class User(AbstractUser):
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  email = models.EmailField(max_length=50, unique=True)
  telephone = models.CharField(max_length=11, validators=[MinLengthValidator(11)])
  profile_image = models.CharField(max_length=300, default=None, blank=True, null=True)
  def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"