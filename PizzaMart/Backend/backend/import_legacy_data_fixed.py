"""
PizzaMart legacy MySQL dump -> Django/PostgreSQL importer.

Run from the folder containing manage.py:
    python import_legacy_data.py --dry-run
    python import_legacy_data.py --import

The original SQL dump is read-only. The importer refuses to run if any
of the 11 destination tables already contains rows.
"""
import argparse
import os
import re
import sys
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

from django.apps import apps
from django.db import connection, transaction

SQL_FILE = Path(__file__).with_name("pizzamart_data_only.sql")

# Each list describes the legacy INSERT value order and the current Django
# database column to receive that value. None means intentionally skip.
MAPPINGS = {
    "user_user": [
        "id", "password", "last_login", "is_superuser", "username",
        "first_name", "is_staff", "is_active", "date_joined", "email", "phone",
    ],
    "user_userprofile": [
        "id", "profile_image", "gender", "user_id",
    ],
    "user_address": [
        "id", "full_name", "phone", "address_line", "city", "state",
        "pincode", "is_default", "created_at", "updated_at", "user_id",
    ],
    "user_category": [
        "id", "name", "description", "image", "is_active", "created_at",
    ],
    "user_pizzas": [
        "id", "name", "description", "image", "price", "is_available",
        "created_at", "updated_at", "category_id",
    ],
    "user_coupon": [
        # Legacy order inferred from the dump's value types:
        # usage_limit, used_count, dates, active, created_at, max_discount.
        "id", "code", "discount_type", "discount_value", "minimum_value",
        "usage_limit", "used_count", "start_date", "expiry_date",
        "is_active", "created_at", "max_discount",
    ],
    "user_cart": [
        "id", "created_at", "updated_at", "user_id", "coupon_id",
    ],
    "user_cartitems": [
        "id", "user_id", "added_at", "cart_id", "pizzas_id", "quantity",
    ],
    "user_order": [
        "id", "subtotal", "discount", "delivery_fee", "total_amount",
        "status", "payment_status", "created_at", "updated_at", "coupon_id",
        "user_id", "delivery_address", "delivery_city", "delivery_name",
        "delivery_phone", "delivery_pincode", "delivery_state", "order_number",
        "payment_method", "razorpay_order_id",
    ],
    "user_orderitems": [
        "id", "pizza_name", "unit_price", "quantity", "subtotal",
        "order_id", "pizzas_id",
    ],
    "user_payment": [
        "id", "payment_method", "transaction_id", "amount", "status",
        "created_at", "updated_at", "order_id",
    ],
}

# Parent tables must be imported before their dependent tables.
IMPORT_ORDER = [
    "user_user", "user_category", "user_coupon", "user_pizzas",
    "user_userprofile", "user_address", "user_cart", "user_order",
    "user_cartitems", "user_orderitems", "user_payment",
]

def split_sql_values(text):
    """Split VALUES tuples and fields while respecting quoted strings."""
    rows, row, token = [], [], []
    in_quote = False
    i = 0
    started = False

    while i < len(text):
        ch = text[i]

        if in_quote:
            token.append(ch)
            if ch == "\\" and i + 1 < len(text):
                i += 1
                token.append(text[i])
            elif ch == "'":
                if i + 1 < len(text) and text[i + 1] == "'":
                    i += 1
                    token.append(text[i])
                else:
                    in_quote = False
        else:
            if ch == "'" :
                in_quote = True
                token.append(ch)
            elif ch == "(":
                row, token, started = [], [], True
            elif ch == "," and started:
                row.append("".join(token).strip())
                token = []
            elif ch == ")" and started:
                row.append("".join(token).strip())
                rows.append(row)
                row, token, started = [], [], False
            elif started:
                token.append(ch)
        i += 1
    return rows

def decode_value(raw):
    raw = raw.strip()
    if raw.upper() == "NULL":
        return None
    if raw.startswith("'") and raw.endswith("'"):
        body = raw[1:-1]
        out, i = [], 0
        escapes = {
            "0": "\0", "b": "\b", "n": "\n", "r": "\r",
            "t": "\t", "Z": "\x1a", "\\": "\\", "'": "'",
            '"': '"',
        }
        while i < len(body):
            if body[i] == "\\" and i + 1 < len(body):
                i += 1
                out.append(escapes.get(body[i], body[i]))
            elif body[i:i+2] == "''":
                out.append("'")
                i += 1
            else:
                out.append(body[i])
            i += 1
        return "".join(out)
    if re.fullmatch(r"-?\d+", raw):
        return int(raw)
    if re.fullmatch(r"-?\d+\.\d+", raw):
        return raw  # Keep decimal precision; PostgreSQL casts this safely.
    raise ValueError(f"Unsupported SQL value token: {raw[:40]!r}")

def read_dump():
    if not SQL_FILE.exists():
        raise FileNotFoundError(f"SQL backup not found: {SQL_FILE}")
    source = SQL_FILE.read_text(encoding="utf-8-sig")
    statements = re.findall(
        r"INSERT\s+INTO\s+`([^`]+)`\s+VALUES\s*(.*?);",
        source, flags=re.IGNORECASE | re.DOTALL,
    )
    data = {}
    for table, values_text in statements:
        if table not in MAPPINGS:
            continue
        rows = [[decode_value(v) for v in row]
                for row in split_sql_values(values_text)]
        expected = len(MAPPINGS[table])
        for number, row in enumerate(rows, 1):
            if len(row) != expected:
                raise ValueError(
                    f"{table} row {number}: found {len(row)} values, "
                    f"expected {expected}"
                )
        data.setdefault(table, []).extend(rows)
    missing = set(MAPPINGS) - set(data)
    if missing:
        raise ValueError(f"Missing INSERT data for tables: {sorted(missing)}")
    return data

def table_model(table):
    for model in apps.get_app_config("user").get_models():
        if model._meta.db_table == table:
            return model
    raise LookupError(f"No Django model found for table {table}")

def validate_models(data):
    for table, rows in data.items():
        model = table_model(table)
        valid_columns = {f.column for f in model._meta.fields}
        for col in MAPPINGS[table]:
            if col not in valid_columns:
                raise ValueError(f"{table}: column {col!r} not in current model")
        print(f"{table}: {len(rows)} rows; model columns validated")

def import_rows(data):
    # Refuse to mix this migration with existing application records.
    for table in IMPORT_ORDER:
        model = table_model(table)
        if model.objects.exists():
            raise RuntimeError(
                f"{table} already contains records. Import stopped safely."
            )

    with transaction.atomic():
        for table in IMPORT_ORDER:
            columns = MAPPINGS[table]
            quoted_table = connection.ops.quote_name(table)
            quoted_columns = ", ".join(connection.ops.quote_name(c) for c in columns)
            placeholders = ", ".join(["%s"] * len(columns))
            sql = (
                f"INSERT INTO {quoted_table} ({quoted_columns}) "
                f"VALUES ({placeholders})"
            )
            # Convert MySQL integer flags (0/1) into real Python booleans
            # because PostgreSQL BooleanField does not accept integer values.
            model = table_model(table)
            prepared_rows = []
            for row in data[table]:
                converted = list(row)
                for index, column in enumerate(columns):
                    field = model._meta.get_field(column)
                    if field.get_internal_type() == "BooleanField":
                        value = converted[index]
                        if value is not None:
                            if value not in (0, 1, False, True):
                                raise ValueError(
                                    f"{table}.{column}: expected 0/1 boolean, "
                                    f"got {value!r}"
                                )
                            converted[index] = bool(value)
                prepared_rows.append(tuple(converted))

            with connection.cursor() as cursor:
                cursor.executemany(sql, prepared_rows)
            print(f"Imported {table}: {len(prepared_rows)} rows")

        # Explicit IDs were imported; reset all model sequences.
        models = [table_model(t) for t in IMPORT_ORDER]
        statements = connection.ops.sequence_reset_sql(no_style(), models)
        with connection.cursor() as cursor:
            for statement in statements:
                cursor.execute(statement)

        # Validate imported row counts inside the same transaction.
        for table in IMPORT_ORDER:
            actual = table_model(table).objects.count()
            expected = len(data[table])
            if actual != expected:
                raise RuntimeError(
                    f"{table}: expected {expected} rows, found {actual}"
                )

def no_style():
    from django.core.management.color import no_style as django_no_style
    return django_no_style()

def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--dry-run", action="store_true")
    group.add_argument("--import", dest="do_import", action="store_true")
    args = parser.parse_args()

    data = read_dump()
    validate_models(data)
    total = sum(len(rows) for rows in data.values())
    print(f"\nValidated {len(data)} tables and {total} rows.")
    if args.dry_run:
        print("DRY RUN ONLY: no database records were changed.")
        return
    print("\nStarting database import...")
    import_rows(data)
    print("\nImport completed and row counts verified.")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        sys.exit(1)
