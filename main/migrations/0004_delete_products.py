# Generated by Django 5.0.1 on 2024-05-27 09:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_products'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Products',
        ),
    ]