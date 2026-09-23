from sqlalchemy import inspect

from app.database import engine


def get_database_schema():
    """
    Read tables and columns from the connected MySQL database.
    """

    inspector = inspect(engine)

    tables = inspector.get_table_names()

    schema = {}

    for table in tables:

        columns = inspector.get_columns(table)

        schema[table] = []

        for column in columns:

            schema[table].append({
                "name": column["name"],
                "type": str(column["type"]),
                "nullable": column["nullable"]
            })

    return schema