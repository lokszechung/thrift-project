# Generated by Django 4.1.4 on 2022-12-08 21:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
        ('subcategories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subcategory',
            name='categories',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, related_name='categories', to='categories.category'),
            preserve_default=False,
        ),
    ]
