"""Compatible launcher for the canonical local preview (port 5178 by default)."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).resolve().parent/'scripts/serve.py'),run_name='__main__')
