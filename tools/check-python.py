"""Syntax validation only: never loads the SDK or connects to hardware."""
import ast
import pathlib
import re

docs = pathlib.Path(__file__).resolve().parent.parent / "docs"
count = 0
for source in docs.glob("*.md"):
    for number, snippet in enumerate(re.findall(r"```python\s*\n(.*?)```", source.read_text(encoding="utf-8"), re.S), 1):
        ast.parse(snippet, filename=f"{source.name}:example-{number}")
        count += 1
print(f"Validated Python syntax in {count} examples. Hardware/ABI not tested.")
