from django.db import models
from django.core.validators import RegexValidator

# Create your models here.

class Listing(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(max_length=5000)
    price = models.DecimalField(max_digits=50, decimal_places=2, validators=[RegexValidator('[.0123456789]')])
    location = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    condition = models.ForeignKey(
        'conditions.Condition',
        related_name='listings',
        on_delete=models.DO_NOTHING
    )
    subcategory = models.ForeignKey(
        'subcategories.Subcategory',
        related_name='listings',
        on_delete=models.DO_NOTHING
    )
    image = models.CharField(max_length=1000, null=True)
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='listings',
        on_delete=models.CASCADE
    )
    featured = models.BooleanField(default=False)
    sold = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} £{self.price}"


  # add 
  # owner
  # updated_at