"""Generate the Prisma Python client during the Vercel build."""

import os
import subprocess
import sys
from pathlib import Path


def main() -> None:
    # Prisma generate only needs the variable to exist. Runtime uses the real URL.
    if not os.environ.get("DATABASE_URL"):
        os.environ["DATABASE_URL"] = "postgresql://placeholder:placeholder@localhost:5432/placeholder"

    root = Path(__file__).resolve().parent
    schema = root / "prisma" / "schema.prisma"
    subprocess.check_call(
        [sys.executable, "-m", "prisma", "generate", f"--schema={schema}"],
        cwd=root,
    )


if __name__ == "__main__":
    main()
