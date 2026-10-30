"""Compatible launcher for the canonical npm build in this working copy."""
from pathlib import Path
import subprocess
subprocess.run(['npm','run','build'],cwd=Path(__file__).resolve().parent,check=True)
