from sqlalchemy import text

from app.database import engine


def execute_query(sql: str):

    with engine.connect() as connection:

        result = connection.execute(
            text(sql)
        )

        columns = list(result.keys())

        rows = [
            list(row)
            for row in result.fetchall()
        ]

    return {
        "columns": columns,
        "rows": rows
    }