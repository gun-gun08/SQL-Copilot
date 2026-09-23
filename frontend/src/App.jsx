import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  Database,
  Home,
  History,
  Table2,
  Lightbulb,
  Settings,
  Moon,
  Sun,
  Sparkles,
  Copy,
  Check,
  Play,
  Search,
  ChevronRight,
  Clock3,
  Rows3,
  Columns3,
  Code2,
  Users,
  BarChart3,
  MapPin,
  Package,
  Bot,
  Zap,
  Menu,
  X,
} from "lucide-react";

import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function App() {
  const [question, setQuestion] = useState(
    "Show the top 5 customers by total spending"
  );

  const [sql, setSql] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [schema, setSchema] = useState({});
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [error, setError] = useState("");

  // Navigation references
  const queryRef = useRef(null);
  const historyRef = useRef(null);
  const schemaRef = useRef(null);
  const examplesRef = useRef(null);
  const resultsRef = useRef(null);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileMenu(false);
  };

  // =====================================================
  // LOAD DATABASE SCHEMA
  // =====================================================

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/schema`
      );

      if (response.data.status === "success") {
        setSchema(response.data.schema);
      }
    } catch (err) {
      console.error("Schema error:", err);
    }
  };

  // =====================================================
  // GENERATE SQL
  // =====================================================

  const generateSQL = async () => {
    if (!question.trim()) {
      setError("Please enter a database question.");
      return;
    }

    setLoading(true);
    setError("");
    setSql("");
    setColumns([]);
    setRows([]);

    try {
      const response = await axios.post(
        `${API_URL}/api/generate-sql`,
        {
          question,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.status === "success") {
        setSql(data.sql || "");
        setColumns(data.columns || []);
        setRows(data.rows || []);

        const newHistory = {
          question,
          time: "Just now",
        };

        setHistory((prev) => [
          newHistory,
          ...prev.filter(
            (item) => item.question !== question
          ),
        ]);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setError(
          data.message || "Query generation failed."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to SQL Copilot backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // COPY SQL
  // =====================================================

  const copySQL = async () => {
    if (!sql) return;

    try {
      await navigator.clipboard.writeText(sql);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // =====================================================
  // EXAMPLES
  // =====================================================

  const examples = [
    {
      label: "Top customers",
      icon: <Users size={15} />,
      question:
        "Show the top 5 customers by total spending",
    },
    {
      label: "Total revenue",
      icon: <BarChart3 size={15} />,
      question: "What is the total revenue?",
    },
    {
      label: "Sales by city",
      icon: <MapPin size={15} />,
      question: "Show total sales by city",
    },
    {
      label: "Top products",
      icon: <Package size={15} />,
      question:
        "Show the top 3 products by revenue",
    },
  ];

  // =====================================================
  // TABLE ICON
  // =====================================================

  const getTableIcon = (table) => {
    const tableName = table.toLowerCase();

    if (tableName.includes("customer")) {
      return <Users size={18} />;
    }

    if (tableName.includes("product")) {
      return <Package size={18} />;
    }

    if (tableName.includes("order")) {
      return <Table2 size={18} />;
    }

    return <Database size={18} />;
  };

  // =====================================================
  // SCHEMA TABLE CLICK
  // =====================================================

  const selectTable = (table) => {
    setQuestion(`Show all records from ${table}`);

    scrollToSection(queryRef);
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >

        <button
          className="brand brand-button"
          onClick={() => scrollToSection(queryRef)}
        >

          <div className="brand-icon">
            <Database
              size={28}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h1>SQL Copilot</h1>
            <span>
              AI-Powered SQL Assistant
            </span>
          </div>

        </button>

        <nav className="navigation">

          <button
            className="nav-item active"
            onClick={() =>
              scrollToSection(queryRef)
            }
          >
            <Home size={19} />
            <span>Ask Query</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              scrollToSection(historyRef)
            }
          >
            <History size={19} />
            <span>Query History</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              scrollToSection(schemaRef)
            }
          >
            <Table2 size={19} />
            <span>Database Schema</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              scrollToSection(examplesRef)
            }
          >
            <Lightbulb size={19} />
            <span>Examples</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              alert(
                "SQL Copilot Settings\n\nBackend: FastAPI\nAI: Gemini\nDatabase: MySQL"
              )
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

        </nav>

        {/* AI CARD */}

        <div className="sidebar-ai-card">

          <div className="ai-glow">
            <Bot size={46} />
          </div>

          <h3>
            Turn Questions
            <br />
            Into Insights
          </h3>

          <p>
            Chat with your database using
            natural language.
          </p>

          <div className="quote">
            "Data speaks,
            <br />
            we translate."
          </div>

        </div>

        {/* PROFILE */}

        <div className="sidebar-bottom">

          <div className="profile-circle">
            G
          </div>

          <div>
            <strong>SQL Copilot</strong>
            <small>v1.0.0</small>
          </div>

        </div>

      </aside>

      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="content">

        {/* TOP BAR */}

        <div className="topbar">

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          <div className="topbar-spacer" />

          <div className="database-status">

            <Database size={21} />

            <div>

              <strong>MySQL</strong>

              <span>
                <i></i>
                Connected
              </span>

            </div>

          </div>

          <button
            className="theme-button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div className="hero-title">

            <div className="sparkle-icon">
              <Sparkles size={25} />
            </div>

            <div>

              <h2>Ask Your Database</h2>

              <p>
                Get instant SQL queries and
                results using natural language
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <div className="workspace">

          {/* MAIN COLUMN */}

          <div className="main-column">

            {/* QUERY */}

            <section
              className="query-card"
              ref={queryRef}
            >

              <div className="question-area">

                <textarea
                  value={question}
                  maxLength={500}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  placeholder="Ask something about your database..."
                />

                <div className="question-footer">

                  <div className="language-pill">
                    <Code2 size={15} />
                    Natural Language
                  </div>

                  <span>
                    {question.length}/500
                  </span>

                </div>

              </div>

              <button
                className="generate-button"
                onClick={generateSQL}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Generate SQL
                    <kbd>Ctrl ↵</kbd>
                  </>
                )}

              </button>

            </section>

            {/* EXAMPLES */}

            <div
              className="examples-row"
              ref={examplesRef}
            >

              <span className="examples-label">
                Try these examples:
              </span>

              {examples.map((item) => (

                <button
                  key={item.label}
                  className="example-chip"
                  onClick={() =>
                    setQuestion(item.question)
                  }
                >
                  {item.icon}
                  {item.label}
                </button>

              ))}

            </div>

            {/* ERROR */}

            {error && (
              <div className="error-card">

                <strong>Query Error</strong>

                <span>{error}</span>

              </div>
            )}

            {/* GENERATED SQL */}

            {sql && (

              <section className="result-card">

                <div className="result-header">

                  <div className="result-title">

                    <div className="result-icon blue">
                      <Code2 size={20} />
                    </div>

                    <div>

                      <h3>
                        Generated SQL
                      </h3>

                      <p>
                        SQL query generated by
                        Gemini AI
                      </p>

                    </div>

                  </div>

                  <div className="result-actions">

                    <span className="validated">

                      <Check size={15} />

                      Validated

                    </span>

                    <button
                      className="copy-button"
                      onClick={copySQL}
                    >

                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}

                    </button>

                    <button
                      className="run-button"
                      onClick={() =>
                        resultsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                      }
                    >

                      <Play size={15} />

                      View Results

                    </button>

                  </div>

                </div>

                <div className="sql-container">

                  <div className="line-numbers">

                    {sql
                      .split("\n")
                      .map((_, index) => (
                        <span key={index}>
                          {index + 1}
                        </span>
                      ))}

                  </div>

                  <pre>{sql}</pre>

                </div>

              </section>

            )}

            {/* QUERY RESULTS */}

            {columns.length > 0 && (

              <section
                className="result-card"
                ref={resultsRef}
              >

                <div className="result-header">

                  <div className="result-title">

                    <div className="result-icon green">
                      <Table2 size={20} />
                    </div>

                    <div>

                      <h3>
                        Query Results
                      </h3>

                      <p>
                        {rows.length} rows returned
                      </p>

                    </div>

                  </div>

                  <div className="stats">

                    <div className="stat">

                      <Clock3 size={16} />

                      <div>
                        <strong>Live</strong>
                        <small>Execution</small>
                      </div>

                    </div>

                    <div className="stat">

                      <Rows3 size={16} />

                      <div>
                        <strong>
                          {rows.length}
                        </strong>
                        <small>Rows</small>
                      </div>

                    </div>

                    <div className="stat">

                      <Columns3 size={16} />

                      <div>
                        <strong>
                          {columns.length}
                        </strong>
                        <small>Columns</small>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>#</th>

                        {columns.map(
                          (column, index) => (
                            <th key={index}>
                              {column}
                            </th>
                          )
                        )}

                      </tr>

                    </thead>

                    <tbody>

                      {rows.map(
                        (row, rowIndex) => (

                          <tr key={rowIndex}>

                            <td className="row-number">
                              {rowIndex + 1}
                            </td>

                            {row.map(
                              (
                                value,
                                columnIndex
                              ) => (

                                <td
                                  key={columnIndex}
                                >
                                  {String(
                                    value ?? ""
                                  )}
                                </td>

                              )
                            )}

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            )}

          </div>

          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          <aside className="right-panel">

            {/* SCHEMA */}

            <section
              className="side-card"
              ref={schemaRef}
            >

              <div className="side-card-header">

                <div>

                  <h3>
                    <Database size={18} />
                    Database Schema
                  </h3>

                  <span>
                    {Object.keys(schema).length}
                    {" "}
                    tables available
                  </span>

                </div>

              </div>

              <div className="schema-search">

                <Search size={17} />

                <input
                  placeholder="Search tables or columns..."
                />

              </div>

              <div className="schema-list">

                {Object.entries(schema).map(
                  ([table, columns]) => (

                    <button
                      className="schema-item"
                      key={table}
                      onClick={() =>
                        selectTable(table)
                      }
                    >

                      <div className="schema-icon">
                        {getTableIcon(table)}
                      </div>

                      <div className="schema-info">

                        <strong>
                          {table}
                        </strong>

                        <span>
                          {columns.length}
                          {" "}
                          columns
                        </span>

                      </div>

                      <ChevronRight size={17} />

                    </button>

                  )
                )}

              </div>

            </section>

            {/* HISTORY */}

            <section
              className="side-card"
              ref={historyRef}
            >

              <div className="side-heading">

                <h3>
                  <History size={18} />
                  Query History
                </h3>

                <button
                  className="view-all-button"
                  onClick={() =>
                    scrollToSection(historyRef)
                  }
                >
                  View all
                </button>

              </div>

              <div className="history-list">

                {history.length === 0 ? (

                  <div className="empty-history">

                    <History size={25} />

                    <p>
                      Your recent queries
                      <br />
                      will appear here.
                    </p>

                  </div>

                ) : (

                  history
                    .slice(0, 5)
                    .map((item, index) => (

                      <button
                        className="history-item"
                        key={index}
                        onClick={() => {
                          setQuestion(
                            item.question
                          );

                          scrollToSection(
                            queryRef
                          );
                        }}
                      >

                        <div className="history-icon">
                          <Code2 size={16} />
                        </div>

                        <div>

                          <strong>
                            {item.question}
                          </strong>

                          <span>
                            <i></i>
                            {item.time}
                          </span>

                        </div>

                        <ChevronRight
                          size={15}
                        />

                      </button>

                    ))

                )}

              </div>

            </section>

            {/* PRO TIP */}

            <div className="tip-card">

              <div className="tip-icon">
                <Lightbulb size={20} />
              </div>

              <div>

                <strong>Pro Tip</strong>

                <p>
                  Be specific in your
                  questions for better
                  SQL results.
                </p>

              </div>

              <Zap size={17} />

            </div>

          </aside>

        </div>

        {/* FOOTER */}

        <footer className="footer">

          <div>
            <Database size={15} />
            SQL Copilot
          </div>

          <span>
            Powered by FastAPI • Gemini • MySQL
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;