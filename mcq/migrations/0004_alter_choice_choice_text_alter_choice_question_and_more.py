# Generated by Django 4.2.2 on 2023-07-09 04:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("mcq", "0003_alter_choice_table_alter_question_table"),
    ]

    operations = [
        migrations.AlterField(
            model_name="choice",
            name="choice_text",
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name="choice",
            name="question",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="choices",
                to="mcq.question",
            ),
        ),
        migrations.AlterField(
            model_name="question",
            name="question_text",
            field=models.CharField(max_length=200),
        ),
        migrations.AlterModelTable(
            name="choice",
            table=None,
        ),
        migrations.AlterModelTable(
            name="question",
            table=None,
        ),
    ]