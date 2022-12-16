# Generated by Django 4.1.4 on 2022-12-16 18:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subcategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('categories', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='subcategories', to='categories.category')),
            ],
        ),
    ]
