from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from app.database import engine
from app.services.schema_service import get_database_schema
from app.services.gemini_service import generate_sql
from app.services.sql_validator import validate_sql
from app.services.query_service import execute_query


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="SQL Copilot API",
    description="AI-powered natural language to SQL assistant",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class SQLRequest(BaseModel):
    question: str


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "SQL Copilot API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# DATABASE CONNECTION TEST
# =========================================================

@app.get("/api/database-test")
def database_test():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT DATABASE()")
            )

            database_name = result.scalar()

        return {
            "status": "connected",
            "database": database_name
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# =========================================================
# DATABASE SCHEMA
# =========================================================

@app.get("/api/schema")
def database_schema():

    try:

        schema = get_database_schema()

        return {
            "status": "success",
            "schema": schema
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# =========================================================
# GENERATE SQL + VALIDATE + EXECUTE
# =========================================================

@app.post("/api/generate-sql")
def generate_sql_endpoint(request: SQLRequest):

    try:

        # 1. Get actual MySQL schema
        schema = get_database_schema()

        # 2. Generate SQL using Gemini
        generated_sql = generate_sql(
            request.question,
            schema
        )

        # 3. Clean and validate generated SQL
        sql = validate_sql(
            generated_sql
        )

        # 4. Execute validated SQL
        result = execute_query(
            sql
        )

        # 5. Return everything to React
        return {
            "status": "success",
            "question": request.question,
            "sql": sql,
            "columns": result["columns"],
            "rows": result["rows"]
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }
    