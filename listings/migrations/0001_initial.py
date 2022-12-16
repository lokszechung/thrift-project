# Generated by Django 4.1.4 on 2022-12-16 18:52

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('conditions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('description', models.TextField(max_length=5000)),
                ('price', models.DecimalField(decimal_places=2, max_digits=50, validators=[django.core.validators.RegexValidator('[.0123456789]')])),
                ('location', models.CharField(max_length=8)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('image', models.CharField(max_length=1000, null=True)),
                ('featured', models.BooleanField(default=False)),
                ('sold', models.BooleanField(default=False)),
                ('condition', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='listings', to='conditions.condition')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
