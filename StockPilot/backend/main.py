from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app=FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def db():
    return sqlite3.connect("stock.db")

with db() as con:
    con.execute("CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name TEXT, category TEXT, quantity INTEGER, reorder INTEGER)")
    con.execute("CREATE TABLE IF NOT EXISTS movements(id INTEGER PRIMARY KEY, product TEXT, type TEXT, quantity INTEGER)")

@app.get("/products")
def products():
    with db() as con:
        return [dict(zip(["id","name","category","quantity","reorder"], r)) for r in con.execute("SELECT * FROM products")]

@app.post("/products")
def add_product(p: dict):
    with db() as con:
        con.execute("INSERT INTO products(name,category,quantity,reorder) VALUES(?,?,?,?)",
                    (p["name"], p["category"], p["quantity"], p["reorder"]))
    return {"message": "Product added"}

@app.post("/movement")
def movement(m: dict):
    with db() as con:
        row = con.execute("SELECT quantity FROM products WHERE name=?", (m["product"],)).fetchone()
        if not row:
            raise HTTPException(404, "Product not found")

        q = row[0] + m["quantity"] if m["type"] == "IN" else row[0] - m["quantity"]
        if q < 0:
            raise HTTPException(400, "Not enough stock")

        con.execute("UPDATE products SET quantity=? WHERE name=?", (q, m["product"]))
        con.execute("INSERT INTO movements(product,type,quantity) VALUES(?,?,?)",
                    (m["product"], m["type"], m["quantity"]))
    return {"message": "Stock updated"}

@app.get("/alerts")
def alerts():
    with db() as con:
        return [dict(zip(["id","name","category","quantity","reorder"], r))
                for r in con.execute("SELECT * FROM products WHERE quantity <= reorder")]

@app.get("/movements")
def history():
    with db() as con:
        return [dict(zip(["id","product","type","quantity"], r))
                for r in con.execute("SELECT * FROM movements ORDER BY id DESC")]
    
@app.put("/products/{id}")
def update_product(id: int, p: dict):
    with db() as con:
        result = con.execute(
            "UPDATE products SET name=?, category=?, quantity=?, reorder=? WHERE id=?",
            (p["name"], p["category"], p["quantity"], p["reorder"], id)
        )
        if result.rowcount == 0:
            raise HTTPException(404, "Product not found")
    return {"message": "Product updated"}
