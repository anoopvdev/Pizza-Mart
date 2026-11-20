import re
from pathlib import Path
from collections import defaultdict

path = Path("pizzamart_data_only.sql")
data = path.read_text(encoding="utf-8")

def parse_values(s):
    rows = []
    i = 0
    while i < len(s):
        if s[i] != "(":
            i += 1
            continue

        i += 1
        values = []
        start = i
        quoted = False

        while i < len(s):
            c = s[i]

            if c == "\\" and quoted:
                i += 2
                continue

            if c == "'":
                if quoted and i + 1 < len(s) and s[i+1] == "'":
                    i += 2
                    continue
                quoted = not quoted

            elif c == "," and not quoted:
                values.append(s[start:i].strip())
                start = i + 1

            elif c == ")" and not quoted:
                values.append(s[start:i].strip())
                rows.append(values)
                i += 1
                break

            i += 1

    return rows

def kind(v):
    if v.upper() == "NULL":
        return "NULL"
    if v.startswith("'") and v.endswith("'"):
        return "TEXT"
    if re.fullmatch(r"-?\d+", v):
        return "INTEGER"
    if re.fullmatch(r"-?\d+\.\d+", v):
        return "DECIMAL"
    return "OTHER"

for line in data.splitlines():
    match = re.match(r"INSERT INTO `([^`]+)` VALUES (.*);$", line)
    if not match:
        continue

    table, values = match.groups()
    rows = parse_values(values)
    lengths = sorted(set(len(row) for row in rows))
    types = defaultdict(set)

    for row in rows:
        for index, value in enumerate(row, 1):
            types[index].add(kind(value))

    print(f"\n{table}: {len(rows)} rows | field counts: {lengths}")
    for index in sorted(types):
        print(f"  Position {index}: {', '.join(sorted(types[index]))}")
