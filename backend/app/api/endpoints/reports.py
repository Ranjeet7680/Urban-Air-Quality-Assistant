from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import ReportGenerateRequest, ReportOut
from app.services.report_service import ReportService
from app.api.deps import get_current_user_optional

router = APIRouter()

@router.post("/generate", response_model=ReportOut)
async def generate_report(
    req: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    return await ReportService.generate_report(
        db=db,
        report_type=req.report_type,
        city=req.city,
        comparison_city=req.comparison_city,
        user_id=user_id,
        include_ai_summary=req.include_ai_summary
    )

@router.get("/", response_model=List[ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    return ReportService.get_reports(db=db, user_id=user_id)

@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = ReportService.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    report = ReportService.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    csv_content = ReportService.export_csv(report)
    filename = f"Air_Quality_Report_{report.location_name}_{report.report_type}.csv".replace(" ", "_")
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
