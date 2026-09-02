from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import engine, Base, get_db
from . import models

app = FastAPI(title="NOVA E-Commerce API")


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# DATABASE
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# HOME
# =====================================================


@app.get("/")
def home():
    return {"message": "NOVA E-Commerce API is running!"}


# =====================================================
# HEALTH CHECK
# =====================================================


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


# =====================================================
# PRODUCTS
# =====================================================


@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):

    products = db.query(models.Product).all()

    return products


@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not product:

        raise HTTPException(status_code=404, detail="Product not found")

    return product


# =====================================================
# CART SCHEMA
# =====================================================


class CartItemRequest(BaseModel):
    product_id: int
    quantity: int = 1


# =====================================================
# ADD TO CART
# =====================================================


@app.post("/api/cart")
def add_to_cart(item: CartItemRequest, db: Session = Depends(get_db)):

    # Check that product exists
    product = (
        db.query(models.Product).filter(models.Product.id == item.product_id).first()
    )

    if not product:

        raise HTTPException(status_code=404, detail="Product not found")

    # Check if product is already in cart
    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.product_id == item.product_id)
        .first()
    )

    if cart_item:

        cart_item.quantity += item.quantity

    else:

        cart_item = models.CartItem(product_id=item.product_id, quantity=item.quantity)

        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Product added to cart",
        "cart_item_id": cart_item.id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
    }


# =====================================================
# GET CART
# =====================================================


@app.get("/api/cart")
def get_cart(db: Session = Depends(get_db)):

    cart_items = db.query(models.CartItem).all()

    cart = []

    for item in cart_items:

        product = (
            db.query(models.Product)
            .filter(models.Product.id == item.product_id)
            .first()
        )

        if product:

            cart.append(
                {
                    "cart_item_id": item.id,
                    "product_id": product.id,
                    "name": product.name,
                    "price": product.price,
                    "image": product.image,
                    "quantity": item.quantity,
                    "subtotal": product.price * item.quantity,
                }
            )

    total = sum(item["subtotal"] for item in cart)

    return {"items": cart, "total": total}


# =====================================================
# REMOVE FROM CART
# =====================================================


@app.delete("/api/cart/{product_id}")
def remove_from_cart(product_id: int, db: Session = Depends(get_db)):

    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.product_id == product_id)
        .first()
    )

    if not cart_item:

        raise HTTPException(status_code=404, detail="Product not in cart")

    db.delete(cart_item)
    db.commit()

    return {"message": "Product removed from cart"}
