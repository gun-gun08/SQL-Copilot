import re


FORBIDDEN_KEYWORDS = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "CREATE",
    "RENAME",
    "GRANT",
    "REVOKE"
]


def clean_sql(sql: str) -> str:
    """
    Remove Markdown SQL code fences returned by the LLM.
    """

    sql = sql.strip()

    sql = re.sub(
        r"^```sql\s*",
        "",
        sql,
        flags=re.IGNORECASE
    )

    sql = re.sub(
        r"^```\s*",
        "",
        sql
    )

    sql = re.sub(
        r"\s*```$",
        "",
        sql
    )

    return sql.strip()


def validate_sql(sql: str) -> str:
    """
    Validate that the generated query is read-only.
    """

    sql = clean_sql(sql)

    if not sql:
        raise ValueError(
            "Generated SQL is empty."
        )

    # Remove trailing semicolon
    sql = sql.rstrip(";").strip()

    # Only one SQL statement is allowed
    if ";" in sql:
        raise ValueError(
            "Multiple SQL statements are not allowed."
        )

    # Query must begin with SELECT or WITH
    if not re.match(
        r"^(SELECT|WITH)\b",
        sql,
        re.IGNORECASE
    ):
        raise ValueError(
            "Only SELECT queries are allowed."
        )

    # Check dangerous SQL operations
    for keyword in FORBIDDEN_KEYWORDS:

        pattern = rf"\b{keyword}\b"

        if re.search(
            pattern,
            sql,
            re.IGNORECASE
        ):
            raise ValueError(
                f"Forbidden SQL operation: {keyword}"
            )

    return sql