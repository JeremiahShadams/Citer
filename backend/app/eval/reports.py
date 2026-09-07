import json
from pathlib import Path

# Resolve data/reports relative to repo root or working directory
_REPO_REPORTS = Path(__file__).resolve().parents[3] / "data" / "reports"
REPORTS_DIR = _REPO_REPORTS if _REPO_REPORTS.exists() or _REPO_REPORTS.parent.exists() else Path("data/reports")


def save_report(run: dict) -> Path:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    path = REPORTS_DIR / f"eval_{run['dataset']}_{len(list(REPORTS_DIR.glob('*.json')))}.json"
    path.write_text(json.dumps(run, indent=2))
    return path


def load_reports() -> list[dict]:
    if not REPORTS_DIR.exists():
        return []
    return [json.loads(p.read_text(encoding="utf-8")) for p in REPORTS_DIR.glob("*.json")]