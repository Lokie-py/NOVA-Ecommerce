from .models import Product

products = [
    Product(
        name="Nova Wireless Headphones",
        category="Electronics",
        price=2499,
        description="Premium wireless headphones with deep bass and comfortable all-day fit.",
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating=4.7,
    ),
    Product(
        name="Nova Smart Watch",
        category="Electronics",
        price=3999,
        description="Smart fitness watch with activity tracking, notifications and modern design.",
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating=4.6,
    ),
    Product(
        name="Classic Denim Jacket",
        category="Fashion",
        price=1899,
        description="Timeless denim jacket designed for everyday casual wear.",
        image="https://images.unsplash.com/photo-1551028719-00167b16eac5",
        rating=4.5,
    ),
    Product(
        name="Minimal Backpack",
        category="Accessories",
        price=1299,
        description="Lightweight everyday backpack with a clean minimal design.",
        image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        rating=4.4,
    ),
    Product(
        name="Running Sneakers",
        category="Footwear",
        price=2299,
        description="Comfortable lightweight sneakers suitable for running and daily activities.",
        image="https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating=4.8,
    ),
    Product(
        name="Ceramic Coffee Mug",
        category="Home",
        price=499,
        description="Elegant ceramic mug perfect for coffee, tea and your everyday desk setup.",
        image="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
        rating=4.3,
    ),
]


def seed_products(db):
    existing_products = db.query(Product).count()

    if existing_products == 0:
        db.add_all(products)
        db.commit()
        print("Products added successfully!")
    else:
        print("Products already exist.")
