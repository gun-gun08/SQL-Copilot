# 🤖 SQL Copilot

### AI-Powered Natural Language to SQL Assistant

SQL Copilot is an AI-powered full-stack application that allows users to interact with a MySQL database using natural language.

Instead of manually writing SQL queries, users can simply ask questions such as:

> "Show the top 5 customers by total spending"

SQL Copilot analyzes the database schema, generates the appropriate SQL query using Gemini, validates the query, executes it against MySQL, and displays the results in a user-friendly dashboard.

---

## 🚀 Features

- 💬 Natural language database queries
- 🤖 AI-powered SQL generation using Google Gemini
- 🔗 LangChain integration
- 🧠 Schema-aware SQL generation
- 🛡️ SQL query validation and safety checks
- 🗄️ MySQL database integration
- ⚡ FastAPI backend
- ⚛️ React.js frontend
- 📊 Interactive query results
- 📋 Copy generated SQL
- 🕘 Query history
- 🔍 Database schema explorer
- 🌙 Dark mode
- 📱 Responsive interface
- ✨ Modern AI dashboard UI

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │ Natural Language    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vite           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │  Gemini +        │      │   MySQL Database │
        │  LangChain       │      │                  │
        └────────┬─────────┘      └────────┬─────────┘
                 │                         │
                 └────────────┬────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ SQL Validation &    │
                    │ Query Execution     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Results Dashboard   │
                    └─────────────────────┘
