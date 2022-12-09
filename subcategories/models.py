from django.db import models

# Create your models here.
class Subcategory(models.Model):
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(
      'categories.Category',
      related_name='subcategories',
      on_delete=models.DO_NOTHING
    )
    def __str__(self):
        return self.name