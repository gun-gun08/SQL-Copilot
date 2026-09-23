import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


def get_llm():

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured in .env"
        )

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0
    )


def generate_sql(question: str, schema: dict):

    llm = get_llm()

    schema_text = ""

    for table, columns in schema.items():

        schema_text += f"\nTable: {table}\n"

        for column in columns:

            schema_text += (
                f"- {column['name']} "
                f"({column['type']})\n"
            )

    prompt = f"""
You are an expert MySQL SQL assistant.

Your task is to convert a user's natural-language
question into a valid MySQL SELECT query.

DATABASE SCHEMA:
{schema_text}

USER QUESTION:
{question}

RULES:

1. Generate only a SELECT query.
2. Use only tables and columns present in the schema.
3. Do not invent tables or columns.
4. Use correct JOIN conditions.
5. Use GROUP BY when aggregation is required.
6. Use ORDER BY when sorting is requested.
7. Use LIMIT when the user requests a specific number of results.
8. Do not generate INSERT.
9. Do not generate UPDATE.
10. Do not generate DELETE.
11. Do not generate DROP.
12. Do not generate ALTER.
13. Do not generate TRUNCATE.
14. Return ONLY the SQL query.
"""

    response = llm.invoke(prompt)

    sql = response.content.strip()

    return sql