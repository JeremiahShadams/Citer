from fastapi import APIRouter, BackgroundTasks
from app.eval.reports import load_reports, save_report
from app.eval.runner import run_eval
from app.schemas.eval import EvalRunRequest

router = APIRouter(tags=["eval"])


@router.post("/eval/run")
async def trigger_eval(req: EvalRunRequest, background_tasks: BackgroundTasks) -> dict:
    return {"status": "started", "dataset": req.dataset}


@router.get("/eval/runs")
async def list_runs() -> list[dict]:
    reports = load_reports()
    return reports